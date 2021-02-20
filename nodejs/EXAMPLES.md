# Examples


# basic stream

```js
const pStream = require('p-stream');
const { Pool }= require('pg');
const { PostgreSQLStreams } = require('straumar');

const pool = new Pool(...);

const streams = new PostgreSQLStreams(pool)
streams.create('debug_log'):

streams.saveEvent('debug_log', { data }):
streams.saveEvent('debug_log', { data }):

const events = pStream(streams.getEvents('debug_log'))
console.log(events);
// => [
// =>  { offset: '1', data },
// =>  { offset: '2', data },
// =>  { offset: '3', data },
// => [
```

# With optional attributes

```js
const pStream = require('p-stream');
const { Pool }= require('pg');
const { PostgreSQLStreams } = require('straumar');

const pool = new Pool(...);

const streams = new PostgreSQLStreams(pool)
streams.create('events', {
  id: true,
  aggregate: true,
  aggregateId: true,
  userId: true,
}):

streams.saveEvent('events', {
  userId,
  aggregate,
  aggregateId,
  data,
}):
streams.saveEvent('events', {
  userId,
  aggregate,
  aggregateId,
  data,
}):

const events = pStream(streams.getEvents('debug_log'))
console.log(events);
// => [
// =>  { id, offset: '1', data, aggregate, aggregateId, userId },
// =>  { id, offset: '2', data, aggregate, aggregateId, userId },
// =>  { id, offset: '3', data, aggregate, aggregateId, userId },
// => [
```

# Concurrency protection

Only allow on event to be added right after the other to prevent multiple
edits.

```js
const pStream = require('p-stream');
const { Pool }= require('pg');
const { PostgreSQLStreams } = require('straumar');

const pool = new Pool(...);

const streams = new PostgreSQLStreams(pool)
streams.create('straumar', {
  id: true,
  aggregate: true,
  aggregateId: true,
  concurrencyProtection: 'aggregateId', // allowed to be id
});

streams.saveEvent('events', {
  data,
  aggregate,
  aggregateId,
  userId,
  previousRevision: 0
});

streams.saveEvent('events', {
  data,
  aggregate,
  aggregateId,
  userId,
  previousRevision: 1
});


const events = pStream(streams.getEvents('debug_log'))
console.log(events);
// => [
// =>  { id, offset: '1', data, aggregate, aggregateId, userId, revision: 0 },
// =>  { id, offset: '1', data, aggregate, aggregateId, userId, revision: 1 },
// =>  { id, offset: '1', data, aggregate, aggregateId, userId, revision: 2 },
// => [
```
