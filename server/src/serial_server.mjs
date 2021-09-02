import net from 'net'

export class SerialServer {
  constructor (opts={}) {
    this.port = opts.port || 8888
    this.clients = []
  }

  listen () {
    var server = net.createServer(this._onNewClient.bind(this))

    server.listen(8888, (s) => {
      console.log('server listening to %j', server.address())
    })
  }

  serialize () {
    return this.clients.map((client) => {
      return { id: client.id }
    })
  }

  find (id) {
    return this.clients.find(c => c.id === id);
  }

  _onNewClient (socket) {

    let count = 0;
    socket.on('data', (msg) => {
      if(++count == 1) {
        const id = msg.toString();

        if(id.match(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)) {
          console.log(`ESP Connected!! ${id}`);
          this.clients.push({ id, socket });
        } else {
          socket.close();
        }
      }
    });

    socket.on('close', (err) => {
      //console.log('closed??')
      // todo - cleanup?
    });

    socket.on('error', (err) => {
      //console.log('huehue', err)
      // todo - cleanup?
    });
  }
}
