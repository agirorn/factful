const { v4: uuid } = require('uuid');
const { PostgreSQLStreams } = require('factful');
const { Pool } = require('pg');
const credentials = require('./pg-credentials');

// eslint-disable-next-line no-console
const { log: print } = console;
const createAdminEvent = () => ({
  aggregate: 'USERS',
  aggregateId: uuid(),
  name: 'CREATED',
  data: {
    name: 'Administrator',
    username: 'admin',
    password: 'admin',
    active: true,
  },
});

const run = async () => {
  print('Resetting server');
  const pool = new Pool(credentials);
  const streams = new PostgreSQLStreams(pool);
  if (await streams.exists('users')) {
    await streams.destroy('users');
  }
  await streams.create('users', { aggregate: true });
  await streams.saveEvent('users', createAdminEvent());
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
