const { PostgreSQLStreams } = require('factful');
const { Pool } = require('pg');
const debug = require('debug')('factful:save');
const credentials = require('./pg-credentials');

const pool = new Pool(credentials);
const streams = new PostgreSQLStreams(pool);
const randomInt = (max = Number.MAX_SAFE_INTEGER) => Math
  .floor(Math.random() * max) + 1;

setInterval(async () => {
  const event = {
    data: {
      number: randomInt(1000),
    },
  };
  debug(event);
  await streams.saveEvents('basic_number_stream', [event]);
}, 1000);
