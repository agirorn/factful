const debug = require('debug')('factful');
const WebSocket = require('ws');
const manageUsers = require('../domain/manageUsers');

const isOpen = (client) => client.readyState === WebSocket.OPEN;
const { stringify: encode } = JSON;

const setup = (server, streams) => {
  const wss = new WebSocket.Server({ server, origin: '*' });
  const connections = new Set();
  let users = [];
  const updateCache = (event) => {
    users = manageUsers(users, event);
  };
  wss.on('connection', (ws) => {
    connections.add(ws);

    if (isOpen(ws)) {
      ws.send(encode({
        aggregate: 'CACHER',
        name: 'USERS',
        data: users,
      }));
    }
    ws.on('close', () => { connections.delete(ws); });
  });

  process.nextTick(async () => {
    const liveStream = streams.getLiveStream('users');
    // eslint-disable-next-line no-restricted-syntax
    for await (const event of liveStream) {
      debug('Event', event);
      updateCache(event);

      connections.forEach((client) => {
        if (isOpen(client)) {
          client.send(encode(event));
        }
      });
    }
  });
};

module.exports = { setup };
