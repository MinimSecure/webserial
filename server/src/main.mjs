import net from 'net'
import dotenv from 'dotenv'
import { createServer } from 'http';
import { WebSocketServer, createWebSocketStream } from 'ws'
import express from 'express'
import path from 'path'
import querystring from 'querystring'

import { SerialServer } from './serial_server.mjs'

dotenv.config()

let serialServer = new SerialServer()
serialServer.listen()

const app = express()
const server = createServer(app);
const port = 3000

// the root is our main app
app.use('/', express.static('../client/dist'))
app.use((req, res, next) => {
  const auth_username = process.env.SIMPLE_AUTH_USERNAME
  const auth_password = process.env.SIMPLE_AUTH_PASSWORD

  if(!auth_password && !auth_username) {
    return next()
  }

  const auth = {login: process.env.SIMPLE_AUTH_USERNAME, password: process.env.SIMPLE_AUTH_PASSWORD}

  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

  // Verify login and password are set and correct
  if (login && password && login === auth.login && password === auth.password) {
    // Access granted...
    return next()
  }

  // Access denied...
  res.set('WWW-Authenticate', 'Basic realm="401"')
  res.status(401).send('Authentication required.')
})

app.get('/api/clients', (req, res) => {
  res.send(serialServer.serialize())
})

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const wss = new WebSocketServer({server, path: '/ws'})
let serial_socket

wss.on('connection', function connection (ws, req) {
  const serialClientID = querystring.decode(req.url.split('?')[1])?.id
  console.log(`We have a webSerial user for console (${serialClientID})!`)

  const client = serialServer.find(serialClientID)

  if(client) {
    ws.send(`Welcome to the terminal! Getting you connected to ${client.id}...\n\r`)
    ws.send(`Press Enter to get started\n\r`)

    const duplex = createWebSocketStream(ws)

    ws.on('close', (err) => {
      console.log('cleaning up socket pipes');
      client.socket.unpipe(duplex);
      duplex.unpipe(client.socket)
    })

    console.log('wiring up');
    client.socket.pipe(duplex)
    duplex.pipe(client.socket)

  } else {
    ws.terminate()
  }
  client.socket
})
