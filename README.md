# Serial Debug Server

The Serial Debug Server is a means to be able to remotely diagnost distributed hardware that will benifit from having a our of band way to communucate directly with it. This project leverages a system on a chip, the ESP8266, to communicate with the serial port on the remote system, called the debugger. These debuggers then connects to a parent debug network to stream logs back to the server. The server keeps persistent logs for the connected debuggers and allows real-time interacvie consoles to each one.

## Getting Started

First you need to make sure you have the following

 - ESP8266 flashed with the firmware in this repo
 - node 16 installed

Run the following commands to get the server and client setup

```
npm i
npm run client_build
npm run start_server

# Navigate to http://localhost:8080
```
