import { test, expect } from '../src/fixtures/CustomFixtures.ts';

/**
 * Credentials are read directly from process.env — this is one of the
 * two places in the codebase (the other being CustomFixtures.ts) that
 * touches them.
 */
test('user can log in successfully', async ({ loginPage }) => {
  await loginPage.login(
    process.env.TEST_USERNAME!,
    process.env.TEST_PASSWORD!
  );
  await loginPage.expectLoggedIn();
});