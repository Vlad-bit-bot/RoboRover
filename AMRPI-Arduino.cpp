/*
        AMRPI -- Developed by Danila Vlad in 2024

        This is a 1 way (Master -> Slave) communication system based on I2C. Its purpose is to use any External-Interrupt-capable
        pin on an Arduino MEGA 2560 board together with any other digital pin in order to receive information from a Raspberry Pi
        with which to drive steppers/servos. Its highlights are low latency and high efficiency.

        In this example:

        PIN 21 - SCL
        PIN 20 - SDA


 */
#include <Arduino.h>
#include <Servo.h>

#define SET_BIT(reg, bit, value) (value? reg|= (1<<bit) : reg&= ~(1<<bit))
#define GET_BITS(reg, bits, pos) ((reg>>(pos-1))&((1<<bits)-1))
#define SWITCH_BIT(reg, bit) (reg ^=(1<<bit))

#define MULTIPLIER 200
#define MinDelay 0

Servo servo1, servo2, servo3;



//communication data

    volatile uint32_t data = 0;
    uint8_t index = 0;

//stepping data

    uint16_t Xsteps = 0;
    uint16_t Ysteps = 0;
    uint16_t Zsteps = 0;

    uint16_t Xdelay = 0;
    uint16_t Ydelay = 0;
    uint16_t Zdelay = 0;

    long long Xlast = 0;
    long long Ylast = 0;
    long long Zlast = 0;

    bool Xdir = 1;
    bool Ydir = 1;
    bool Zdir = 1;

    int start = 0;
    bool runContinuously = false;

void ResetVariables(){
    Xsteps = 0;
    Ysteps = 0;
    Zsteps = 0;

    Xdelay = 0;
    Ydelay = 0;
    Zdelay = 0;
   
   runContinuously = false;
}


//stepping functions

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

//direction functions

    void dirX(){
    SWITCH_BIT(PORTE, PE3);
    Xdir = !Xdir;
}
    void dirY() {
    SWITCH_BIT(PORTH, PH3);
    Ydir = !Ydir;
}
    void dirZ(){
        SWITCH_BIT(PORTH, PH4);
        Zdir = !Zdir;
}

/*
    EXPLANATION:

        -> 32 BITS PACKAGES:
            -> first 2 bits(at pos 32 & 31 in 'data'): 00 -> STANDARD (Multiplier = 200)
                                                       01 -> CONTINUOUS (switch runContinuously)
                                                       10 -> SERVO (set position)
                                                       11 -> RESET (reset all variables to original values)

            00 -> 3 * 10 bits(10 bits per stepper): -> first bit -> direction ( 1 = normal, 0 = reversed)
                                                    -> 4 bits -> delay (certain stepper delay = delay * multiplier)
                                                    -> 5 bits -> steps (certain stepper steps += steps * multiplier)

            01 -> 3 * 10 bits(10 bits per stepper): -> first bit -> direction ( 1 = normal, 0 = reversed)
                                                    -> other bits = 0;

            10 -> 2 * 15 bits(15 bits per servo): -> first 8 bits -> position (0-180 degrees)
                                                  -> other 7 bits = 0;

            11 -> reset all variables
*/
void DataProcessing(uint8_t mode){
    //Serial.println(data);
    if(mode == 0 ){

        if(GET_BITS(data,1,30) != Xdir){ dirX(); }    //Setting direction
        if(GET_BITS(data,1,20) != Ydir){ dirY(); }
        if(GET_BITS(data,1,10) != Zdir){ dirZ(); }

        Xdelay = GET_BITS(data,4, 26) * MULTIPLIER + MinDelay;       //Setting delay
        Ydelay = GET_BITS(data,4, 16) * MULTIPLIER + MinDelay;
        Zdelay = GET_BITS(data,4, 6)  * MULTIPLIER  + MinDelay;

        Xsteps = GET_BITS(data,5, 21) * MULTIPLIER;       //Setting  steps
        Ysteps = GET_BITS(data,5, 11) * MULTIPLIER;
        Zsteps = GET_BITS(data,5, 1) * MULTIPLIER;

        start = 1;
    }else if (mode == 1){
        if(GET_BITS(data,1,30) != Xdir){ dirX(); }    //Setting direction
        if(GET_BITS(data,1,20) != Ydir){ dirY(); }
        if(GET_BITS(data,1,10) != Zdir){ dirZ(); }

        Xdelay = GET_BITS(data,4, 26) * MULTIPLIER + MinDelay;       //Setting delay
        Ydelay = GET_BITS(data,4, 16) * MULTIPLIER + MinDelay;
        Zdelay = GET_BITS(data,4, 6)  * MULTIPLIER  + MinDelay;

        runContinuously = true;
        start = 2;
    }
    else if(mode == 2){
      
      servo1.write(GET_BITS(data, 8,21));
      servo2.write(GET_BITS(data, 8, 11));
      servo3.write(GET_BITS(data, 8, 1));
      

    }else if(mode == 3){
        runContinuously = false;
        ResetVariables();
    }
    data = 0;
    /*Serial.println(Xsteps);
    Serial.println(Ysteps);
    Serial.println(Zsteps);
    Serial.println(Xdelay);
    Serial.println(Ydelay);
    Serial.println(Zdelay);*/



}

void Receive(){
    //(PIND & (1<<PD1))?Serial.print("HIGH "):Serial.print("LOW ");  //DEBUGGING
    data |= ((PIND & (1<<PD1)?1UL:0UL)<<index++);
    if(index==32){

        DataProcessing(GET_BITS(data, 2, 31));
        index = 0;
    }
}


void setup() {
  Serial.begin(9600);

    servo1.attach(42);
    servo2.attach(44);
    servo3.attach(46);
    
 

    SET_BIT(DDRE, PE4, 1); //X motor
    SET_BIT(DDRE, PE3, 1);

    SET_BIT(DDRE, PE5, 1); //Y motor
    SET_BIT(DDRH, PH3, 1);

    SET_BIT(DDRG, PG5, 1); //Z motor
    SET_BIT(DDRH, PH4, 1);

    
    
    SET_BIT(DDRD, PD1, 0);

    attachInterrupt(digitalPinToInterrupt(21), Receive,RISING);

    sei();

}
void runPrecise(){
    while(Xsteps != 0 || Ysteps != 0 || Zsteps != 0) {
        if (Xsteps > 0 && micros() - Xlast > Xdelay) {

            Xlast = micros();
            stepX();
            Xsteps--;
        }
        if (Ysteps > 0 && micros() - Ylast > Ydelay) {
            Ylast = micros();
            stepY();
            Ysteps--;
        }
        if (Zsteps > 0 && micros() - Zlast > Zdelay) {
            Zlast = micros();
            stepZ();
            Zsteps--;
        }
    }
}
void runUntilStopped(){
   // Serial.print("MERGE!\n\n");
    
    if (Xdelay > 0 && micros() - Xlast > Xdelay) {

            Xlast = micros();
            stepX();
           
        }
        if (Ydelay > 0 && micros() - Ylast > Ydelay) {
            Ylast = micros();
            stepY();
            
        }
        if (Zdelay > 0 && micros() - Zlast > Zdelay) {
            Zlast = micros();
            stepZ();
           
        }
}


void loop() {

    
    if(start == 1) {
        runPrecise();
        start = 0;
        ResetVariables();
        Serial.print("DONE\n");
    }
    if(start == 2) {
        if(runContinuously){
          
           runUntilStopped();
        }else{
          start = 0;
          ResetVariables();
        }
        
    }
    
}
