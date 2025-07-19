/*
        AMRPI -- Developed by Danila Vlad in 2024

        This is a 1 way (Master -> Slave) communication system based on I2C. Its purpose is to use any External-Interrupt-capable
        pin on an Arduino MEGA 2560 board together with any other digital pin in order to receive information from a Raspberry Pi
        with which to drive steppers/servos. Its highlights are low latency and high efficiency.

        In this example:

        PIN 21 - SCL
        PIN 20 - SDA


 */


#include <config.h>
#include <Stepper.cpp>

//communication data

    volatile uint8_t Buffer[9] = {};
    volatile uint8_t Byte = 0;
    volatile uint8_t ByteIndex = 0;
    volatile uint8_t PositionIndex = 0;
    const uint8_t CRCPoly = 0b10000111;


    Stepper stprX(DDRE, DDRE, PORTE, PORTE, PE4, PE3);
    Stepper stprY(DDRE, DDRH, PORTE, PORTH, PE5, PH3);
    Stepper stprZ(DDRG, DDRH, PORTG, PORTH, PG5, PH4);

//Data related functions

void softReset(){
    wdt_enable(WDTO_15MS);
}
void clearBuffer(){
    for(int i = 0; i<9; ++i){
        Buffer[i] = 0x00;
    }
    Byte = 0x00;
    ByteIndex = 0;
    PositionIndex = 0;
}
void FinishProcessing(){

    clearBuffer();
    SET_BIT(PORTD, PD2, HIGH); //Setting MOSI pin to high to signal that the board is ready to receive a new package.

}
void DataProcessing(){

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
    }

    return false;
}
void err(){
    SET_BIT(PORTD, PD2, LOW); //Setting MOSI pin to high to signal that the board is ready to receive a new package.
    softReset();
};
void Receive(){
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
}


void setup() {

    //communication
    SET_BIT(DDRD, PD1, 0);
    SET_BIT(DDRD, PD2, 1);
    SET_BIT(PORTD, PD2, LOW);

    attachInterrupt(digitalPinToInterrupt(21), Receive,RISING);

    sei();
}


void loop() {

}
