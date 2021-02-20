# TODO

## Allow getStream and getLiveStream to get aggregate by name
## Allow getStream and getLiveStream to get aggregate by name and aggregateId
## Allow getStream and getLiveStream to get aggregate by name From an offset
## Allow getStream and getLiveStream to get aggregate by name and aggregateId from an offset
## Allow getStream and getLiveStream to get aggregate by event name
## Allow getStream and getLiveStream to get aggregate by event name from an offset
## Allow getStream and getLiveStream to get aggregate by event names
## Allow getStream and getLiveStream to get aggregate by event names from an offset

## Create an CQRS Demo app

## Add concurrency protection to aggregates stream

  This should be done by adding a revision number property to aggregate events.
  This revision should always be provides and it should never be null.
  When it is provides it should be the next revision.
  Should for each aggregate by aggregate, aggregateId and revision.

  When it is in conflict when trying to save it should throw a error and not
  events should be saved to the stream.

## Fail when trying to get a stream that dose not exists.
  * getStream
  * getLiveStream

## Make the insert error use the actual generated table name to detect unique
id violations

## Make the insert error use the actual generated index name to detect unique
id violations

## There is very similar code being used to query from the PG data base for
  getStream and getLiveStream

## Saving an event that has more properties then expected, then the saving should
  fail.

  Like when trying to save an aggregate to a simple stream.
  aggregate = { aggregate: 'ag name', aggregateId: 'the id', data: {}}
  stream = { data: {}}
