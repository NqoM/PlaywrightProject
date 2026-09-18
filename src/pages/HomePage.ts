import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

//Page Object for the dashboard screen: Opens the menu dropdown and navigates to My profile 
 
export class HomePage extends BasePage {
  readonly menuButton: Locator;
  readonly myProfileLink: Locator;

  constructor(page: Page) {
    super(page);
    this.menuButton = page.locator('button.user-pill');
    this.myProfileLink = page.locator('button.nav-dropdown-item', { hasText: 'My Profile' });
  }

  async openMenu() {
    await this.menuButton.click();
  }

  async goToMyProfile() {
    await this.myProfileLink.click();
  }
}