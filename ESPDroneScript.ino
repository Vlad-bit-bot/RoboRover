#include <WiFi.h>
#include <WebServer.h>
#include "esp_camera.h"
#include "esp_http_server.h" 

// ========== WIFI ==========
const char* ssid = "RVR";
const char* password = "RoboRover2025!";

// ========== ESC PINS ==========
#define ESC1 13
#define ESC2 12
#define ESC3 15
#define ESC4 2

// PWM CONFIG
#define PWM_FREQ      50
#define PWM_RES_BITS 16
#define MIN_PULSE    1000
#define MAX_PULSE    2000

// ========== CAMERA PINS ==========
#define PWDN_GPIO_NUM  -1
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM  21
#define SIOD_GPIO_NUM  26
#define SIOC_GPIO_NUM  27
#define Y9_GPIO_NUM    35
#define Y8_GPIO_NUM    34
#define Y7_GPIO_NUM    39
#define Y6_GPIO_NUM    36
#define Y5_GPIO_NUM    19
#define Y4_GPIO_NUM    18
#define Y3_GPIO_NUM    5
#define Y2_GPIO_NUM    4
#define VSYNC_GPIO_NUM 25
#define HREF_GPIO_NUM  23
#define PCLK_GPIO_NUM  22

WebServer server(80);
static httpd_handle_t camera_httpd = NULL;


void attachAllESCs() {
  ledcAttach(ESC1, PWM_FREQ, PWM_RES_BITS);
  ledcAttach(ESC2, PWM_FREQ, PWM_RES_BITS);
  ledcAttach(ESC3, PWM_FREQ, PWM_RES_BITS);
  ledcAttach(ESC4, PWM_FREQ, PWM_RES_BITS);
}

void setAllESCs(int pulse_us) {
  int duty = map(pulse_us, 1000, 2000, 3277, 6553); 
  ledcWrite(ESC1, duty);
  ledcWrite(ESC2, duty);
  ledcWrite(ESC3, duty);
  ledcWrite(ESC4, duty);
}

void calibrateESCs() {
  setAllESCs(MAX_PULSE); delay(2000);
  setAllESCs(MIN_PULSE); delay(2000);
}

// ========== CAMERA STREAM ==========
static esp_err_t stream_handler(httpd_req_t *req) {
  camera_fb_t * fb = NULL;
  esp_err_t res = ESP_OK;
  size_t _jpg_buf_len = 0;
  uint8_t * _jpg_buf = NULL;
  char part_buf[128]; 

  res = httpd_resp_set_type(req, "multipart/x-mixed-replace;boundary=frame");
  if (res != ESP_OK) {
    Serial.printf("Failed to set HTTP response type: %d\n", res);
    return res;
  }

  while (true) {
    fb = esp_camera_fb_get(); 
    if (!fb) {
      Serial.println("Camera capture failed");
      res = ESP_FAIL;
      vTaskDelay(100 / portTICK_PERIOD_MS); 
      continue;
    }

    _jpg_buf = fb->buf;
    _jpg_buf_len = fb->len;

    int header_len = snprintf(part_buf, sizeof(part_buf),
                              "--frame\r\n"
                              "Content-Type: image/jpeg\r\n"
                              "Content-Length: %u\r\n\r\n",
                              (unsigned int)_jpg_buf_len);

    if (header_len < 0 || header_len >= sizeof(part_buf)) {
      Serial.println("Failed to build MJPEG header or buffer too small");
      res = ESP_FAIL;
    } else {
      // antetul
      res = httpd_resp_send_chunk(req, part_buf, header_len);
    }
    
    //  JPEG
    if (res == ESP_OK) {
      res = httpd_resp_send_chunk(req, (const char *)_jpg_buf, _jpg_buf_len);
    }

    if (res == ESP_OK) {
      res = httpd_resp_send_chunk(req, "\r\n", 2);
    }

    esp_camera_fb_return(fb); 
    if (res != ESP_OK) {
      Serial.printf("Error sending frame: %d\n", res);
      break; 
    }

    vTaskDelay(10 / portTICK_PERIOD_MS); 
  }

  return res;
}

void startCameraServer() {
  httpd_config_t config = HTTPD_DEFAULT_CONFIG();
  config.server_port = 8080; 
  if (httpd_start(&camera_httpd, &config) == ESP_OK) {
    httpd_uri_t uri_stream = {
      .uri       = "/stream",
      .method    = HTTP_GET,
      .handler   = stream_handler,
      .user_ctx  = NULL
    };
    httpd_register_uri_handler(camera_httpd, &uri_stream);
    Serial.println("Camera server started on port 8080 at /stream");
  } else {
    Serial.println("Failed to start camera server!");
  }
}

// ========== WEB UI ==========
void handleRoot() {
  String html = R"rawliteral(
  <!DOCTYPE html><html><head>
  <meta charset='UTF-8'>
  <title>RVR ESC Control</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin:0; font-family:sans-serif; background:black; color:white; text-align:center; }
    h2 { background:rgba(0,0,0,0.6); padding:10px; }
    .overlay {
      position:absolute; top:20px; left:50%; transform:translateX(-50%);
      background:rgba(0,0,0,0.5); padding:15px; border-radius:10px;
      z-index: 10; /* Asigură că overlay-ul este deasupra imaginii */
    }
    img {
      position:fixed; top:0; left:0; width:100vw; height:100vh; object-fit:cover; z-index:-1;
    }
    input[type=range] {
      width: 300px;
    }
  </style>
  </head><body>
    <img src='http://)rawliteral" + WiFi.localIP().toString() + R"rawliteral(:8080/stream' />
    <div class='overlay'>
      <h2>RVR Drone - ESC Control</h2>
      <input type='range' min='1000' max='2000' value='1100' id='throttle' oninput='update(this.value)'>
      <p id='val'>Throttle: 1100</p>
    </div>
    <script>
      function update(val) {
        document.getElementById('val').innerText = "Throttle: " + val;
        fetch('/set?val=' + val);
      }
    </script>
  </body></html>
  )rawliteral";

  server.send(200, "text/html", html);
}

void handleSet() {
  if (server.hasArg("val")) {
    int val = server.arg("val").toInt();
    if (val >= 1000 && val <= 2000) {
      setAllESCs(val);
      Serial.printf("Setting ESCs to: %d us\n", val); 
    }
  }
  server.send(204); 
}

// ========== SETUP si LOOP ==========
void setup() {
  Serial.begin(115200); 
  Serial.setTxBufferSize(2048); 

  // ESC
  attachAllESCs();
  calibrateESCs();
  Serial.println("ESCs initialized and calibrated.");

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  
  config.frame_size = FRAMESIZE_QVGA; 

  config.jpeg_quality = 10; 
  config.fb_count = 2; 

  
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x\n", err);
    return; // Nu continua dacă inițializarea camerei a eșuat
  }
  Serial.println("Camera initialized successfully.");
  delay(1000); // Adaugă o întârziere scurtă după inițializarea camerei

  // WiFi
  Serial.printf("Connecting to WiFi %s ", ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.printf("WiFi connected, IP: %s\n", WiFi.localIP().toString().c_str());

  startCameraServer(); 
  server.on("/", handleRoot); 
  server.on("/set", handleSet); 
  server.begin(); 
  Serial.println("Web server started on port 80.");
}

void loop() {
  server.handleClient(); 
}
