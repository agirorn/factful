const Emittery = require('emittery');

const {
  stringify: encode,
  parse: decode,
} = JSON;

const connect = (url, events) => {
  const ws = new window.WebSocket(url);

  ws.onopen = (event) => {
    events.emit('open', event);
  };

  ws.onerror = (event) => {
    events.emit('error', event);
    ws.close();
  };

  ws.onclose = (event) => {
    events.emit('close', event);
  };

  ws.onmessage = (event) => {
    events.emit('message', decode(event.data));
  };
  return ws;
};

class Socket extends Emittery {
  constructor(host) {
    super();
    this.url = `ws://${host}/chat`;
    this.on('close', () => {
      setTimeout(() => { this.connect(); }, 250);
    });
  }

  connect() {
    this.ws = connect(this.url, this);

    const id = setInterval(() => {
      const { readyState } = this.ws;
      if (readyState === WebSocket.OPEN) {
        clearInterval(id);
      }
    }, 1000);
    this.on('close', () => { clearInterval(id); });
  }

  send(object) {
    return this.ws.send(encode(object));
  }
}

let socket;
export const getSocket = () => {
  const { host } = window.location;
  socket = socket || new Socket(host);
  return socket;
};
