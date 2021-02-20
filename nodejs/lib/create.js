const debug = require('debug')('factful:pg');
const {
  tableName,
  optionsName,
} = require('./db');

const {
  stringify: encode,
} = JSON;

const create = async (pool, streamName, options) => {
  debug(new Error(`create ${streamName}`));
  const STREAM = tableName(streamName);
  const OPTIONS = optionsName(streamName);
  // The trigger function (notify_event) should be removed on destroy and it
  // also should have a unique name for this particular stream

  // debug((await client.query('SELECT NOW()')).rows);
  // const STREAM_CHANNEL = 'stream_' + TABLE_NAME.toLowerCase();
  const columns = [
    '"offset" BIGSERIAL NOT NULL',
    '"id" UUID NOT NULL DEFAULT uuid_generate_v4()',
    '"data" jsonb NOT NULL',
    '"timestamp" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP',
    // '-- "revision" integer NOT NULL',
  ];
  if (options.userId) {
    columns.push('"user_id" uuid NOT NULL');
  }
  if (options.aggregate) {
    columns.push('"aggregate_id" uuid NOT NULL');
    columns.push('"aggregate" varchar(512) NOT NULL');
    columns.push('"name" varchar(512) NOT NULL');
  }

  const CONSTRAINTS = [
    `CONSTRAINT "${STREAM}_offset" PRIMARY KEY("offset")`,
    `CONSTRAINT "${STREAM}_id" UNIQUE("id")`,
  ];

  await pool.query(`
    BEGIN;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE ${STREAM} (
      ${columns.join(',')},
      ${CONSTRAINTS.join(',')}
    );

    CREATE TABLE ${OPTIONS} (
      "data" jsonb NOT NULL
    );

    INSERT INTO ${OPTIONS} ("data")
    VALUES ('${encode(options)}');

    CREATE SCHEMA IF NOT EXISTS factful;

    create or replace function factful.notify_event()
     returns trigger
     language plpgsql
    as $$
    declare
      channel text := TG_ARGV[0];
    begin
      PERFORM (
         with payload(id) as
         (
           select NEW.offset
           -- , NEW.id
           -- , NEW.aggregate
           -- , NEW."aggregateId"
           -- , NEW.revision
         )
         select pg_notify(channel, row_to_json(payload)::text)
           from payload
      );
      RETURN NULL;
    end;
    $$;

    CREATE TRIGGER notify_counters
             AFTER INSERT
                ON ${STREAM}
          FOR EACH ROW
           EXECUTE PROCEDURE factful.notify_event('${STREAM}');
    COMMIT;
  `);
};

module.exports = create;
