[![npm version][npm-badge]][npm-link]
[![Build Status][travis-badge]][travis-link]
# Factful

> Seamless event sourcing and streaming for PostgreSQL

- Factful requires a [PostgreSQL pool] to communicate with the server.
- [API Documentation]
- [Example applications]

## Installation

```js
npm install factful
```

## Usage

```js
  const Factful = require('factful');
  const { Pool } = require('pg');
  const poolOptions = require('./pool-options');

  const history = new Factful({
    name: 'events',
    pool: new Pool(poolOptions),
  });
  await history.create();

  const aggregateId: '76144577-6425-42da-90a7-155d8e7745e7';
  const liveStream = history.getLiveStream({ aggregateId });
  process.nextTick(() => {
    for await (const event of liveStream) {
      liveEvents.push(event);
    }
  });

  await instance.save({ aggregateId, data: { key: 'value' }});
  for await (const event of history.getEventsStream({ aggregateId })) {
    events.push(event);
  }

  process.nextTick(() => {
    deepEquals(liveEvents, events);
  });
```

## how to use it with a pipeline

https://nodejs.org/api/stream.html#stream_stream_pipeline_source_transforms_destination_callback

```js
const pipeline = util.promisify(stream.pipeline);
const fs = require('fs');
const Factful = require('factful');

const instace = Factful.memory({
  name: 'events',
  autoCreate: true,
});
const aggregateId: '76144577-6425-42da-90a7-155d8e7745e7';
async function run() {
  await pipeline(
    async function* (events) {
      for await (const event of history.getLiveStream({ aggregateId })) {
        yield event.name;
      }
    },
    fs.createWriteStream('uppercase.txt')
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

## Deployment

When deploying an application that uses Factful you have to create the streams
before using them. It can be done in the main app as long as the user of the
used to connect the pool to the PostgreSQL database has the required privileges
to do that. Often that is not the preferred way to manage the tables and
a migration script is created like this.

```js
  const Factful = require('factful');
  const { Pool } = require('pg');
  const poolOptions = require('./pool-options');
  const history = (new Factful.pg({
    name: 'events',
    pool: new Pool(poolOptions),
  }))
  await history.create();
```

[PostgreSQL pool]: https://node-postgres.com/api/pool
[API Documentation]: ./docs/api.md
[Example applications]: https://github.com/agirorn/factful/tree/master/example-apps

[npm-badge]: https://badge.fury.io/js/factful.svg
[npm-link]: https://badge.fury.io/js/factful
[travis-badge]: https://travis-ci.org/agirorn/factful.svg?branch=master
[travis-link]: https://travis-ci.org/agirorn/factful
