from libs import Controller
import time


bot = Controller()

time.sleep(4)
bot.setPower(0.3, 0.2)
time.sleep(10)
bot.setPower(0, 0)

