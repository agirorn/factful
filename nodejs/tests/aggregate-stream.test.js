const { suite } = require('sanna');
const { v4: uuid } = require('uuid');
const assert = require('assert');
const Factful = require('..');
const ValidationError = require('../lib/errors/ValidationError');
const {
  maxFromStream,
  pStreamToArray,
  rejection,
  setupPgPool,
} = require('./helpers');

const config = {
  aggregate: true,
};

let test = suite('Factful aggregate stream');
test.before(async (context) => {
  const pool = await setupPgPool();
  context.history = new Factful({
    name: 'stream_name',
    pool,
  });
  context.pool = pool;
});
test.after(async (context) => {
  await context.pool.end();
  context.pool = undefined;
});

test('.create(stream) and .destory(stream)', async ({ history }) => {
  await history.create(config);
  assert(await history.exists());
  await history.destroy();
  assert(!await history.exists());
});

const connectToDb = async (context) => {
  const pool = await setupPgPool();
  context.pool = pool;
  context.history = new Factful({
    name: 'basic',
    pool,
  });
};

const disconnectFromDb = async (context) => {
  await context.pool.end();
  context.pool = undefined;
};

test = suite('basic stream');
test.before(connectToDb);
test.after(async ({ history }) => history.destroy());
test.after(disconnectFromDb);

const { stringify } = JSON;
function assertIsAValidationErrorWithMessage(actual, message, event) {
  assert(actual instanceof ValidationError);
  assert.equal(actual.message, `${message} on event ${stringify(event)}`);
}

test(
  'validation - fails when aggregate is missing',
  async ({ history }) => {
    await history.create(config);
    const event = {
      data: {},
    };

    assertIsAValidationErrorWithMessage(
      await rejection(history.save(event)),
      'Invalid event, missing aggregate',
      event,
    );
  },
);

test(
  'validation - fails when aggregateId is missing',
  async ({ history }) => {
    await history.create(config);
    const event = {
      aggregate: 'The Aggregate name',
      data: {},
    };

    assertIsAValidationErrorWithMessage(
      await rejection(history.save(event)),
      'Invalid event, missing aggregateId',
      event,
    );
  },
);

test(
  'validation - fails when name is missing',
  async ({ history }) => {
    await history.create(config);
    const event = {
      aggregate: 'The Aggregate name',
      aggregateId: uuid(),
      data: {},
    };

    assertIsAValidationErrorWithMessage(
      await rejection(history.save(event)),
      'Invalid event, missing name',
      event,
    );
  },
);

test = suite('aggregate stream');
test.before(connectToDb);
test.before(async ({ history }) => history.create(config));
test.after(async ({ history }) => history.destroy());
test.after(disconnectFromDb);

const allBasicEvents = async (history) => pStreamToArray(
  history.getStream(),
);

const containEventByAggragateNameIdAndData = (
  events,
  { name, aggregate, aggregateId, data },
) => {
  const event = events.find((e) => (
    e.name === name
    && e.aggregate === aggregate
    && e.aggregateId === aggregateId
  ));
  assert.deepEqual(event.data, data);
};

test(
  '.getStream() - getting all events from the stream',
  async ({ history }) => {
    const events = [
      { aggregate: 'name', aggregateId: uuid(), name: 'name', data: { e: 1 } },
      { aggregate: 'name', aggregateId: uuid(), name: 'name', data: { e: 2 } },
    ];
    await history.save(events);

    const all = await allBasicEvents(history);
    containEventByAggragateNameIdAndData(all, events[0]);
    containEventByAggragateNameIdAndData(all, events[1]);
  },
);

test(
  '.getStream() - getting all events for a single aggregate by ID',
  async ({ history }) => {
    const aggregateId1 = uuid();
    const aggregateId2 = uuid();
    const events = [
      { aggregate: 'name', aggregateId: aggregateId1, name: 'nama', data: { e: 1 } },
      { aggregate: 'name', aggregateId: aggregateId1, name: 'nama', data: { e: 2 } },
      { aggregate: 'name', aggregateId: aggregateId2, name: 'nama', data: { e: 3 } },
      { aggregate: 'name', aggregateId: aggregateId2, name: 'nama', data: { e: 4 } },
    ];
    await history.save(events);
    let singleAggrgateEvents = await pStreamToArray(history.getStream(
      { aggregateId: aggregateId1 },
    ));
    assert.equal(singleAggrgateEvents.length, 2);
    assert.deepEqual(
      singleAggrgateEvents.map((d) => d.data),
      [{ e: 1 }, { e: 2 }],
    );
    singleAggrgateEvents = await pStreamToArray(history.getStream(
      { aggregateId: aggregateId2 },
    ));
    assert.equal(singleAggrgateEvents.length, 2);
    assert.deepEqual(
      singleAggrgateEvents.map((d) => d.data),
      [{ e: 3 }, { e: 4 }],
    );
  },
);

test('.getLiveStream() - get new events', async ({ history }) => {
  const events = [
    { aggregate: 'name', aggregateId: uuid(), name: 'nama', data: { e: 1 } },
  ];
  const stream = history.getLiveStream();
  await history.save(events[0]);
  const liveEvents = await maxFromStream(1, stream);
  assert.equal(liveEvents.length, 1);
  containEventByAggragateNameIdAndData(events, events[0]);
});

test('.getLiveStream() - get old events', async ({ history }) => {
  const events = [
    { aggregate: 'name', aggregateId: uuid(), name: 'nama', data: { e: 1 } },
  ];
  await history.save(events[0]);
  const liveEvents = await maxFromStream(1, history.getLiveStream());
  assert.equal(liveEvents.length, 1);
  containEventByAggragateNameIdAndData(liveEvents, events[0]);
});

test('.getLiveStream() - get old and new events', async ({ history }) => {
  const events = [
    { aggregate: 'name', aggregateId: uuid(), name: 'nama', data: { e: 1 } },
    { aggregate: 'name', aggregateId: uuid(), name: 'nama', data: { e: 2 } },
  ];
  await history.save(events[0]);
  const stream = history.getLiveStream();
  await history.save(events[1]);
  const liveEvents = await maxFromStream(2, stream);
  assert.equal(liveEvents.length, 2);
  containEventByAggragateNameIdAndData(liveEvents, events[0]);
  containEventByAggragateNameIdAndData(liveEvents, events[1]);
});

test(
  '.getLiveStream() - get old and new events for each save',
  async ({ history }) => {
    const events = [
      { aggregate: 'name', aggregateId: uuid(), name: 'nama', data: { e: 1 } },
      { aggregate: 'name', aggregateId: uuid(), name: 'nama', data: { e: 2 } },
      { aggregate: 'name', aggregateId: uuid(), name: 'nama', data: { e: 3 } },
    ];
    await history.save(events[0]);
    const stream = history.getLiveStream();
    await history.save(events[1]);
    await history.save(events[2]);
    const liveEvents = await maxFromStream(3, stream);
    assert.equal(liveEvents.length, 3);
    containEventByAggragateNameIdAndData(liveEvents, events[0]);
    containEventByAggragateNameIdAndData(liveEvents, events[1]);
    containEventByAggragateNameIdAndData(liveEvents, events[2]);
  },
);

test(
  '.getLiveStream() - get new events for only one aggregate',
  async ({ history }) => {
    const aggregateId1 = uuid();
    const aggregateId2 = uuid();
    const events = [
      { aggregate: 'name', aggregateId: aggregateId1, name: 'nama', data: { e: 1 } },
      { aggregate: 'name', aggregateId: aggregateId2, name: 'nama', data: { e: 1 } },
    ];
    const stream = history.getLiveStream({ aggregateId: aggregateId1 });
    await history.save(events[0]);
    await history.save(events[1]);
    const liveEvents = await maxFromStream(1, stream);
    assert.equal(liveEvents.length, 1);
    containEventByAggragateNameIdAndData(liveEvents, events[0]);
  },
);

test(
  '.getLiveStream() - get old events for only one aggregate',
  async ({ history }) => {
    const aggregateId1 = uuid();
    const aggregateId2 = uuid();
    const events = [
      { aggregate: 'name', aggregateId: aggregateId1, name: 'nama', data: { e: 1 } },
      { aggregate: 'name', aggregateId: aggregateId2, name: 'nama', data: { e: 2 } },
    ];
    await history.save(events[0]);
    await history.save(events[1]);
    const liveEvents = await maxFromStream(
      1,
      history.getLiveStream({ aggregateId: aggregateId1 }),
    );
    assert.equal(liveEvents.length, 1);
    containEventByAggragateNameIdAndData(liveEvents, events[0]);
  },
);

test(
  '.getLiveStream() - get old and new events for only one aggregate',
  async ({ history }) => {
    const aggregateId1 = uuid();
    const aggregateId2 = uuid();
    const events = [
      { aggregate: 'name', aggregateId: aggregateId1, name: 'nama', data: { e: 1 } },
      { aggregate: 'name', aggregateId: aggregateId2, name: 'nama', data: { e: 2 } },
      { aggregate: 'name', aggregateId: aggregateId1, name: 'nama', data: { e: 3 } },
      { aggregate: 'name', aggregateId: aggregateId2, name: 'nama', data: { e: 4 } },
    ];
    await history.save(events[0]);
    await history.save(events[1]);
    const stream = history.getLiveStream({ aggregateId: aggregateId1 });
    await history.save(events[2]);
    await history.save(events[3]);
    const liveEvents = await maxFromStream(2, stream);
    assert.equal(liveEvents.length, 2);
    assert.deepEqual(
      liveEvents.map((d) => d.data),
      [{ e: 1 }, { e: 3 }],
    );
  },
);

test(
  '.getLiveStream() - get old and new events for each save for only one aggregate',
  async ({ history }) => {
    const aggregateId1 = uuid();
    const aggregateId2 = uuid();
    const events = [
      { aggregate: 'name', aggregateId: aggregateId1, name: 'nama', data: { e: 1 } },
      { aggregate: 'name', aggregateId: aggregateId2, name: 'nama', data: { e: 2 } },
      { aggregate: 'name', aggregateId: aggregateId1, name: 'nama', data: { e: 3 } },
      { aggregate: 'name', aggregateId: aggregateId2, name: 'nama', data: { e: 4 } },
      { aggregate: 'name', aggregateId: aggregateId1, name: 'nama', data: { e: 5 } },
      { aggregate: 'name', aggregateId: aggregateId2, name: 'nama', data: { e: 6 } },
    ];
    await history.save(events[0]);
    await history.save(events[1]);
    const stream = history.getLiveStream({ aggregateId: aggregateId1 });
    await history.save(events[2]);
    await history.save(events[3]);
    await history.save(events[4]);
    await history.save(events[5]);
    const liveEvents = await maxFromStream(3, stream);
    assert.equal(liveEvents.length, 3);
    assert.deepEqual(
      liveEvents.map((d) => d.data),
      [{ e: 1 }, { e: 3 }, { e: 5 }],
    );
  },
);
