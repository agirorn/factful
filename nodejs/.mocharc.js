module.exports = {
  diff: true,
  inlineDiffs: false,
  extension: ['js'],
  package: './package.json',
  reporter: 'spec',
  slow: 75,
  timeout: 6000,
  file: [
    './tests/setup.js'
  ],
  spec: [
  ],
  ui: 'bdd',
  recursive: true,
  reporter: process.env.MOCHA_REPORTER || 'dot', // spec, min
  exit: true,
  require: [ 'chai', './tests/helpers/custom-matchers.js' ],
};
