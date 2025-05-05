from picamera2 import Picamera2, Preview
from picamera2.outputs import FileOutput
from picamera2.encoders import MJPEGEncoder
from AMRPI import dprint

from libcamera import controls
from flask import Flask, send_file, render_template, Response, request, jsonify
from threading import Condition
import threading
import io


class Buffer(io.BufferedIOBase):
	def __init__(self):
		self.frame = None
		self.condition = Condition()
		
	def write(self, buf):
		with self.condition:
			self.frame = buf
			self.condition.notify_all()

class Camera():
	def __init__(self):
		self.cam = Picamera2()
		self.cam.configure(self.cam.create_preview_configuration(main={"size":(720,480)}))
		self.cam.start()
		self.output = Buffer()
		self.cam.start_recording(MJPEGEncoder(), FileOutput(self.output))
		self.cam.set_controls({"AfMode":controls.AfModeEnum.Continuous, "AfSpeed":controls.AfSpeedEnum.Fast})

cam = Camera()


def create_stream():
	while True:
			with cam.output.condition:
				cam.output.condition.wait()
				frame = cam.output.frame
				yield (b'--frame\r\n'
					b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

x = 0;
y = 0;
#######
#FLASK#
#######

app = Flask(__name__)
@app.route('/control', methods=['POST'])
def control():
	data = request.get_json()
	x = data.get('x')
	y = data.get('y')
	##dprint(x,y)
	return jsonify({'status':'received'}), 200

@app.route('/video')
def get_stream():
    
		return Response(create_stream(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/')
def index():
	return render_template('index.html')



if __name__ == '__main__':
	app.run(host = "192.168.50.102", port = 8080, threaded = True) 
							
