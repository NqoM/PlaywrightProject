import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the login screen.
 * Keeping selectors here means that if the ndosi site's markup changes,
 * you only update them in one place instead of hunting through every test.
 *
 * Selectors verified against the real ndosi site via DevTools inspection:
 *   - #login-email  (name="loginEmail")
 *   - #login-password  (name="loginPassword")
 *   - #login-submit
 *
 * This page object does not know or care where the username/password
 * values come from — that's handled by whatever calls login(). See
 * tests/login.spec.ts and src/fixtures/CustomFixtures.ts, which both
 * read credentials from process.env.
 */
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#login-email');
    this.passwordInput = page.locator('#login-password');
    this.submitButton = page.locator('#login-submit');
  }

  /**
   * Fills in the login form and submits it. The login form lives at
   * the site's root path (hash-based routing, not a separate /login
   * route), so goto('/') navigates there.
   */
  async login(username: string, password: string) {
    await this.goto('/');
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  /**
   * Confirms login succeeded by checking the URL changed to the
   * dashboard hash route, confirmed via screenshot of the real site
   * after a successful login (#dashboard).
   */
  async expectLoggedIn() {
    await expect(this.page).toHaveURL(/#dashboard/);
  }
}