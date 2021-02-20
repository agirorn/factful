const { suite } = require('sanna');
const { v4: uuid } = require('uuid');
const assert = require('assert');
const ValidationError = require('../lib/errors/ValidationError');
const {
  maxFromStream,
  pStreamToArray,
  rejection,
  connectToDb,
  disconnectFromDb,
} = require('./helpers');

const config = {
  userId: true,
};
let test = suite('Factful userId');
test.before(connectToDb);
test.after(disconnectFromDb);

test(
  '.create(stream) and .destory(stream) creates and then destorises the streams',
  async ({ history }) => {
    await history.create(config);
    assert.equal(await history.exists(), true);
    await history.destroy();
    assert.equal(await history.exists(), false);
  },
);

const { stringify } = JSON;
function assertIsAValidationErrorWithMessage(actual, message, event) {
  assert(actual instanceof ValidationError);
  assert.equal(actual.message, `${message} on event ${stringify(event)}`);
}

test = suite('Factful userId - validation');
test.before(connectToDb);
test.after(disconnectFromDb);

test.before(async ({ history }) => {
  await history.create(config);
});

test('fails when userId is missing', async ({ history }) => {
  const event = {
    data: {},
  };
  assertIsAValidationErrorWithMessage(
    await rejection(history.save(event)),
    'Invalid event, missing userId',
    event,
  );
});

test('fails when userId is not a valid uuid', async ({ history }) => {
  const event = {
    data: {},
    userId: '1',
  };
  assertIsAValidationErrorWithMessage(
    await rejection(history.save(event)),
    'Invalid event, userId is not a valid uuid',
    event,
  );
});

test = suite('Factful userId - aggregate stream');
test.before(connectToDb);
test.before(async ({ history }) => { await history.create(config); });
test.after(async ({ history }) => history.destroy());
test.after(disconnectFromDb);
const allBasicEvents = async (history) => pStreamToArray(
  history.getStream(),
);

const containEventByUserIdAndData = (events, { userId, data }) => {
  assert.deepEqual(events.find((e) => e.userId === userId).data, data);
};

test(
  '.getStream() - getting all events from the stream withe userId',
  async ({ history }) => {
    const events = [
      { userId: uuid(), data: { e: 1 } },
      { userId: uuid(), data: { e: 2 } },
    ];
    await history.save(events);

    const all = await allBasicEvents(history);
    containEventByUserIdAndData(all, events[0]);
    containEventByUserIdAndData(all, events[1]);
  },
);

test('.getLiveStream() - get new events', async ({ history }) => {
  const events = [
    { userId: uuid(), data: { e: 1 } },
  ];
  const stream = history.getLiveStream();
  await history.save(events[0]);
  const liveEvents = await maxFromStream(1, stream);
  assert.equal(liveEvents.length, 1);
  containEventByUserIdAndData(liveEvents, events[0]);
});
