const { validate: validUUID } = require('uuid');
const InvalidPropertyError = require('./errors/InvalidPropertyError');

const { stringify } = JSON;

const validateEventDataTypes = (event) => {
  if (!event.id) {
    throw new Error(
      `Missing .id for event ${stringify(event)}`,
    );
  }
  if (!event.aggregateId) {
    throw new Error(
      `Missing aggregateId for event ${stringify(event)}`,
    );
  }

  if (!validUUID(event.id)) {
    throw new InvalidPropertyError('UUID', 'id', event);
  }

  if (!validUUID(event.aggregateId)) {
    throw new InvalidPropertyError('UUID', 'aggregateId', event);
  }

  if (Number.isNaN(Number.parseInt(event.revision, 10))) {
    throw new InvalidPropertyError('int', 'revision', event);
  }

  if (!(event.data instanceof Object)) {
    throw new InvalidPropertyError('Object', 'data', event);
  }

  if (event.revision < 1) {
    throw new Error(
      `Invalid property(.revission) must be larger then 1 on event ${stringify(event)}`,
    );
  }
};

module.exports = validateEventDataTypes;
