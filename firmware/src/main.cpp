#include <ESP8266WiFi.h>
#include <ArduinoOTA.h>

WiFiClient client;

const char* ssid = "____";
const char* password = "_____";
const char* endpoint = "_____";
int port = 8888;

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  WiFi.setAutoReconnect(true);
  WiFi.persistent(true);
  
  while (WiFi.status() != WL_CONNECTED){
    delay(500);
  }

  if(client.connect(endpoint, port)) {
    client.print(WiFi.macAddress());
    client.print(WiFi.localIP());
    delay(500);
  }

  // Setup OTA
  ArduinoOTA.onStart([]() {
    String type;
    if (ArduinoOTA.getCommand() == U_FLASH) {
      type = "sketch";
    } else { // U_FS
      type = "filesystem";
    }
  });

  ArduinoOTA.begin();
}

void loop() {
  ArduinoOTA.handle();

  if (Serial.available()) {
    client.print((char)Serial.read());
  }

  if (client.available()) {
    Serial.print((char)client.read());
  }

  if (!client.connected()) {
    if(client.connect(endpoint, port)) {
      client.print(WiFi.macAddress());
      client.print(WiFi.localIP());
      delay(500);
    } else {
      delay(1000);
    }
  }
}
