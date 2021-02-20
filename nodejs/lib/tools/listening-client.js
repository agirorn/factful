const listeningClient = (client) => {
  const overwrite = {
    connected: true,

    async listen(channel, handler) {
      await client.query(`LISTEN ${channel}`);
      client.on('notification', handler);
      client.on('end', () => {
        client.removeListener('notification', handler);
      });
    },

    stopListeningToNotificataions() {
      client.listeners('notification').forEach((handler) => {
        client.removeListener('notification', handler);
      });
    },
  };

  client.on('end', () => {
    overwrite.connected = false;
  });

  const handler = {
    get(target, prop, receiver) {
      if (Reflect.has(overwrite, prop)) {
        return Reflect.get(overwrite, prop, receiver);
      }
      if (prop === 'disconnected') {
        return !overwrite.connected;
      }
      return Reflect.get(target, prop, receiver);
    },
  };

  return new Proxy(client, handler);
};

module.exports = {
  listeningClient,
};
