const db = {
  tableName: (streamName) => `${streamName}_events`,
  optionsName: (streamName) => `${streamName}_options`,
};

module.exports = db;
