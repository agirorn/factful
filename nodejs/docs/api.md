# API Documentation

## History API

The history has the following API.

### async .save((event: Object, events: Array), postHook: async function)

Save all the events in a single transaction. If a postHook is provide it also
has to complete successfully before the transaction is committed.


#### postHook

The postHook is an async function called after the events have been inserted
into the stream. It can be used to do set validataion. It get a database
connection to the same data store as the events are stored in and has to
complete successfully for the events to be persisted. The inserted events will
be rolled back if the postHook fails by rejecting the promise or throwing an
error.

__Parameters__

- __db:__ A node pg [client](https://node-postgres.com/api/client) in the
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

- __aggregate:__ String: name of the aggregate
- __aggregates:__ Array of string: List of aggregate names
- __aggregateId:__: String: name of the aggregate ID
- __event:__ string: event name
- __events:__ Array of string: List of event names
- __offset:__: String: The offset to start from. To start from the first event
  either set it as 0 leave it unset.
- __startFrom:__: Datetime: The timestamp to start from

### async .getLiveStream()

Returns a continuous stream of events for the filter for the stream and will not
stop until it either it encounters an error or the stream is removed.

__filter options__


- __aggregate:__ String: name of the aggregate
- __aggregates:__ Array of string: List of aggregate names
- __aggregateId:__: String: name of the aggregate ID
- __event:__ string: event name
- __events:__ Array of string: List of event names
- __offset:__: String: The offset to start from. To start from the first event
  either set it as 0 leave it unset.
- __startFrom:__: Datetime: The timestamp to start from

## Events

__properties__

- __id:__ String: A uniqe identifier for the event
- __offset:__ String: The offset of this event in the stream
- __aggregate:__ String: The name of the aggregate
- __aggregateId:__: String: The name of the aggregate ID
- __timestamp:__: Datetime: The timestamp of when the event got saved
- __date:__: Object: A data object can contain anything

