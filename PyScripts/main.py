from Utils import X, Y, Z, FORWARD, BACKWARD, createBitMask, createMotionMask, createFinalMap
from ArduBoard import Board

mega1 = Board(17,27,"test")


##Keep in mind the *200 multiplier on the arduino

final = createFinalMap(createMotionMask(X, FORWARD, 3, 8),   
                        createMotionMask(Y, FORWARD, 6, 8),
                         createMotionMask(Z, FORWARD, 8, 6))

print(final)
mega1.sendBits(final)
    
