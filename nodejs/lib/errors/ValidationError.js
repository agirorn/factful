class ValidationError extends Error {
  constructor(error, event) {
    const json = JSON.stringify(event);
    super(
      `${error} on event ${json}`,
    );
  }
}

module.exports = ValidationError;
