const { Pool } = require('pg');
const Factful = require('../..');
const {
  pStreamToArray,
  maxFromStream,
  rejection,
} = require('./tools');

const poolFactory = () => new Pool({
  host: 'localhost',
  user: 'factful_user',
  password: 'factful_password',
  database: 'factful',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const setupPgPool = async () => {
  const pool = poolFactory();
  await pool.query(`
    DROP TABLE IF EXISTS basic_events;
    DROP TABLE IF EXISTS basic_options;
    DROP TABLE IF EXISTS stream_name_events;
    DROP TABLE IF EXISTS stream_name_options;
  `);
  return pool;
};

const connectToDb = async (context) => {
  const pool = await setupPgPool();
  context.pool = pool;
  context.history = new Factful({
    name: 'stream_name',
    pool,
  });
};

const disconnectFromDb = async (context) => {
  await context.pool.end();
  // context.pool = undefined;
};

module.exports = {
  connectToDb,
  disconnectFromDb,
  maxFromStream,
  pStreamToArray,
  poolFactory,
  rejection,
  setupPgPool,
};
