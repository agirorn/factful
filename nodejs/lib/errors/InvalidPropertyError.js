class InvalidPropertyError extends Error {
  constructor(TYPE, property, EVENT) {
    const event = JSON.stringify(EVENT);
    super(
      `Invalid type(${TYPE}) for property(.${property}) on event ${event}`,
    );
  }
}

module.exports = InvalidPropertyError;
