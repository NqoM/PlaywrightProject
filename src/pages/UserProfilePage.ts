import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the "Edit Profile" screen, covering the profile
 * picture upload flow.
 *
 * Selectors here are verified against the real ndosi site (inspected
 * via DevTools), not placeholders:
 *   - "Edit Profile" button has no id/class, so it's targeted by its
 *     visible text.
 *   - The visible "Choose Photo" control is a <label for="profilePicture">
 *     wrapping a hidden file input with id="profilePicture" — Playwright
 *     targets that hidden input directly via setInputFiles(), which
 *     works even though it's not visually clickable.
 *   - "Save Changes" is a <button type="submit">, also matched by text
 *     since it has no id/class either.
 */
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

  /**
   * Clicks "Edit Profile" from the My Profile screen to open the
   * edit form.
   */
  async goToEditProfile() {
    await this.editProfileLink.click();
  }

  /**
   * Sets the given file on the hidden file input. Playwright can set
   * files directly on a hidden <input type="file">, so there's no
   * need to click the visible "Choose Photo" label first — the site
   * shows a live avatar preview immediately after this call, though
   * that preview isn't asserted on directly (see saveAndExpectSuccess).
   */
  async uploadProfilePicture(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
  }

  /**
   * Clicks "Save Changes" and captures the native browser alert()
   * the site raises on success ("Profile updated successfully!").
   *
   * Native dialogs (alert/confirm/prompt) are NOT part of the page's
   * DOM — Playwright auto-dismisses them by default unless a listener
   * is registered BEFORE the action that triggers them. So the
   * page.once('dialog', ...) listener is set up first, then Save is
   * clicked, then we await the dialog's message.
   *
   * dialog.accept() is what actually "clicks OK" on the native alert —
   * there's no selector for it since it isn't page HTML.
   */
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