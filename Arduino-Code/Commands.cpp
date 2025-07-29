//
// Created by vladd on 21/07/2025.
//
#include "config.h"
#include <Arduino.h>
#include <Servo.h>
//#include <Stepper.cpp>

Servo servo1;
Servo servo2;

const uint8_t MAX_COMMAND = 0x14;

void handleEmptyPackage() {

    //Serial.print("empty");
}

void handleSoftReset() {
    wdt_enable(WDTO_15MS);
}

void handleVarReset() {
    clearBuffer();
}

void handlePowerOffSteppers() {}

void handlePowerOnSteppers() {

    setupSteppers();
    //commandTable[BLINK_BUILTIN]();
    //Serial.print("setup");
}

void handlePowerOffServos() {}

void handlePowerOnServos() {
    //Serial.print("setup servo");
    servo1.attach(43);
    servo2.attach(45);
    servo1.write(90);
    servo2.write(90);

}

void handleBlinkBuiltin() {
    //Serial.print("cev");

    sei();

    const uint8_t blinkCount = 10;
    const unsigned long interval = 200;  // 200 ms


    for (uint8_t i = 0; i < blinkCount; ++i) {
        digitalWrite(13, HIGH);
        unsigned long starts = millis();
        while (millis() - starts < interval);  // Wait

        digitalWrite(13, LOW);
        starts = millis();
        while (millis() - starts < interval);  // Wait
    }


}

void handleTestSteppers() {
    uint8_t SomeSteps = 100;
    setStepX(SomeSteps);
    setStepY(SomeSteps);
    setStepZ(SomeSteps);
    //Serial.print("test");
}

void handleTestServos() {

    servo1.write(70);
    servo2.write(70);


}

void handleMoveIndividualStepper() {
    uint8_t motor = getNextByte(); // 0xA0, 0xA1 (A for X-motor, B for Y-motor, C for Z-motor; 0/1 for direction)
    uint8_t steps = getNextByte();
    uint8_t speed = getNextByte();

    switch (motor>>4){
        case 0x0A:{         //X-motor
            setDirX(motor%2);
            setStepX(steps);
            setSpeedX(speed);
            break;
        }
        case 0x0B:{         //Y-motor
            setDirY(motor%2);
            setStepY(steps);
            setSpeedY(speed);
            break;
        }
        case 0x0C:{         //Z-motor
            setDirZ(motor%2);
            setStepZ(steps);
            setSpeedZ(speed);
            break;
        }
    }
}

void handleRunAllSteppers() {
    //Serial.print(" -runall");
    bool dir = getNextByte() %2;
    setDirX(dir);
    setDirY(dir);
    setDirZ(dir);
    SetRunAll(true);

}
void handleStopAllSteppers(){
    SetRunAll(false);
}

void handleRotateIndividualServo() {}

void handleRotateMultipleServos() {
    uint8_t pos1 = getNextByte();
    uint8_t pos2 = getNextByte();

    servo1.write(pos1);
    servo2.write(pos2);
}

void handleSetPinHigh() {}

void handleSetPinLow() {}

void handleReadPin() {}

void handleStepperStatus() {}

void handleServoStatus() {}

void handleOverallStatus() {}

// Last value : 0x14
CommandHandler commandTable[MAX_COMMAND + 1] = {
        /* 0x00 EMPTY_PACKAGE           */ handleEmptyPackage,
        /* 0x01 SOFT_RESET             */ handleSoftReset,
        /* 0x02 VAR_RESET              */ handleVarReset,
        /* 0x03 POWEROFF_STEPPERS      */ handlePowerOffSteppers,
        /* 0x04 POWERON_STEPPERS       */ handlePowerOnSteppers,
        /* 0x05 POWEROFF_SERVOS        */ handlePowerOffServos,
        /* 0x06 POWERON_SERVOS         */ handlePowerOnServos,
        /* 0x07 BLINK_BUILTIN          */ handleBlinkBuiltin,
        /* 0x08 TEST_STEPPERS          */ handleTestSteppers,
        /* 0x09 TEST_SERVOS            */ handleTestServos,
        /* 0x0A MOVE_INDIVIDUAL_STEPPER*/ handleMoveIndividualStepper,
        /* 0x0B RUN_ALL_STEPPERS       */ handleRunAllSteppers,
        /* 0x0C ROTATE_INDIVIDUAL_SERVO*/ handleRotateIndividualServo,
        /* 0x0D ROTATE_MULTIPLE_SERVOS */ handleRotateMultipleServos,
        /* 0x0E SET_PIN_HIGH           */ handleSetPinHigh,
        /* 0x0F SET_PIN_LOW            */ handleSetPinLow,
        /* 0x10 READ_PIN               */ handleReadPin,
        /* 0x11 STEPPER_STATUS         */ handleStepperStatus,
        /* 0x12 SERVO_STATUS           */ handleServoStatus,
        /* 0x13 OVERALL_STATUS         */ handleOverallStatus,
        /* 0x14 STOP_ALL_STEPPERS      */ handleStopAllSteppers

};