import minimalmodbus
from .dictionary import *

default_port = '/dev/ttyUSB0'

class Connection:

    def __init__(self, port_name, address):
        
        try:
            self.driver = minimalmodbus.Instrument(port_name, address) 
            
            self.driver.serial.baudrate = 9600
            self.driver.serial.bytesize = 8
            self.driver.serial.parity = minimalmodbus.serial.PARITY_NONE
            self.driver.mode = minimalmodbus.MODE_RTU

            self.driver.clear_buffers_before_each_transaction = True
            print(f"\033[1;95mBuna Puuuuuf! :)\033[0m")
            print(f"Driver on {port_name} at address {address} connected!")
        except Exception as e:
            print(f"Connection error on {port_name}; Error: {e}")
            exit()
    
    def read_03(self, reg):
        return self.driver.read_register(reg, functioncode=3)

    def write_06(self, reg, val):
        self.driver.write_register(reg, val, functioncode=6)

    def close_port(self):
        self.driver.serial.close()
        print("Port closed!")

    def error(self, e):
        self.close_port()
        print(f"Error! {e}")

#################################
#                               #
#   Telemetry data functions    #
#                               #
#################################

#Function used for reading voltage
    def read_voltage(self):
        try:
            voltage = self.read_03(REG_VOLTAGE_GET)
            return voltage/10
        except Exception as e:
            self.error(e)

#Function used for reading current
    def read_current(self): 
        try:
            current = self.read_03(REG_CURRENT_GET)
            return current/40
        except Exception as e:
            self.error(e)

#Funtion used for reading temperature
    def read_temp(self):
        try:
            temp = self.read_03(REG_TEMP_GET)
            return temp
        except Exception as e:
            self.error(e)


#####################################
#                                   #
#   Basic motor control functions   #
#                                   #
#####################################

#Function used for setting motor speed
    def set_motor_speed(self, rpm):
        try:
            self.write_06(REG_COMM_SPEED_SET, rpm)
        except Exception as e:
            self.error(e)

#Function used for turning on the motor
    def start(self):
        try:
            start_command_value = 0x0701 # 07 working mode, 01 start, no brakes, reverse
            self.write_06(REG_CONTROL_STATUS, start_command_value)
        except Exception as e:
            self.error(e)

#Function used for turning off the motor
    def stop(self):
        try:
            stop_command_value = 0x0704 # 07 working mode, stopped, brakes, reverse
            self.write_06(REG_CONTROL_STATUS, stop_command_value)
        except Exception as e:
            self.error(e)

#Function used for switching direction, 1 forward, 0 backward
    def setDirection(self, bit):
        try:
            command_value = 0x0701^(bit<<1)
            self.write_06(REG_CONTROL_STATUS, command_value)
        except Exception as e:
            self.error(e)

