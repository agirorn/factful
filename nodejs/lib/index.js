const destroy = require('./destroy');
const create = require('./create');
const exists = require('./exists');
const saveEvents = require('./saveEvents');
const getStream = require('./getStream');
const getLiveStream = require('./getLiveStream');

class Factful {
  constructor(options) {
    this.streamName = options.name;
    this.pool = options.pool;
  }

  async create(options = {}) {
    return create(this.pool, this.streamName, options);
  }

  async destroy() {
    return destroy(this.pool, this.streamName);
  }

  async exists() {
    return exists(this.pool, this.streamName);
  }

  async save(eventsOrEvent, postHook) {
    return saveEvents(this.pool, this.streamName, eventsOrEvent, postHook);
  }

  getStream(options = {}) {
    return getStream(this.pool, this.streamName, options);
  }

  getLiveStream(options = {}) {
    return getLiveStream(this.pool, this.streamName, options);
  }
}

module.exports = Factful;
