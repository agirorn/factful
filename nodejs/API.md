# Factful API

- __streamName__ The name of the stream

  A stream name must start with a letter or an underscore; the rest of the
  string can contain letters, digits, and underscores
  > Allowed values are: __/[A-Z][a-z][0-9]_/__

## PostgreSQLStreams(pool, options)

Constructor for the PostgreSQLStreams to use PostgreSQL as the backbone to
persist events and facilitate event notification

### options:

- __schema__ The schema to create the stream under defaults to __public__

## MemoryStreams()

> Best used only for testing.

Constructor for the MemoryStreams to stores all events/steams in memory.
All Events stored in the MemoryStreams will be lost when the application is shut
down.

## .create(streamName, configuration)

Create a new stream and make it ready for use.

### configuration:

- __userId__ Control whether a userId properties is present or required. Is set
  to __true__ by default

  > The userId property is an UUID that can be used to identify the user

  __Allowed values:__

  + __true__ The userId property is present and required
  + __false__ The userId property is not present and not required
  + __'optional'__ The userId property is present but not required and set to
    null whenn missing during save

- __aggregate__ Control whether a aggregate properties is present or required.
  Is set to __true__ by default

  > The aggregate property is a String that can be used to identify the
  > aggregate responsible for this event

  __Allowed values:__
  + __true__ The aggregate property is present and required
  + __false__ The aggregate property is not present and not required
  + __'optional'__ The aggregate property is present but not required and set to
    null whenn missing during save

- __aggregateId__ Control whether a aggregateId properties is present or
  required. Is set to __true__ by default

  > The aggregateId property is a UUID that can be used to identify the
  > aggregate responsible for this event

  __Allowed values:__
  + __true__ The aggregateId property is present and required
  + __false__ The aggregateId property is not present and not required
  + __'optional'__ The aggregateId property is present but not required and set
    to null whenn missing during save

- __revision__ Control whether a revision properties is present or required. Is set to __true__ by default

  __Allowed values:__
  + __true__ The revision property is present and required
  + __false__ The revision property is not present and not required
  + __'optional'__ The revision property is present but not required and set to
    null whenn missing during save

__Returns__ a Promise that resolves to true if the streams exists.

```js
await streams.create('streams');
```

## .exits(streamName)

Check if the stream exits.

__Returns__ a Promise that resolves to true if the streams exists.

```js
if (await streams.exists('events')) {
  console.log('The events stream exists and is ready to rock');
} else {
  console.log('NO events stream exists');
}
```

Check of the streams exists.

## .destroy(streamName)

> All data will be lost after destroying the stream

__Returns__ a Promise that resolves if the stream could be destroyed

```js
const configuration = await streams.destroy('events');
```

Destroy the stream.

## .getConfiguration(streamName)

Get the configuration for this stream.

__Returns__ a Promise

```js
const configuration = await streams.getConfiguration('events');
```

## .saveEvent(streamName, event)

Save a single event to the stream.

__Returns__ a Promise

```js
await streams.saveEvent(event);
```

## .saveEvents(streamName, events)

Save a multiple events to the stream.

__Returns__ a Promise

```js
const events = [event1, event2];
await streams.saveEvents(events);
```

## .getStream(streamName, options)

Get a streams of all stored events in the steam.
The stream can be filterd to only return a subset of events in the stream.

```js
streams.getStream('events').pipe(process.stdout);
```

## .getLiveStream(streamName, options)

Get a streams of all stored events and all events stored after the stream has
been acquired.
The stream can be filterd to only return a subset of events in the stream.
The stream can be a merge of 2 or more streams;

```js
streams.getLiveStream('events').pipe(process.stdout);
```

## how to use it with a pipeline

https://nodejs.org/api/stream.html#stream_stream_pipeline_source_transforms_destination_callback

```js
const pipeline = util.promisify(stream.pipeline);
const fs = require('fs');
const { MemoryStream } = require('factful');

const instace = new MemoryStream({ name: 'events' });
async function run() {
  await pipeline(
    getContinuousEventsStream({
      aggregateId: '76144577-6425-42da-90a7-155d8e7745e7',
    }),
    async function* (events) {
      for await (const event of events) {
        yield event.name;
      }
    },
    fs.createWriteStream('uppercase.txt')
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```
