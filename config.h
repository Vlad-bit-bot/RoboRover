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


#define FORWARD 1
#define BACKWARDS 0

//COMMANDS
#define EMPTY_PACKAGE 0x00

//->POWER-RELATED
#define SOFT_RESET 0x01
#define VAR_RESET 0x02
#define POWEROFF_STEPPERS 0x03
#define POWERON_STEPPERS 0x04
#define POWEROFF_SERVOS 0x05
#define POWERON_SERVOS 0x06

//->DEBUGGING
#define BLINK_BUILTIN 0x07
#define TEST_STEPPERS 0x08
#define TEST_SERVOS 0x09
#define STEPPER_STATUS 0x11
#define SERVO_STATUS 0x12
#define OVERALL_STATUS 0x13   //biggest value

//->OPERATIONAL
#define MOVE_INDIVIDUAL_STEPPER 0x0A
#define MOVE_MULTIPLE_STEPPERS 0x0B
#define ROTATE_INDIVIDUAL_SERVO 0x0C
#define ROTATE_MULTIPLE_SERVOS 0x0D
#define SET_PIN_HIGH 0x0E
#define SET_PIN_LOW 0x0F
#define READ_PIN 0x10

class Stepper {
public:

    Stepper(uint8_t initStepPort, uint8_t initDirectionPort, uint8_t StepPort, uint8_t DirectionPort, uint8_t StepPin, uint8_t DirPin);

    uint16_t steps = 0;
    uint16_t stepInterval = 1000;
    bool direction = FORWARD;
    long long lastStep = 0;

    void step();
    void switchDir();

private:
    uint8_t stepPin;
    uint8_t dirPin;
    uint8_t stepReg;
    uint8_t dirReg;
};



#endif //ROVERCONTROLLER_CONFIG_H
