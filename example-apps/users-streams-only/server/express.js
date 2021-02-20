const express = require('express');
const connectLivereload = require('connect-livereload');
const session = require('./session');
const passportSetup = require('./passport');
const actions = require('./actions');

const setup = (streams) => {
  const action = actions(streams);
  const app = express();
  app.use(action.logIt);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  session(app);
  app.use(connectLivereload({ port: 35729 }));
  const {
    authenticate,
    requiresApiLogin,
    requiresLogin,
  } = passportSetup(app, streams);
  app.get('/logout', action.logout);
  app.use('/dist', express.static('dist'));
  app.get('/login', action.serverReact);
  app.get('/*', requiresLogin, action.serverReact);
  app.post('/login', authenticate, action.login);
  app.post('/command', requiresApiLogin, action.command);
  app.use(express.static('public'));
  app.use(action.handleError);
  return app;
};

module.exports = {
  setup,
};
