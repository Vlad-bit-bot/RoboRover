X = 3
Y = 2
Z = 1
FORWARD = 1
BACKWARD = 0

def createBitMask(val, pos):    # Creates a mask containing bits of a specified int starting at a specific place
    mask = 0x00000000
    mask = mask | (val << (pos - 1))
    if (mask <= 0xFFFFFFFF):
        return mask
    print("INVALID MASK; OVER 32bits; ERROR CODE: 100")
    return 0b0


def createMotionMask(motor, direction, steps, delay):       #Creates a mask that contains all the data a singular stepper needs
    if direction <= 1 and steps < 32 and delay < 16:
        return (createBitMask(direction, motor * 10) | createBitMask(delay, motor * 10 - 4) | createBitMask(steps,
                                                                                                            motor * 10 - 9))
    print(f"INVALID MASK FOR: {motor}  ERROR CODE: 101; Replaced with 0b")
    return 0b0


def createFinalMap(Xmask, Ymask, Zmask):                       #Overlays 3 Motion masks in order to create a 32bit map containing info for the motion of 3 steppers
    return createBitMask(0, 31) | Xmask | Ymask | Zmask
