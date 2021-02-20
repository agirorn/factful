const http = require('http');
const pEvent = require('p-event');
const { Pool } = require('pg');
const { PostgreSQLStreams } = require('factful');
const credentials = require('./pg-credentials');
const { setup: websocket } = require('./websocket');
const { setup: express } = require('./express');

// eslint-disable-next-line no-console
const { log: print } = console;
const onExit = (server) => pEvent(server, 'ext');
const start = (server) => {
  server.listen(process.env.PORT || 8080, () => {
    print(`Server started on port ${server.address().port} :)`);
  });
};

const run = async () => {
  const streams = new PostgreSQLStreams(new Pool(credentials));
  const server = http.createServer(express(streams));
  websocket(server, streams);
  start(server);
  return onExit(server);
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
