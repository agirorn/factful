const { PassThrough } = require('stream');
const { query } = require('./query');

const getStream = (pool, streamName, options = {}) => {
  const pass = new PassThrough({ objectMode: true });
  pool.connect().then(async (client) => {
    const stream = await query(client, streamName, options);
    stream.on('end', () => { client.release(); });
    stream.on('error', () => { client.release(); });
    stream.pipe(pass);
  });
  return pass;
};

module.exports = getStream;
