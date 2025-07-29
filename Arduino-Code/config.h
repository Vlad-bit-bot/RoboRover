//
// Created by vladd on 10/07/2025.
//

#ifndef ROVERCONTROLLER_CONFIG_H
#define ROVERCONTROLLER_CONFIG_H

#include <Arduino.h>
#include <avr/wdt.h>

//MACRO FUNCTIONS
#define SET_BIT(reg, bit, value) (value? reg|= (1<<bit) : reg&= ~(1<<bit))
#define GET_BITS(reg, bits, pos) ((reg>>(pos-1))&((1<<bits)-1))
#define SWITCH_BIT(reg, bit) (reg ^=(1<<bit))

//MOTOR-RELATED
#define FORWARD 1
#define BACKWARDS 0
#define MULTIPLIER 10

//COMMANDS

enum Command : uint8_t {
    EMPTY_PACKAGE = 0x00,

    // Power-related
    SOFT_RESET = 0x01,
    VAR_RESET = 0x02,
    POWEROFF_STEPPERS = 0x03,
    POWERON_STEPPERS = 0x04,
    POWEROFF_SERVOS = 0x05,
    POWERON_SERVOS = 0x06,

    // Debugging
    BLINK_BUILTIN = 0x07,
    TEST_STEPPERS = 0x08,
    TEST_SERVOS = 0x09,
    STEPPER_STATUS = 0x11,
    SERVO_STATUS = 0x12,
    OVERALL_STATUS = 0x13,

    // Operational
    MOVE_INDIVIDUAL_STEPPER = 0x0A,
    RUN_ALL_STEPPERS = 0x0B,
    STOP_ALL_STEPPERS = 0x11,
    ROTATE_INDIVIDUAL_SERVO = 0x0C,
    ROTATE_MULTIPLE_SERVOS = 0x0D,
    SET_PIN_HIGH = 0x0E,
    SET_PIN_LOW = 0x0F,
    READ_PIN = 0x10
};
uint8_t getNextByte();
void clearBuffer();

using CommandHandler = void (*)();

extern const uint8_t MAX_COMMAND;

void handleEmptyPackage();
void handleSoftReset();
void handleVarReset();
void handlePowerOffSteppers();
void handlePowerOnSteppers();
void handlePowerOffServos();
void handlePowerOnServos();
void handleBlinkBuiltin();
void handleTestSteppers();
void handleTestServos();
void handleMoveIndividualStepper();
void handleMoveMultipleSteppers();
void handleRotateIndividualServo();
void handleRotateMultipleServos();
void handleSetPinHigh();
void handleSetPinLow();
void handleReadPin();
void handleStepperStatus();
void handleServoStatus();
void handleOverallStatus();



extern CommandHandler commandTable[];
void setDirX(bool val);
void setDirY(bool val);
void setDirZ(bool val);
void setStepX(uint8_t val);
void setStepY(uint8_t val);
void setStepZ(uint8_t val);
void setSpeedX(uint8_t val);
void setSpeedY(uint8_t val);
void setSpeedZ(uint8_t val);
void stepX();
void stepY();
void stepZ();
void dirX();
void dirY();
void dirZ();
void setupSteppers();
void move();
void SetRunAll(bool val);

#endif //ROVERCONTROLLER_CONFIG_H
