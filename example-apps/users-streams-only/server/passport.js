const { pick } = require('ramda');
const { Strategy: LocalStrategy } = require('passport-local');
const passport = require('passport');

const authenticate = passport.authenticate('local');
const requiresApiLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).end();
};

const requiresLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
};

const getUsersFrom = (streams) => {
  const users = [];

  process.nextTick(async () => {
    const liveStream = streams.getLiveStream('users');
    // eslint-disable-next-line no-restricted-syntax
    for await (const event of liveStream) {
      const {
        aggregateId,
        aggregate,
        name,
        data,
      } = event;
      if (aggregate === 'USERS') {
        if (name === 'CREATED') {
          users.push({
            id: aggregateId,
            ...pick(['username', 'password', 'active'], data),
          });
        }
      }
    }
  });

  return users;
};

const authenticateUser = (users) => (username, password, cb) => {
  const found = users.filter((user) => (
    user.username === username && user.active
  ));
  if (found.length === 0) {
    return cb(new Error('No user found'));
  }
  const user = found[0];
  if (user.password === password) {
    return cb(null, user);
  }
  return cb(null, false);
};

const localStrategyFor = (users) => new LocalStrategy(
  {
    passReqToCallback: false,
    session: true,
  },
  authenticateUser(users),
);

const serializeUser = (user, cb) => { cb(null, user); };
const deserializeUser = (user, cb) => { cb(null, user); };

const setup = (app, streams) => {
  const users = getUsersFrom(streams);
  passport.use(localStrategyFor(users));
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
  app.use(passport.initialize());
  app.use(passport.session());

  return {
    passport,
    authenticate,
    requiresApiLogin,
    requiresLogin,
  };
};

module.exports = setup;
