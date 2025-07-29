//
// Created by vladd on 10/07/2025.
//
#include "config.h"

uint16_t Xsteps = 0;
uint16_t Ysteps = 0;
uint16_t Zsteps = 0;

uint16_t Xspeed = 600;
uint16_t Yspeed = 600;
uint16_t Zspeed = 600;

bool RunAll = false;

void SetRunAll(bool val){
    RunAll = val;

}

void setDirX(bool val){
    SET_BIT(PORTE, PE3, val);
}
void setDirY(bool val){
    SET_BIT(PORTH, PH3, val);
}
void setDirZ(bool val){
    SET_BIT(PORTE, PH4, val);
}
void setStepX(uint8_t val){
    Xsteps = val * MULTIPLIER;
}
void setStepY(uint8_t val){
    Ysteps = val * MULTIPLIER;
}
void setStepZ(uint8_t val){
    Zsteps = val * MULTIPLIER;
}
void setSpeedX(uint8_t val){
    Xspeed = val * MULTIPLIER;
}
void setSpeedY(uint8_t val){
    Yspeed = val * MULTIPLIER;
}
void setSpeedZ(uint8_t val){
    Zspeed = val * MULTIPLIER;
}



void stepX(){
    SET_BIT(PORTE, PE4, 1);
    delayMicroseconds(1);
    SET_BIT(PORTE, PE4, 0);
}
void stepY(){
    SET_BIT(PORTE, PE5, 1);
    delayMicroseconds(1);
    SET_BIT(PORTE, PE5, 0);
}
void stepZ(){
    SET_BIT(PORTG, PG5, 1);
    delayMicroseconds(1);
    SET_BIT(PORTG, PG5, 0);
}

void setupSteppers(){
    SET_BIT(DDRE, PE4, 1); //X motor
    SET_BIT(DDRE, PE3, 1);

    SET_BIT(DDRE, PE5, 1); //Y motor
    SET_BIT(DDRH, PH3, 1);

    SET_BIT(DDRG, PG5, 1); //Z motor
    SET_BIT(DDRH, PH4, 1);
}

void StepAll(){
    stepX();
    stepY();
    stepZ();
}
void RunSteps(){
    if(Xsteps>0){
        stepX();
        delayMicroseconds(Xspeed);
        Xsteps--;

    }if(Ysteps>0){
        stepY();
        delayMicroseconds(Yspeed);
        Ysteps--;
    }if(Zsteps>0){
        stepZ();
        delayMicroseconds(Zspeed);
        Zsteps--;
    }

}

void move(){
    if(RunAll){
        StepAll();
        delayMicroseconds(1600);
    }else{
        RunSteps();
    }
}