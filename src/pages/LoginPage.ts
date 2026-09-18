import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';


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


  //Fills in the login form and submits it.
  async login(username: string, password: string) {
    await this.goto('/#practice');
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle'); // wait for the page to settle after login
  }

  
  async expectLoggedIn() {
    await expect(this.page).toHaveURL(/#dashboard/);
  }
}