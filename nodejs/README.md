# Factful

> Seamless event sourcing and streaming for PostgresSQL

Provides 2 streams PostgreSQLStream and the MemoryStream.

- PostgreSQLStream persisted events to a PostgreSQL and can interact between
  connections and servers.
- MemoryStream stores the stream in memory and all events in the stream will be
  lost when the application stops. The MemoryStream is mostly useful for
  in tests for code that will use PostgreSQLStream in production since they have
  a compatible API but the MemoryStream is faster and simper to setup.

[API Documentation](docs/API.md)


https://node-postgres.com/api/pool

## Installation

```js
npm install factful
```

## Usage

```js
  const Factful = require('factful');
  const { Pool } = require('pg')

  const history = new Factful({
    name: 'events',
    autoCreate: true,
    failIfExist: false,
    concurrencyProtection: true,
    versioned: true,
    pool: new Pool(),
  });

  const aggregateId: '76144577-6425-42da-90a7-155d8e7745e7';
  const liveStream = history.getLiveStream({ aggregateId });
  const liveEvents = [];
  liveStream.on('data', (event) => liveEvents.push(event));

  await instance.save({ aggregateId, version: 1 });

  const events = history.getEventsStream({ aggregateId });
  const allEvents = [];
  events.on('data', (event) => allEvents.push(event));

  process.nextTick(() => {
    deepEquals(liveEvents, allEvents);
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
  failIfExist: false,
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

## On deployment of app

**migratory.js**

```js
const Factful = require('factful');
const history = await Factful.pg({
  name: 'events',
  autoCreate: true,
  failIfExist: false,
  connectionPool
});
await history.create();
```

### multiple streams

Streams are joined on the timestamp

```js
  const Factful = requier('factful')
  const history = await Factful.pg({
     stream: 'events',
     autoCreate: true,
     failIfExist: false,
     connection,
  })

  await history.create({ failIfExist: false })
  const events = history.getStream({
    aggregates: [
      'user',
      'user_config',
    ],
    offset: offset,
  )
  for await (const event of events) {
    print event.name;
  }

  // This will destroy the stream and all it's data
  // Please do not allow the user to destroy any tables in the database :)
  await history.destroy()
```

```js
  const Factful = requier('factful')
  const history = await Factful.pg({
     stream: 'events',
     dbconfig
  })

  await history.save(event)
  await history.save(event, event)
  await history.save([event, event])

  const events = history.getStream({
    aggregates: [
      'user',
      'user_config',
    ],
    offset: offset,
  )
  for await (const event of events) {
    print event.name;
  }
```


__Get aggregate for a single aggregate__
```js
  const Factful = requier('factful')
  const history = await Factful.pg({
     stream: 'events',
     dbconfig
  })
  await history.connect()

  // going to change a single aggregate
  const id = 'the id'
  const events = history.getStream({
    aggregate: 'user',
    aggregateId: id,
  )
  state = {};
  for await (const event of events) {
    update(state, event);
  }
  validate(command);
  events = [
    event 1,
    event 2,
  ]
  stream.save(...events)
```

__command__
```js
  const { PostgreSQL: Factful } = requier('factful')
  const COMMAND = (history) => async  (id, ...args) {
    await (await Aggregate.replayFrom(history, id)).canPerformCommand()
    await history.save([
      new Event1(...args),
      new Event2(...args)
    ]);
  }
  const history = new Factful({
     stream: 'events',
     ...dbconfig
  })
  await history.connect()
  command = COMMAND(history);

  await command(...args):
  // going to change a single aggregate
  const id = 'the id'
  const events = history.getStream({
    aggregates: [
      'user',
    ],
    aggregateId: id,
  )
  state = {};
  for await (const event of events) {
    update(state, event);
  }
  validate(command);
  events = [
    event 1,
    event 2,
  ]
  stream.save(...events)
```
