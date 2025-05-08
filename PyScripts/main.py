from Utils import X, Y, Z, FORWARD, BACKWARD, createBitMask, createMotionMask, createFinalMap
from ArduBoard import Board
import time 

mega1 = Board(22,23,"test")
mega2 = Board(17,27,"test1")

##Keep in mind the *200 multiplier on the arduino
def CreateCommand(x, y):
	    dy = int((y-511)/511 *(-12))
	    if(y == 200 or dy == 0):
		    stop = createBitMask(3,31)
		    mega1.sendBits(stop)
		    mega2.sendBits(stop)
	    else:
		    if (dy>0):
			    SendCommand(dy+4, 1)
		    else :
			    SendCommand(dy-4,0)
            
def SendCommand(y,direction):
    print(y, direction)
    speed = abs(y)
    final2 = createBitMask(1,31)| createFinalMap(createMotionMask(X, 1-direction, 0, speed),  ##fata
                        createMotionMask(Y, 1-direction, 0, speed), ##spate
                         createMotionMask(Z, 1-direction, 0, speed)) ##mijloc
			 
    final =createBitMask(1,31)| createFinalMap(createMotionMask(X, direction, 0, speed),  ##fata
                        createMotionMask(Y, direction, 0, speed), ##spate
                         createMotionMask(Z, direction, 0, speed)) ##mijloc
    mega1.sendBits(final)
    mega2.sendBits(final2)
    

