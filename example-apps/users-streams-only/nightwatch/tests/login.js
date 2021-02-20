module.exports = {
  //
  // before: function (browser, done) {
  //   // done is a callback that executes when the server is started
  //   server = require('../server')(done)
  // },
  //
  // after: function () {
  //   server.close()
  // },
  //

  after: (client) => {
    client.end();
  },

  Login: (browser) => {
    browser
      .url('http://localhost:8080/')
      .waitForElementVisible('body')
      .assert.containsText('body', 'Login')
      .assert.visible('button[name=submit]')
      .click('button[name=submit]')
      .setValue('input[name=username]', 'admin')
      .setValue('input[name=password]', 'admin')
      .click('button[name=submit]')
      .assert.containsText('body', 'New User')
      .end();
  },
};
