from libs import *
import time

mega = Generator()
meg = Connection(17,27,22, "ArduinoGoBRRRRR")
mega.addTokens([0x06])

mega.deliverStockpile(meg)
mega.dumpStockpile()

time.sleep(2)
x = 10
while True:
    x= x+10
    if(x == 180):
        x = 0
    mega.addTokens([0x0D, x, 100])
    time.sleep(1)
    mega.sendStockpile(meg)
    mega.dumpStockpile()

def test():
    mega.addTokens([RUN_ALL_STEPPERS,0]) 
    if(mega.signalStockpile(meg)):
        print("a trimis")
    mega.dumpStockpile()


