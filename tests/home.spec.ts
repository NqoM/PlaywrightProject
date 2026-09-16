import { test, expect } from '../src/fixtures/CustomFixtures.ts';

test('user can navigate from menu to my profile', async ({ page, authenticatedPage }) => {
  await authenticatedPage.openMenu();
  await authenticatedPage.goToMyProfile();

  await expect(page).toHaveURL(/#profile/);
});