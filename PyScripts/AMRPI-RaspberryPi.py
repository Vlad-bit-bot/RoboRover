import gpiod
import time

SCL = 17
SDA = 27

SLEEP_TIME = 1e-10

chip = gpiod.Chip('gpiochip4')
scl_line = chip.get_line(SCL)
sda_line = chip.get_line(SDA)
scl_line.request(consumer="SCL", type=gpiod.LINE_REQ_DIR_OUT)
sda_line.request(consumer="SDA", type=gpiod.LINE_REQ_DIR_OUT)

X = 3
Y = 2
Z = 1
FORWARD = 1
BACKWARD = 0

def sendBit(bit):
    scl_line.set_value(0)
    sda_line.set_value(bit)
    scl_line.set_value(1)
    time.sleep(SLEEP_TIME)

def createBitMask(val, pos):
    mask = 0x00000000
    mask = mask | (val << (pos - 1))
    if (mask <= 0xFFFFFFFF):
        return mask
    print("INVALID MASK; OVER 32bits; ERROR CODE: 100")
    return 0b0


def createMotionMask(motor, direction, steps, delay):
    if direction <= 1 and steps < 32 and delay < 16:
        return (createBitMask(direction, motor * 10) | createBitMask(delay, motor * 10 - 4) | createBitMask(steps,
                                                                                                            motor * 10 - 9))
    print(f"INVALID MASK FOR: {motor}  ERROR CODE: 101; Replaced with 0b")
    return 0b0


def createFinalMap(Xmask, Ymask, Zmask):
    return createBitMask(0, 31) | Xmask | Ymask | Zmask

##Keep in mind the *200 multiplier on the arduino

final = createFinalMap(createMotionMask(X, FORWARD, 4, 8),   
                         createMotionMask(Y, FORWARD, 6, 8),
                         createMotionMask(Z, FORWARD, 8, 6))

print(final)
for i in range(32):
    bit = (final>>i) & 0b1
    sendBit(bit)
    
