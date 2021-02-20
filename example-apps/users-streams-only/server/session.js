const session = require('express-session');

module.exports = (app) => {
  const sess = {
    secret: 'user cat',
    cookie: {},
  };
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
  }
  app.use(session(sess));
};
