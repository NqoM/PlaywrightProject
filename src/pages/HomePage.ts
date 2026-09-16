import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly menuButton: Locator;
  readonly myProfileLink: Locator;

  constructor(page: Page) {
    super(page);
    this.menuButton = page.locator('button.user-pill');
    // Scoped by text since multiple dropdown items likely share the
    // same "nav-dropdown-item" class (Write Review, Instructor Panel, etc.)
    this.myProfileLink = page.locator('button.nav-dropdown-item', { hasText: 'My Profile' });
  }

  async openMenu() {
    await this.menuButton.click();
  }

  async goToMyProfile() {
    await this.myProfileLink.click();
  }
}