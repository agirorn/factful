const QueryStream = require('pg-query-stream');
const {
  tableName,
  optionsName,
} = require('./db');

const query = async (client, streamName, options = {}) => {
  const OPTIONS = optionsName(streamName);
  const SQL_GET_OPTIONS = `SELECT "data" FROM ${OPTIONS} LIMIT 1`;
  const streamOptions = (await client.query(SQL_GET_OPTIONS)).rows[0].data;
  const TABLE = tableName(streamName);
  const {
    aggregateId,
    offset: OFFSET,
  } = options;
  const offset = OFFSET || '0';
  const CONDITION = ['"offset" > $1'];
  const VALUES = [offset];
  if (aggregateId) {
    CONDITION.push('AND "aggregate_id" = $2');
    VALUES.push(aggregateId);
  }
  const CONDITIONS = CONDITION.join(' ');
  const columns = [
    '"offset"',
    '"id"',
    '"data"',
    '"timestamp"',
  ];
  if (streamOptions.userId) {
    columns.push('user_id as "userId"');
  }

  if (streamOptions.aggregate) {
    columns.push('"aggregate"');
    columns.push('"name"');
    columns.push('aggregate_id as "aggregateId"');
  }
  const SQL = `
    SELECT ${columns.join(', ')}
    FROM "${TABLE}"
    WHERE ${CONDITIONS}
    ORDER BY "offset"`;
  return client.query(new QueryStream(SQL, VALUES));
};

module.exports = {
  query,
};
