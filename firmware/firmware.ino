// WebSerial Firmware

#include <ESP8266WiFi.h>
#include <WiFiManager.h>
#include <ArduinoOTA.h>

WiFiClient client;
WiFiManager wifiManager;

// Configuration Variables
const char* endpoint;
const int port = 8888;

void setup() {
  Serial.begin(115200);

  WiFiManagerParameter webserial_endpoint("webserial_endpoint", "webserial endpoint", "192.168.X.X", 64);
  wifiManager.addParameter(&webserial_endpoint);
  wifiManager.autoConnect("WebSerial-Provisioning", "webserial");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

   endpoint = webserial_endpoint.getValue();

  if (client.connect(endpoint, port)) {
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
    if (client.connect(endpoint, port)) {
      client.print(WiFi.macAddress());
      client.print(WiFi.localIP());
      delay(500);
    } else {
      delay(1000);
    }
  }
}
