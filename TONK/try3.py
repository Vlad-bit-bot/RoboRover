import minimalmodbus
import time

# -- 1. SET DRIVER PARAMETERS --
# According to the manual (page 7, address $8102), the default slave address is 1.
mb_address = 1 

port_name = '/dev/ttyUSB0' 

# -- 2. CREATE INSTRUMENT OBJECT --
try:
    # Make an "instrument" object for the motor driver
    driver = minimalmodbus.Instrument(port_name, mb_address) 
except Exception as e:
    print(f"Error: Could not connect to the device on {port_name}. Please check the port and connection.")
    print(f"Details: {e}")
    exit()

# -- 3. CONFIGURE SERIAL COMMUNICATION --
driver.serial.baudrate = 9600
driver.serial.bytesize = 8
driver.serial.parity = minimalmodbus.serial.PARITY_NONE
driver.serial.stopbits = 1
driver.serial.timeout  = 0.5  # seconds
driver.mode = minimalmodbus.MODE_RTU

# Good practice to clean up buffers
driver.clear_buffers_before_each_transaction = True

print(f"Successfully connected to driver at address {mb_address} on {port_name}.")

# -- 4. DEFINE DRIVER-SPECIFIC REGISTER ADDRESSES --
# Addresses from the manual are in Hex. We need to use them in Decimal.
# Use a Python interpreter or calculator: e.g., print(int("8106", 16)) -> 33030
REG_CONTROL_STATUS   = 33030  # $8106, for start/stop/mode
REG_COMM_SPEED_SET   = 33040  # $8110, to set the target speed in RPM
REG_ACTUAL_SPEED_GET = 33286  # $8206, to read the current speed
REG_VOLTAGE_GET      = 33291  # $820B, to read the supply voltage
REG_CURRENT_GET      = 33294
# -- 5. PERFORM ACTIONS (READ/WRITE) --
try:
    print("\n--- Reading Supply Voltage ---")
    # Read the value from the voltage register (function code 3 is default for read_register)
    supply_voltage_raw = driver.read_register(REG_VOLTAGE_GET, functioncode=3)
    # The manual (page 10) says "1 value = 0.1V", so we divide by 10
    supply_voltage_actual = supply_voltage_raw / 10.0
    print(f"Raw voltage value: {supply_voltage_raw}")
    print(f"Actual supply voltage: {supply_voltage_actual} V")

    # --- Example 2: Set Speed and Start Motor ---
    print("\n--- Sending Motor Commands ---")
    target_speed_rpm = 3500
    
    # IMPORTANT: Ensure the motor is safely mounted before running this part.
    print(f"Setting target speed to {target_speed_rpm} RPM...")
    # Write the speed value (function code 6 for single register write)
    driver.write_register(REG_COMM_SPEED_SET, target_speed_rpm, functioncode=6)
    
    print("Enabling motor (Forward Start)...")
    # To start the motor, we need to set the working mode and enable it.
    # From page 12 of the manual:
    # High byte = Working Mode -> 0x07 (with Hall, internal communication mode)
    # Low byte  = Control Status -> 0x01 (forward start)
    # We combine them into one 16-bit value: 0x0701
    start_command_value = 0x0701 # This equals 1793 in decimal
    driver.write_register(REG_CONTROL_STATUS, start_command_value, functioncode=6)
    
    print("Motor should be running. Waiting for 5 seconds...")
    time.sleep(5)
    
    current_value = driver.read_register(REG_CURRENT_GET, functioncode=3)
    print(f"Current: {current_value/4}")
    # --- Example 3: Stop the Motor ---
    print("Stopping motor (Brake Shutdown)...")
    # From page 12:
    # High byte = Working Mode -> 0x07 (same as before)
    # Low byte  = Control Status -> 0x04 (brake shutdown)
    # Combined value is 0x0704
    stop_command_value = 0x0704 # This equals 1796 in decimal
    driver.write_register(REG_CONTROL_STATUS, stop_command_value, functioncode=6)
    
    print("Motor command sequence finished.")

except minimalmodbus.ModbusException as e:
    print(f"\nMODBUS ERROR: {e}")
    print("This could be due to a wrong slave address, incorrect register, or communication issue.")

except Exception as e:
    print(f"\nAn unexpected error occurred: {e}")

finally:
    # It's crucial to close the serial port
    driver.serial.close()
    print("\nPorts Now Closed.")
