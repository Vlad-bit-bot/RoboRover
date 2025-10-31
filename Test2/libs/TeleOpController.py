from .BLD515C_lib import Connection, default_port   # importing all basic actions
from .dictionary import *                           # importing all definitions

class Controller:

    def __init__(self):
        
        self.rightMotor = Connection(default_port, 1)
        self.leftMotor = Connection(default_port, 2)

#########################################
#                                       #
#   Advanced Movement with joystick     #
#                                       #
#########################################

#Funtion for setting power (-1 to 1), -100% to 100%
    def setPower(self, right_power:float, left_power:float):
        
        MAX_SPEED = 3000 # Maximum allowed by the gearbox
        
        def applyPower(motor, power):
            direction = 1 if power >=0 else 0
            motor.setDirection(direction)
            motor.set_motor_speed(abs(power)*MAX_SPEED)

        applyPower(self.rightMotor, right_power)
        applyPower(self.leftMotor, left_power)

#Function for setting movement based on a position vector
    
        


        
