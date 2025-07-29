from libs import *
from servo import *
from flask import Flask, render_template, request, jsonify
import requests

def handleReq(data):
    if(data== b'L'):
        print("left")
        setAngle1(45)
        setAngle2(105)
        setAngle3(45)
        setAngle4(135)
    elif(data==b'R'):
        print("right")
        setAngle1(135)
        setAngle2(15)
        setAngle3(135)
        setAngle4(45)
    elif(data==b'S'):
        print("mid")
        setAngle1(90)
        setAngle2(60)
        setAngle3(90)
        setAngle4(90)

app = Flask(__name__)

@app.route('/post', methods= ['POST'])
def getData():
    data = request.get_data()
    handleReq(data)
    return "OK", 200 

@app.route('/')
def index():
    return render_template('index.html')

if (__name__ == "__main__"):
    app.run(host="192.168.50.102", port="3535", threaded = False)
