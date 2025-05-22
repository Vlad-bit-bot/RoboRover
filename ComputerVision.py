from picamera2 import Picamera2
from flask import Flask, Response, request, jsonify
from threading import Condition
import threading
import io
import cv2
import numpy as np
import tensorflow as tf
from libcamera import controls
from AMRPI import CreateCommand

class Buffer(io.BufferedIOBase):
    def __init__(self):
        self.frame = None
        self.condition = Condition()

    def write(self, buf):
        with self.condition:
            self.frame = buf
            self.condition.notify_all()

class Camera:
    def __init__(self):
        self.cam = Picamera2()
        self.cam.configure(self.cam.create_preview_configuration(main={"size": (1280, 720), "format": "RGB888"}))
        self.cam.start()
        self.output = Buffer()
        self.cam.start_recording(MJPEGEncoder(), FileOutput(self.output))
        self.cam.set_controls({"AfMode": controls.AfModeEnum.Continuous, "AfSpeed": controls.AfSpeedEnum.Fast})

cam = Camera()

# Load TensorFlow Lite model and allocate tensors
interpreter = tf.lite.Interpreter(model_path="efficientdet.tflite")
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Load labels
with open("labels.txt", "r") as f:
    labels = [line.strip() for line in f.readlines()]

def detect_and_annotate(frame):
    # Preprocess the frame
    input_size = input_details[0]['shape'][1:3]
    resized_frame = cv2.resize(frame, tuple(input_size))
    input_data = np.expand_dims(resized_frame, axis=0)
    input_data = input_data.astype(np.uint8)  # Adjust dtype if necessary

    # Set the tensor to the input data
    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()

    # Retrieve detection results
    boxes = interpreter.get_tensor(output_details[0]['index'])[0]
    class_ids = interpreter.get_tensor(output_details[1]['index'])[0]
    scores = interpreter.get_tensor(output_details[2]['index'])[0]

    height, width, _ = frame.shape

    for i in range(len(scores)):
        if scores[i] > 0.5:
            class_id = int(class_ids[i])
            if class_id < len(labels):
                label = labels[class_id]
                if label.lower() == "person":
                    ymin, xmin, ymax, xmax = boxes[i]
                    (left, top, right, bottom) = (int(xmin * width), int(ymin * height),
                                                 int(xmax * width), int(ymax * height))
                    cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                    cv2.putText(frame, label, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX,
                                0.5, (0, 255, 0), 2)
    return frame

def create_stream():
    while True:
        with cam.output.condition:
            cam.output.condition.wait()
            frame = cam.output.frame
            np_frame = np.frombuffer(frame, dtype=np.uint8)
            image = cv2.imdecode(np_frame, cv2.IMREAD_COLOR)
            annotated_image = detect_and_annotate(image)
            ret, jpeg = cv2.imencode('.jpg', annotated_image)
            if not ret:
                continue
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')

app = Flask(__name__)

@app.route('/control', methods=['POST'])
def control():
    data = request.get_json()
    x = data.get('x')
    y = data.get('y')
    CreateCommand(x, y)
    return jsonify({'status': 'received'}), 200

@app.route('/video')
def get_stream():
    return Response(create_stream(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/')
def index():
    return "RoboRover Video Stream"

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, threaded=True)
