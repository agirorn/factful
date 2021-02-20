const { PassThrough } = require('stream');

class ArrayStream extends PassThrough {
  constructor(array) {
    super({ objectMode: true });
    process.nextTick(() => {
      array.forEach((e) => {
        this.write(e);
      });
      process.nextTick(() => {
        this.end();
      });
    });
  }
}

module.exports = ArrayStream;
