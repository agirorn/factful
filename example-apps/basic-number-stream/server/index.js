const { PostgreSQLStreams } = require('factful');
const debug = require('debug')('factful');
const pEvent = require('p-event');
const path = require('path');
const { Pool } = require('pg');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const connectLivereload = require('connect-livereload');
const credentials = require('./pg-credentials');

// eslint-disable-next-line no-console
const { log: print } = console;
const { stringify: encode } = JSON;

const app = express();
app.use(connectLivereload({ port: 35729 }));
app.use(express.static('public'));
app.use('/dist', express.static('dist'));
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, origin: '*' });
const isOpen = (client) => client.readyState === WebSocket.OPEN;

const run = async () => {
  const streams = new PostgreSQLStreams(new Pool(credentials));
  const connections = new Set();
  wss.on('connection', (ws) => {
    connections.add(ws);
    ws.on('close', () => { connections.delete(ws); });
  });

  server.listen(process.env.PORT || 8080, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started on port ${server.address().port} :)`);
  });

  const liveStream = streams.getLiveStream('basic_number_stream');
  let sum = 0;
  // eslint-disable-next-line no-restricted-syntax
  for await (const event of liveStream) {
    const { id, data: { number }, offset } = event;
    sum += number;
    // eslint-disable-next-line object-curly-newline
    const wsEvent = { id, offset, number, sum };
    debug('Event', event);
    debug('wsEvent', wsEvent);
    connections.forEach((client) => {
      if (isOpen(client)) {
        client.send(encode(wsEvent));
      }
    });
  }
  return pEvent(server, 'ext');
};

run().then(
  () => {
    print('done');
    process.exit(1);
  },
  (error) => {
    print('error', error);
    process.exit(1);
  },
);
