from libs import *
import time

gen = Generator()

leftMega = Connection(17,27,22,"LEFT MEGA")
rightMega = Connection(23, 24, 25, "RIGHT MEGA")

gen.addTokens([POWERON_STEPPERS, POWERON_SERVOS])

gen.deliverStockpile(leftMega)
gen.deliverStockpile(rightMega)
gen.dumpStockpile()

def forward():
    gen.addTokens([RUN_ALL_STEPPERS, 0])
    gen.signalStockpile(leftMega)
    gen.dumpStockpile()
    gen.addTokens([RUN_ALL_STEPPERS, 1])
    gen.signalStockpile(rightMega)
    gen.dumpStockpile()

def backward():
    gen.addTokens([RUN_ALL_STEPPERS, 1])
    gen.signalStockpile(leftMega)
    gen.dumpStockpile()
    gen.addTokens([RUN_ALL_STEPPERS, 0])
    gen.signalStockpile(rightMega)
    gen.dumpStockpile()

def stop():
    gen.addTokens([0x14])
    gen.deliverStockpile(leftMega)
    gen.deliverStockpile(rightMega)
    gen.dumpStockpile()

