import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for the login screen.
 * Keeping selectors here means that if the ndosi site's markup changes,
 * you only update them in one place instead of hunting through every test.
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // TODO: adjust these selectors to match the real ndosi site markup
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectLoggedIn() {
    await expect(this.page).toHaveURL(/dashboard/);
  }
}
