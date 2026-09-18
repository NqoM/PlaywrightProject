import { test, expect } from '../src/fixtures/CustomFixtures.ts';


test('user can log in successfully', async ({ loginPage }) => {
  await loginPage.login(
    process.env.TEST_USERNAME!,
    process.env.TEST_PASSWORD!
  );
  await loginPage.expectLoggedIn();
});