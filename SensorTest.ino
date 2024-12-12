SYSTEM_THREAD(ENABLED);

#include <Wire.h>
#include "MAX30105.h"

MAX30105 particleSensor;
long lastBeat = 0;
float beatsPerMinute;
int led = D7;

void setup() {
    pinMode(led, OUTPUT);
    Serial.begin(9600);
    Particle.subscribe("hook-response/bpm", handle, MY_DEVICES);

    if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
        Serial.println("MAX30105 was not found. Please check wiring/power.");
        while (1);
    }

    particleSensor.setup(); // Default sensor configuration
}

void handle(const char *event, const char *data) {
    Serial.println("Webhook response received.");
}

void loop() {
    digitalWrite(led, HIGH);
    long irValue = particleSensor.getIR();
    delay(200); // Small delay for responsiveness

    if (irValue > 10000) {
        long currentTime = millis();
        if ((currentTime - lastBeat) > 500) { // 500 ms debounce for realistic BPM
            long delta = currentTime - lastBeat;
            lastBeat = currentTime;
            beatsPerMinute = 60 / (delta / 1000.0);
            Particle.publish("activity", String(beatsPerMinute), PRIVATE);
        }
    }
    digitalWrite(led, LOW); // Turn off LED
}
