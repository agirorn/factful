const invert = require('invert-promise');
const { suite } = require('sanna');
const assert = require('assert');
const { v4: uuid } = require('uuid');
const { setupPgPool } = require('./helpers');
const Factful = require('..');

const config = {
  aggregate: true,
};
const test = suite('Factful aggregate stream');
const event = {
  name: 'name',
  aggregate: 'a',
  aggregateId: uuid(),
  data: {},
};
test.before(async (context) => {
  const pool = await setupPgPool();
  const history = new Factful({
    name: 'stream_name',
    pool,
  });
  await history.create(config);
  context.history = history;
  context.pool = pool;
});
test.after(async (context) => {
  await context.pool.end();
  context.pool = undefined;
});

test(
  'postHook - postHook is called after saving events',
  async ({ history }) => {
    let called = false;
    // await history.save(event, async () => { called = true; });
    await history.save(event, () => { called = true; });
    assert(called);
  },
);

test(
  'postHook - postHook has access to the queriy object',
  async ({ history }) => {
    await history.save(event, async (db) => {
      assert(db.query instanceof Function);
    });
  },
);

test(
  'postHook - should fail and not save events when hook failse executing a bad SQL',
  async ({ history }) => {
    const postHook = async (db) => db.query('A BAD SQL QUERY');
    assert(await invert(history.save(event, postHook)) instanceof Error);
    // expect().rejectedWith(Error);
    const stream = history.getStream({ aggregateId: event.aggregateId });
    for await (const e of stream) {
      const EVENT = JSON.stringify(e);
      throw new Error(
        `should not have any events but got one ${EVENT}`,
      );
    }
  },
);

test(
  'postHook - save the event if postHook preforms a valida SQL query',
  async ({ history }) => {
    await history.save(event, async (db) => db.query('SELECT TRUE;'));
    const stream = history.getStream({ aggregateId: event.aggregateId });
    let lastEvent;
    for await (const e of stream) {
      lastEvent = e;
    }
    assert.equal(lastEvent.aggregateId, event.aggregateId);
  },
);
