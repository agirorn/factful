/* eslint-disable no-plusplus */
const pTap = require('p-tap');
const pFinally = require('p-finally');
const pSerise = require('p-series');
const { validateEvents } = require('./validateEvents');
const { toArray } = require('./tools');

const UNIQUE_VIOLATION = '23505';

const {
  tableName,
  optionsName,
} = require('./db');

const UUID_PATTERN = '\\b[0-9a-f]{8}\\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\\b[0-9a-f]{12}\\b';
const noop = () => {};

const saveEvents = async (pool, streamName, eventsOrEvent, postHook = noop) => {
  const events = toArray(eventsOrEvent);
  const OPTIONS = optionsName(streamName);
  const SQL_GET_OPTIONS = `SELECT "data" FROM ${OPTIONS} LIMIT 1`;
  const options = (await pool.query(SQL_GET_OPTIONS)).rows[0].data;
  validateEvents(options, events);
  const TABLE_NAME = tableName(streamName);
  // events.forEach(validateEventDataTypes);
  // saveEvents must use pg.pool.connect to get a single client and us that
  // client to perform the transaction and rollback of that transactions.
  // pool.query returns random clients and if it is used then to perform
  // transaction then now one knows hot it will end up.

  if (events.length < 1) {
    throw new Error('No events provided to save');
  }

  const client = await pool.connect();
  const START_TRANSACTION = async () => client.query('BEGIN');
  const COMMIT_TRANSACTION = async () => client.query('COMMIT');
  const ROLLBACK_TRANSACTION = async (error) => {
    await client.query('ROLLBACK');
    throw error;
  };

  let i = 1;
  const columns = ['data'];

  if (options.userId) {
    columns.push('user_id');
  }

  // console.log('options', options);
  if (options.aggregate) {
    columns.push('aggregate_id');
    columns.push('aggregate');
    columns.push('name');
  }
  const range = (num) => Array(num)
    .fill(null)
    .map((v, index) => index + 1);
  const VALUES_PLACEHOLDER = events
    // eslint-disable-next-line no-plusplus
    .map(() => {
      const cols = range(columns.length).map(() => `$${i++}`).join(', ');
      return `(${cols})`;
    })
    .join(',');
  // console.log('VALUES_PLACEHOLDER', VALUES_PLACEHOLDER);

  const VALUES = events.map((event) => {
    const values = [
      event.data,
    ];
    if (options.userId) {
      values.push(event.userId);
    }
    if (options.aggregate) {
      values.push(event.aggregateId);
      values.push(event.aggregate);
      values.push(event.name);
    }
    return values;
  }).flat();

  const COLUMNS = columns.map((col) => `"${col}"`).join(', ');
  const INSERT_SQL = `
    INSERT INTO "${TABLE_NAME}"
      (${COLUMNS})
    VALUES
      ${VALUES_PLACEHOLDER} RETURNING "offset";
  `;

  // console.log(INSERT_SQL, VALUES);
  const INSERT = async () => {
    try {
      const res = await client.query(INSERT_SQL, VALUES);
      return res;
    } catch (e) {
      if (
        e.code === UNIQUE_VIOLATION
        && e.table === 'events_events'
        && e.constraint === 'events_events_id'
      ) {
        const pattern = RegExp(UUID_PATTERN);
        const match = pattern.exec(e.detail);
        if (match) {
          const id = match[0];
          throw new Error(`Duplicate id ${id} error`);
        }
      }

      if (
        e.code === UNIQUE_VIOLATION
        && e.table === 'events_events'
        && e.constraint === 'events_events_aggregateId_revision'
      ) {
        throw new Error(e.detail);
      }
      throw e;
    }
  };

  const CALL_POST_HOOK = async () => postHook(client);

  const transaction = pSerise([
    START_TRANSACTION,
    INSERT,
    CALL_POST_HOOK,
  ]).then(
    COMMIT_TRANSACTION,
    pTap.catch(ROLLBACK_TRANSACTION),
  );

  return pFinally(transaction, () => client.release());
};

module.exports = saveEvents;
