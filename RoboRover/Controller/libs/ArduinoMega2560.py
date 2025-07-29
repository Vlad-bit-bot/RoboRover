import gpiod
import time
from datetime import datetime

SLEEP_TIME = 1e-6

class Board:

    def __init__(self, SCLK_PIN, MISO_PIN, MOSI_PIN, name):
	
        try:
            self.scl_pin = SCLK_PIN
            self.name = name
            self.chip = gpiod.Chip('gpiochip4')
            self.SCLK_LINE = self.chip.get_line(SCLK_PIN)
            self.MISO_LINE = self.chip.get_line(MISO_PIN)
            self.MOSI_LINE = self.chip.get_line(MOSI_PIN)
            self.SCLK_LINE.request(consumer="SCLK", type = gpiod.LINE_REQ_DIR_OUT)
            self.MISO_LINE.request(consumer="MISO", type = gpiod.LINE_REQ_DIR_OUT)
            self.MOSI_LINE.request(consumer="MOSI", type = gpiod.LINE_REQ_DIR_IN)
            self.SCLK_LINE.set_value(0)
            print(f"[{datetime.now().strftime('%H:%M:%S')}]  Communication pins (SCLK: {SCLK_PIN}, MISO: {MISO_PIN} and MOSI: {MOSI_PIN}) for board \033[31m{name}\033[0m have been allocated \033[32msuccessfully\033[0m!")
        except Exception:
            print(f"[{datetime.now().strftime('%H:%M:%S')}]  \033[31mCommunication pins for board \033[0m{name} \033[31mcannot be allocated!")  


    def sendBit(self, bit):
    
        self.SCLK_LINE.set_value(0)
        self.MISO_LINE.set_value(bit)
        self.SCLK_LINE.set_value(1)
        time.sleep(SLEEP_TIME)

    def readBit(self):
        try:
            return self.MOSI_LINE.get_value();
        except Exception:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] \033[31mLine fault! \033[0m")
            return 0


