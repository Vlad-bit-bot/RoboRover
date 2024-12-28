import gpiod
import time

SLEEP_TIME = 1e-10

class Board:
    def __init__(self, scl_pin, sda_pin, name):
        self.name = name

        self.chip = gpiod.Chip('gpiochip4')
        self.scl_line = self.chip.get_line(scl_pin)
        self.sda_line = self.chip.get_line(sda_pin)
        self.scl_line.request(consumer="SCL", type=gpiod.LINE_REQ_DIR_OUT)
        self.sda_line.request(consumer="SDA", type=gpiod.LINE_REQ_DIR_OUT)

    def __str__(self):
        return self.name

    def sendBit(self, bit):
        self.scl_line.set_value(0)
        self.sda_line.set_value(bit)
        self.scl_line.set_value(1)
        time.sleep(SLEEP_TIME)

