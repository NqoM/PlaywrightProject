import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { UserProfilePage } from '../pages/UserProfilePage';

type MyFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  userProfilePage: UserProfilePage;
  authenticatedPage: HomePage; // already logged in, ready to use
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  userProfilePage: async ({ page }, use) => {
    await use(new UserProfilePage(page));
  },

  // A fixture that performs login once and hands back a HomePage
  // object ready to use — tests that need to start "already logged in"
  // use this instead of loginPage.
  //
  // Credentials are read directly from process.env here — this is the
  // only place in the codebase, besides tests/login.spec.ts, that
  // touches them. expectLoggedIn() confirms the login actually
  // succeeded before handing back a "ready to use" HomePage — without
  // this check, a failed login would silently produce a HomePage
  // object that isn't actually authenticated, and tests using it would
  // fail later with confusing errors instead of failing clearly here.
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(
      process.env.TEST_USERNAME!,
      process.env.TEST_PASSWORD!
    );
    await loginPage.expectLoggedIn();
    await use(new HomePage(page));
  },
});

export { expect };