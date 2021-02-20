const { validate: validUUID } = require('uuid');
const ValidationError = require('./errors/ValidationError');

const isUndefined = (v) => (v === undefined || v === null);

const validateEvents = (options, events) => {
  if (options.userId) {
    events.forEach((event) => {
      if (isUndefined(event.userId)) {
        throw new ValidationError('Invalid event, missing userId', event);
      }

      if (!validUUID(event.userId)) {
        throw new ValidationError('Invalid event, userId is not a valid uuid', event);
      }
    });
  }

  if (!options.aggregate) {
    return;
  }

  events.forEach((event) => {
    if (!event.aggregate) {
      throw new ValidationError('Invalid event, missing aggregate', event);
    }

    if (!event.aggregateId) {
      throw new ValidationError('Invalid event, missing aggregateId', event);
    }

    if (!event.name) {
      throw new ValidationError('Invalid event, missing name', event);
    }
  });
};

module.exports = {
  validateEvents,
};
