//
// Created by vladd on 10/07/2025.
//
#include <config.h>


Stepper::Stepper(uint8_t initStepPort, uint8_t initDirectionPort, uint8_t StepPort, uint8_t DirectionPort,
                 uint8_t StepPin, uint8_t DirPin) {

    stepPin = StepPin;
    dirPin = DirPin;
    stepReg = StepPort;
    dirReg = DirectionPort;

    SET_BIT(initStepPort, stepPin, 1);
    SET_BIT(initDirectionPort, dirPin, 1);

}

void Stepper::step() {
    SET_BIT(stepReg, stepPin, 1);
    delayMicroseconds(1);
    SET_BIT(stepReg, stepPin, 0);
}

void Stepper::switchDir(){
    SWITCH_BIT(dirReg, dirPin);
};
