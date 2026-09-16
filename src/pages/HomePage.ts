import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the dashboard/home screen: menu navigation and
 * the link into "My Profile".
 *
 * Selectors verified against the real ndosi site via DevTools inspection:
 *   - Menu button has no id, but a distinct class: "user-pill"
 *   - "My Profile" is one of several dropdown items sharing the class
 *     "nav-dropdown-item" (others include Write Review, Instructor
 *     Panel, Admin Panel, Logout) — so it's scoped by its visible text
 *     rather than by class alone.
 */
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