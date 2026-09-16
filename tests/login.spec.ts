import { test, expect } from '../src/fixtures/CustomFixtures';

/**
 * This test verifies login itself, so it deliberately uses the plain
 * `loginPage` fixture rather than `authenticatedPage` — using
 * authenticatedPage here would mean login already happened inside the
 * fixture, defeating the purpose of a test whose job is to confirm
 * login works.
 *
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