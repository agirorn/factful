const isArray = (v) => v instanceof Array;
const toArray = (arrayOrValue) => (
  isArray(arrayOrValue)
    ? arrayOrValue
    : [arrayOrValue]
);

module.exports = {
  toArray,
};
