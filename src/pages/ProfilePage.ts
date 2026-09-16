import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for the profile section: menu navigation, edit profile,
 * and the profile picture upload flow.
 */
export class ProfilePage {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly myProfileLink: Locator;
  readonly editProfileLink: Locator;
  readonly fileInput: Locator;
  readonly saveButton: Locator;
  readonly profilePicture: Locator;

  constructor(page: Page) {
    this.page = page;
    // TODO: adjust these selectors to match the real ndosi site markup
    this.menuButton = page.locator('[data-testid="menu-button"]');
    this.myProfileLink = page.locator('text=My Profile');
    this.editProfileLink = page.locator('text=Edit Profile');
    this.fileInput = page.locator('input[type="file"]');
    this.saveButton = page.locator('button:has-text("Save")');
    this.profilePicture = page.locator('img.profile-picture');
  }

  async openMenu() {
    await this.menuButton.click();
  }

  async goToMyProfile() {
    await this.myProfileLink.click();
  }

  async goToEditProfile() {
    await this.editProfileLink.click();
  }

  async uploadProfilePicture(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
    await this.saveButton.click();
  }

  async expectPictureUpdated() {
    // Adjust this assertion once you know exactly how the site reflects
    // a successful update (new src, a success toast, updated timestamp, etc.)
    await expect(this.profilePicture).toBeVisible();
  }
}
