const debug = require('debug')('factful:pg');
const {
  tableName,
  optionsName,
} = require('./db');

const destroy = async (pool, streamName) => {
  debug(new Error(`destroy ${streamName}`));
  if (!streamName) {
    throw new Error('No streamName provided');
  }
  const STREAM = tableName(streamName);
  const OPTIONS = optionsName(streamName);
  await pool.query(`
    DROP TABLE ${STREAM};
    DROP TABLE ${OPTIONS};
  `);
};

module.exports = destroy;
