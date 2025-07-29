from . import Connection
from datetime import datetime
import time
from .commands import CRCPoly

class Generator:

    def __init__(self):
        self.stockpile= [0x00]*9
        self.tokens = 8

    def CalculateCRC(self):
        crc = 0xFF
        for i in range(8):
            crc ^= self.stockpile[i]
            for j in range(8):
                if crc & 0x80:
                    crc = ((crc << 1) ^ CRCPoly) & 0xFF   # &0xFF gets only 8 bits, masking the other
                else:
                    crc = (crc << 1) & 0xFF

        self.stockpile[8] = crc
    

    def dumpStockpile(self):
        self.stockpile = [0x00]*9
        self.tokens = 8


    def addTokens(self, comm):
        for each in comm:
            if(self.tokens >= 0):
                self.stockpile[8-self.tokens] = each
                self.tokens = self.tokens - 1
            else:
                print(f"[{datetime.now().strftime('%H:%M:%S')}]\033[31m  Stockpile out of bounds!\033[0m")
                self.dumpStockpile()
    def signalStockpile(self, conn):  # Simple, single attempt at sending the Stockpile NON-BLOCKING
        self.CalculateCRC()
        if(conn.readStatus() == 1):     
            for each in self.stockpile:
                    conn.sendPackage(each)
            return False
        else:
            return True

    def deliverStockpile(self, conn): #Short, 'Buffer-like' time periord for the arduino to process what it has. decent middle ground
        FailedToRespond = True
        for i in range (500):
            FailedToRespond = self.signalStockpile(conn)
            break

        if(FailedToRespond):
            print(f"[{datetime.now().strftime('%H:%M:%S')}]  \033[31mBoard \33[0m{conn.name}\033[31m failed to respond in time. Maybe common ground?\033[0m")
            return False
        print(f"[{datetime.now().strftime('%H:%M:%S')}]  Stockpile delivered to\033[32m {conn.name}\033[0m! CRC value is {self.stockpile[8]}")
        return True

    def sendStockpile(self, conn):  #Long, for critial information. Tries everything it can to send the package. BLOCKING.
        while(self.signalStockpile(conn) == True):
            print(f"[{datetime.now().strftime('%H:%M:%S')}]\033[31m  Failed to deliver stockpile. Retrying...\033[0m")
            time.sleep(2)
