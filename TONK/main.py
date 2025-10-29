from libs import Connection, default_port
import time

c = Connection(default_port, 1)
c1 = Connection('/dev/ttyUSB0',2)
print(f"Driver Voltage: {c.read_voltage()} V")

c.setSpeed(100)
c.start()
c1.setSpeed(100)
c1.start()
time.sleep(2)

print(f"Driver Temperature: {c.read_temp()} C")

c.setDirection(1)
c1.setDirection(1)
c.setSpeed(3000)
c1.setSpeed(3000)

time.sleep(5)
print(f"Motor Current(running): {c.read_current()+c1.read_current()} A")
time.sleep(10)

c.stop()
c1.stop()

print(f"Motor Current(stopping): {c.read_current()+c1.read_current()} A")

c.close_port()
c1.close_port()
