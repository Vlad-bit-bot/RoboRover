from .ArduinoMega2560 import Board
from datetime import datetime
import time

class Connection:

    def __init__(self, sclk, miso, mosi, name):
        
        try:

            self.name = name
            self.board = Board(sclk, miso, mosi, name)
            self.testConnection()
        except Exception:
            print(f"[{datetime.now().strftime('%H:%M:%S')}]\033[31m  Connection Error!")
    
    def testConnection(self):
        testBuffer = [0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,119]
        for each in testBuffer:
            self.sendPackage(each)
        validity = 0
        for i in range(100000):
            if(self.board.readBit()==1):
                validity = 1
        if(validity):
            print(f"[{datetime.now().strftime('%H:%M:%S')}]  Connection with \033[032m{self.board.name}\033[0m has been established successfully!\033[32m :)\033[0m")
            return True
        else:
            print(f"[{datetime.now().strftime('%H:%M:%S')}]\033[31m  Connection with\033[0m {self.board.name}\033[31m has failed to establish. Maybe a common ground issue? :(\033[0m")
            return False

    def sendPackage(self, val):
        for i in range(8):
            self.board.sendBit((val>>i) & 0b1)
    
    def readStatus(self):
        try:
            return self.board.readBit()
        except Exception:
            return 0
