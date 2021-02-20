const { PassThrough, Transform } = require('stream');
const debug = require('debug')('factful:pg');
const { query } = require('./query');
const { tableName } = require('./db');
const { listeningClient } = require('./tools/listening-client');

const getLiveStream = (pool, streamName, options = {}) => {
  const pass = new PassThrough({ objectMode: true });
  let offset;
  const progressFactory = () => new Transform({
    objectMode: true,
    transform(event, encoding, callback) {
      offset = event.offset;
      callback(null, event);
    },
  });
  const listenToEventFromStream = async (orginalClient) => {
    const client = listeningClient(orginalClient);
    pass.on('end', () => client.stopListeningToNotificataions());
    let listening = true;
    const queryDB = async () => {
      if (client.disconnected) { return; }
      if (!listening) { return; }
      const stream = await query(client, streamName, { ...options, offset });
      listening = false;
      const onEnd = () => {
        listening = true;
        stream.off('end', onEnd);
      };
      stream.on('end', onEnd);
      const progress = progressFactory();
      stream.pipe(progress);
      progress.pipe(pass, { end: false });
    };
    pass.on('error', () => { client.release(); });
    pass.on('end', () => { client.release(); });
    const onPgNotify = async ({ channel, payload }) => {
      debug(`channel: ${channel} -- ${payload}`);
      await queryDB();
    };
    await client.listen(tableName(streamName), onPgNotify);
    await queryDB();
  };

  pool
    .connect()
    .then(listenToEventFromStream)
    .catch((error) => {
      pass.error(new Error(error.stack));
    });
  return pass;
};

module.exports = getLiveStream;
