const { PostgreSQLStreams } = require('factful');
const { Pool } = require('pg');
const credentials = require('./pg-credentials');

// eslint-disable-next-line no-console
const { log: print } = console;

const run = async () => {
  print('Resetting server');
  const pool = new Pool(credentials);
  const streams = new PostgreSQLStreams(pool);
  if (await streams.exists('basic_number_stream')) {
    await streams.destroy('basic_number_stream');
  }
  await streams.create('basic_number_stream');
};

run().then(
  () => {
    print('done');
    process.exit(0);
  },
  (error) => {
    print('error', error);
    process.exit(1);
  },
);
