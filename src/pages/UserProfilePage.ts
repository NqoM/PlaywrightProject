import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class UserProfilePage extends BasePage {
  readonly editProfileLink: Locator;
  readonly fileInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.editProfileLink = page.locator('button', { hasText: 'Edit Profile' });
    this.fileInput = page.locator('#profilePicture');
    this.saveButton = page.locator('button[type="submit"]', { hasText: 'Save Changes' });
  }

  async goToEditProfile() {
    await this.editProfileLink.click();
  }

  async uploadProfilePicture(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
  }

  async saveAndExpectSuccess() {
    const dialogPromise = new Promise<string>((resolve) => {
      this.page.once('dialog', async (dialog) => {
        const message = dialog.message();
        await dialog.accept();
        resolve(message);
      });
    });

    await this.saveButton.click();
    const alertMessage = await dialogPromise;

    expect(alertMessage).toContain('Profile updated successfully');
  }
}