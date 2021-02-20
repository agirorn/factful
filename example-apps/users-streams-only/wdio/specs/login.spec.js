const LoginPage = require('../pageobjects/login.page');
const SecurePage = require('../pageobjects/secure.page');

describe('My Login application', () => {
  it('should login with valid credentials', async () => {
    await LoginPage.open();
    await browser.pause(1000);
    await LoginPage.login('admin', 'admin');
    await browser.pause(1000);
    // await expect(SecurePage.flashAlert).toBeExisting();
    await browser.pause(1000);
    await expect(LoginPage.pageBody).toHaveTextContaining(
      'New User',
    );
    await browser.pause(1000);
  });
});
