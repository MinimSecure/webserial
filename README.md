# Serial Debug Server

The Serial Debug Server is a means to be able to remotely diagnost distributed hardware that will benifit from having a out of band way to communucate directly with the serial port on the device. This project leverages a system on a chip, the ESP8266, to communicate with the serial port on the remote system, called the espSerialHat. These espSerialHat then connects to a parent debug network to stream logs back to the server. The server keeps persistent logs for the connected espSerialHat and allows real-time interacvie consoles to each one.

There are three main parts to this project - the Server, Client, and Firmware.

## Quick Start

### Server and Client setup
We will assume you already have Docker installed on your system. But to start up the server and client you can use our public docker image.

```
docker run -p 3000:3000 -p 8888:8888 public.ecr.aws/x7g5l0q3/webserial
```

Then on your local system you should be able to access the web interface at http://localhost:3000

### espSerialHat Setup
Install Arduino IDE and start a new project with the contents from `firmware/src/main.cpp` and tweak the configuration variables on the top to ensure it properly connects to your WiFi network and has the correct endpoint for your server.

The firmware is configured to accept local OTA upgrades, so after you initially flash it it should show up as a OTA target in the Arduino IDE and you can remotely flash the espSerialHat.
