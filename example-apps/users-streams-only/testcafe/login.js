import { Selector } from 'testcafe';

fixture('Getting Started')
  .page('http://localhost:8080/');

test('My first test', async (t) => {
  await t
    .expect(Selector('h1').innerText).eql('Login')
    .click('button[name=submit]')
    .typeText('input[name=username]', 'admin')
    .typeText('input[name=password]', 'admin')
    .click('button[name=submit]')
    // eslint-disable-next-line newline-per-chained-call
    .expect(Selector('h1').innerText).eql('New User');
});
