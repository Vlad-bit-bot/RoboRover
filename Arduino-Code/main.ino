/*
        AMRPI -- Developed by Danila Vlad in 2024

        This is a 1 way (Master -> Slave) communication system based on I2C. Its purpose is to use any External-Interrupt-capable
        pin on an Arduino MEGA 2560 board together with any other digital pin in order to receive information from a Raspberry Pi
        with which to drive steppers/servos. Its highlights are low latency and high efficiency.

        In this example:

        PIN 21 - SLCK
        PIN 20 - MISO
        PIN 19 - MOSI //used only for status indication

 */


#include "config.h"

//communication data

    volatile uint8_t Buffer[9] = {};
    volatile uint8_t Byte = 0;
    volatile uint8_t ByteIndex = 0;
    volatile uint8_t PositionIndex = 0;
    const uint8_t CRCPoly = 0b10000111;

//Data related functions
    uint8_t nextPackage = 0;


void clearBuffer(){
    for(int i = 0; i<9; ++i){
        Buffer[i] = 0x00;
    }
    Byte = 0x00;
    ByteIndex = 0;
    PositionIndex = 0;
    nextPackage = 0;
}
void FinishProcessing(){

    clearBuffer();
    SET_BIT(PORTD, PD2, HIGH); //Setting MOSI pin to high to signal that the board is ready to receive a new package.

}
uint8_t getNextByte(){

    return Buffer[nextPackage++];
}

void DataProcessing(){

    //Serial.print(Buffer[0]);
    while(nextPackage<8){
        uint8_t command = getNextByte();
        //if(command!=0){
           // Serial.println(command);
        //}
        if(command<=MAX_COMMAND)
            commandTable[command]();
        if(command == 0x0){
            break;
        }
    }

    FinishProcessing();
}


bool CheckCRC(){
    uint8_t crc = 0xFF;

    for(int i = 0; i<8;++i) {
        crc ^= Buffer[i];
        for(int j = 0; j<8; ++j){
            if(crc&0x80){
                crc = (crc<<1) ^ CRCPoly;
            }else{
                crc<<=1;
            }

        }
    }
    if(crc == Buffer[8]){
        return true;
    }else{
        commandTable[SOFT_RESET]();
    }
    return false;
}
void err(){
    commandTable[SOFT_RESET]();
};
void Receive(){
    cli();
    //(PIND & (1<<PD1))?Serial.print("HIGH "):Serial.print("LOW ");  //DEBUGGING
    Byte |= ((PIND & (1<<PD1)?1:0)<<ByteIndex++);
    if(ByteIndex==8){
        SET_BIT(PORTD, PD2, LOW);
        Buffer[PositionIndex] = Byte;
        Byte = 0;
        ByteIndex = 0;
        PositionIndex++;
        if(PositionIndex == 9){

            PositionIndex = 0;
            if(CheckCRC()){
                DataProcessing();
            }else{
                err();
            }
        }
    }
    sei();
}


void setup() {

    //Serial.begin(9600);
    //communication
    SET_BIT(DDRD, PD1, 0);
    SET_BIT(DDRD, PD2, 1);

    SET_BIT(PORTD, PD2, HIGH);

    attachInterrupt(digitalPinToInterrupt(21), Receive,RISING);

    sei();

    //built-in led
    SET_BIT(DDRB, PB7, 1);

}

void loop() {
    move();

}
