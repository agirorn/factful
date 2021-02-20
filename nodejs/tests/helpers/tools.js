const { stringify } = JSON;
const invert = (p) => p.then(
  (v) => { throw v; },
  (v) => v,
);

const rejection = (p) => p.then(
  (v) => {
    throw new Error(
      `The promise should have been rejected but did resolve with ${stringify(v)}`,
    );
  },
  (v) => v,
);
const nextTick = () => new Promise((resolve) => {
  process.nextTick(() => {
    resolve();
  });
});

const pStreamToArray = async (stream) => new Promise((resolve, reject) => {
  const array = [];
  stream.on('data', (e) => {
    array.push(e);
  });
  stream.on('end', () => {
    resolve(array);
  });
  stream.on('error', (error) => {
    reject(error);
  });
});

const maxFromStream = async (max, stream) => {
  const list = [];
  for await (const item of stream) {
    list.push(item);
    if (list.length === max) { stream.end(); }
  }
  return list;
};

module.exports = {
  invert,
  rejection,
  nextTick,
  stringify,
  pStreamToArray,
  maxFromStream,
};
