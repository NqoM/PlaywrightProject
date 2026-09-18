import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { UserProfilePage } from '../pages/UserProfilePage';


// Custom fixtures for the project. These fixtures are available in all tests, and can be used to create page objects for the different screens of the application.

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