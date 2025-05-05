from Utils import X, Y, Z, FORWARD, BACKWARD, createBitMask, createMotionMask, createFinalMap
from ArduBoard import Board
import time 

mega1 = Board(17,27,"test")

##Keep in mind the *200 multiplier on the arduino
def dprint(x, y):
	    dy = int((y-511)/511 *(-12))
	    if(y == 200 or dy == 0):
		    Sarma(0,0)
	    else:
		    if (dy>0):
			    Sarma(dy+4, 1)
		    else :
			    Sarma(dy-4,0)
            
def Sarma(y,direction):
    final = createFinalMap(createMotionMask(X, direction, 0, 8),  ##fata
                        createMotionMask(Y, FORWARD, 0, 0), ##spate
                         createMotionMask(Z, FORWARD, 0, 0)) ##mijloc
    final2 =createBitMask(1,31)|final;
    mega1.sendBits(final2)
    time.sleep(10)


