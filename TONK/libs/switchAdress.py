import minimalmodbus

# connect to device currently at address 1
drv = minimalmodbus.Instrument('/dev/ttyUSB0', 1)
drv.serial.baudrate = 9600
drv.serial.timeout = 0.5

# 1) Write new ID (e.g. 2) into register 0x8102
drv.write_register(0x8102, 2, functioncode=6)

# 2) Save parameters permanently (write 0xFFFF to 0x81FF)
drv.write_register(0x81FF, 0xFFFF, functioncode=6)

