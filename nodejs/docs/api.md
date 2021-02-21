# API Documentation

> This document is under construction

## History API

The history has the following API.

### async .create(options: Object)

Creates an event stream

__options:__

- __userId:__ Boolean: When set the stream will require a userId property for
  every event.
- __aggregate:__ Boolean: When set the stream will require a aggregate,
  aggregateId and name property for every event.

```js
  await history.create({
    aggregate: true,
    userId: true,
  });
```

### async .exists()

Checks it the stream exists.


```js
  if (await history.events()) {
    console.log('The stream exists')
  } else {
    console.log('The stream exists')
  }
```

### async .save((event: Object, events: Array), postHook: async function)

Save all the events in a single transaction. If a postHook is provide it also
has to complete successfully before the transaction is committed.


#### postHook

The postHook is an async function called after the events have been inserted
into the stream. It gets a connection to the database that is used to store the
events and the connection is in the same transaction that is being used to store
the events and has to complete successfully for the events to be persisted. The
inserted events will be rolled back if the postHook fails by rejecting the
promise or throwing an error.  It can be used to do set validation.

__Parameters__

- __db:__ A node-postgres [client](https://node-postgres.com/api/client) in the
  current transaction.

```js
  history.save(
    newUserEvent,
    async (db) => db.query(
      `INSERT INTO unique_emails (email) VALUES (${event.data.email});`,
    ),
  )
```

### async .getStream(filter)

Returns a stream of the events for the filter for the stream.

__filter options__

- __aggregateId:__ String: name of the aggregate ID
- __offset:__ String: The offset to start from. To start from the first event
  either set it as 0 leave it unset.
- __aggregates:__ **UNSUPPORTED** Array of string: List of aggregate names
- __event:__ **UNSUPPORTED** string: event name
- __events:__ **UNSUPPORTED** Array of string: List of event names
- __startFrom:__ **UNSUPPORTED** Datetime: The timestamp to start from

```js
  const stream = history.getStream({
    aggregateId: 'id',
    offset: 5,
  });

  for await (const event of stream) {
    console.log(event);
  }
```

### async .getLiveStream()

Returns a continuous stream of events for the filter for the stream and will not
stop until it either it encounters an error or the stream is removed.

__filter options__

- __aggregateId:__ String: name of the aggregate ID
- __offset:__ String: The offset to start from. To start from the first event
  either set it as 0 leave it unset.
- __aggregate:__ **UNSUPPORTED** String: name of the aggregate
- __aggregates:__ **UNSUPPORTED** Array of string: List of aggregate names
- __event:__ **UNSUPPORTED** string: event name
- __events:__ **UNSUPPORTED** Array of string: List of event names
- __startFrom:__ Datetime: The timestamp to start from

```js
  const stream = history.getLiveStream({
    aggregateId: 'id',
    offset: 5,
  });

  for await (const event of stream) {
    console.log(event);
  }
```

## Events

An event that is returned from the stream or saved to the stream.

__properties__

- __id:__ String: A unique identifier for the event (UUID by default)
- __offset:__ String: The offset of this event in the stream
- __aggregate:__ String: The name of the aggregate. Only for streams configured
  as an aggregates
- __aggregateId:__ String: The name of the aggregate ID. Only for streams
  configured as an aggregates
- __name:__ String: The name of the event. Only for streams configured as an
  aggregates
- __userId:__ String: The should be the userId of the user that saved the event.
  Only for streams configured to have the userId
- __timestamp:__ Datetime: The timestamp of when the event got saved
- __date:__ Object: A data object can contain anything
