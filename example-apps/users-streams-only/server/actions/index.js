const chalk = require('chalk');
const path = require('path');
const wrap = require('../wrap');
const { commandHandler } = require('../command-handler');

const logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

const login = wrap(() => {});

const logIt = (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(`${req.method} ${req.url}`);
  next();
};

const serverReact = (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../public/index.html'));
};

const errorColor = chalk.bold.keyword('orange');

// eslint-disable-next-line no-unused-vars
const handleError = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('\n', errorColor(err.stack));
  res.status(500).json({
    message: err.message,
    stack: err.stack.split('\n'),
  });
};

module.exports = (streams) => ({
  serverReact,
  logIt,
  logout,
  login,
  command: wrap(commandHandler(streams)),
  handleError,
});
