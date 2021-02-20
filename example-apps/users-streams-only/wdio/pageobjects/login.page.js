const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
  /**
   * define selectors using getter methods
   */
  get username() { return $('input[name=username]'); }

  get password() { return $('input[name=password]'); }

  get btnSubmit() { return $('button[name=submit]'); }

  /**
   * a method to encapsule automation code to interact with the page
   * e.g. to login using username and password
   */
  async login(username, password) {
    await (await this.username).setValue(username);
    await (await this.password).setValue(password);
    await (await this.btnSubmit).click();
  }

  /**
   * overwrite specifc options to adapt it to page object
   */
  open() {
    return super.open('login');
  }
}

module.exports = new LoginPage();
