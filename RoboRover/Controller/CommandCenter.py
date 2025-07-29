from flask import Flask, render_template, request, jsonify
import requests
from RobotManager import *
import time

app = Flask(__name__)

@app.route('/post', methods =['POST'])
def get_data():
    command = b'S'

    data = request.get_data()
    
    if(data == b'F'):
        forward()
    elif(data == b'B'):
        backward()
    elif(data == b'L'):
        command = b'L'
    elif(data == b'R'):
        command = b'R'
    elif(data == b'0'):
        stop()

    response = requests.post('http://192.168.50.102:3535/post', data = command, headers={'Content-Type':'application/octet-stream'})
    
    return f"Send Command {response}"

@app.route('/')
def index():
    return render_template('index.html')

if( __name__ == "__main__"):
    app.run(host="192.168.50.102", port="8000", threaded = False)
