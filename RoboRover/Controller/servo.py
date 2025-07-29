import RPi.GPIO as GPIO
import threading

GPIO.setmode(GPIO.BCM)
servo1 =2
servo2 =3
servo3 =4
servo4 =14

GPIO.setup(servo1, GPIO.OUT)
GPIO.setup(servo2, GPIO.OUT)
GPIO.setup(servo3, GPIO.OUT)
GPIO.setup(servo4, GPIO.OUT)

pwm1=GPIO.PWM(servo1, 50)
pwm2=GPIO.PWM(servo2, 50)
pwm3=GPIO.PWM(servo3, 50)
pwm4=GPIO.PWM(servo4, 50)

pwm1.start(0)
pwm2.start(0)
pwm3.start(0)
pwm4.start(0)

def setAngle1(angle):
    duty = 2 + (angle/18)
    pwm1.ChangeDutyCycle(duty)

    threading.Timer(0.1, lambda:pwm1.ChangeDutyCycle(0)).start()

def setAngle2(angle):
    duty = 2 + (angle/18)
    pwm2.ChangeDutyCycle(duty)

    threading.Timer(0.1, lambda:pwm2.ChangeDutyCycle(0)).start()

def setAngle3(angle):
    duty = 2 + (angle/18)
    pwm3.ChangeDutyCycle(duty)

    threading.Timer(0.1, lambda:pwm3.ChangeDutyCycle(0)).start()

def setAngle4(angle):
    duty = 2 + (angle/18)
    pwm4.ChangeDutyCycle(duty)

    threading.Timer(0.1, lambda:pwm4.ChangeDutyCycle(0)).start()
