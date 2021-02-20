const {
  tableName,
} = require('./db');

const exists = async (pool, streamName) => (await pool.query(`
  SELECT EXISTS (
    SELECT FROM pg_catalog.pg_class class
    JOIN   pg_catalog.pg_namespace namespace ON namespace.oid = class.relnamespace
    WHERE  namespace.nspname = 'public' -- Should be gotten from the constructor options
    AND    class.relname = '${tableName(streamName)}'
    AND    class.relkind = 'r' -- only tables
  );
`)).rows[0].exists;

module.exports = exists;
