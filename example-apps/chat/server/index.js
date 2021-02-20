const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, origin: '*' });

const connections = new Set();
wss.on('connection', (ws) => {
  connections.add(ws);

  ws.on('message', (data) => {
    // wss.clients.forEach((client) => {
    //   if (client.readyState === WebSocket.OPEN) {
    //     console.log(data);
    //     client.send(data);
    //   }
    // });

    connections.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        console.log(data);
        client.send(data);
      }
    });
  });

  ws.on('close', () => {
    connections.delete(ws);
  });
});

server.listen(process.env.PORT || 8080, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${server.address().port} :)`);
});
