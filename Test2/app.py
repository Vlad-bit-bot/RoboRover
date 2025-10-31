from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from libs import Controller
import socket

app = Flask(__name__, static_folder="frontend/dist", static_url_path="/")
CORS(app)

bot = Controller()

def get_ip():
    """Returnează IP-ul local al Raspberry Pi-ului."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    finally:
        s.close()
    return ip

# ===== Serve frontend-ul React (ControlHub) =====
@app.route("/")
def serve_frontend():
    return send_from_directory(app.static_folder, "index.html")

# ===== Endpoint de mișcare =====
@app.route("/api/move", methods=["POST"])
def move():
    data = request.get_json(force=True)
    x = float(data.get("x", 0))
    y = float(data.get("y", 0))
    y = -y  # inversăm axa Y pentru joystick grafic

    max_speed = 0.3
    left = (y + x) * max_speed
    right = (y - x) * max_speed

    # limităm valorile
    left = max(-max_speed, min(max_speed, left))
    right = max(-max_speed, min(max_speed, right))

    bot.setPower(left, right)
    return jsonify({"left": left, "right": right})

# ===== Endpoint de oprire =====
@app.route("/api/stop", methods=["POST"])
def stop():
    bot.setPower(0, 0)
    return jsonify({"status": "stopped"})

if __name__ == "__main__":
    ip = get_ip()
    print(f"🚀 ATLAS Flask server running at http://{ip}:8080")
    app.run(host="0.0.0.0", port=8080)
