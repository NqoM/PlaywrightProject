import { test, expect } from '../src/fixtures/CustomFixtures';
import path from 'path';
import { testFiles } from '../src/data/TestData';
import { recordNetworkRequests, saveDiscoveredEndpoints } from '../src/utils/networkRecorder';

test('user can upload a new profile picture', async ({ page, authenticatedPage, userProfilePage }, testInfo) => {
  const captured = recordNetworkRequests(page);

  await authenticatedPage.openMenu();
  await authenticatedPage.goToMyProfile();
  await userProfilePage.goToEditProfile();

  const filePath = path.resolve(process.cwd(), testFiles.newProfilePicture);
  await userProfilePage.uploadProfilePicture(filePath);

  // Attach a screenshot of the pre-save preview directly to the HTML report. Taken right after selecting the file, before "Save Changes" is clicked.
  const previewScreenshot = await page.screenshot({ fullPage: true });
  await testInfo.attach('profile-picture-preview-before-save', {
    body: previewScreenshot,
    contentType: 'image/png',
  });

  await userProfilePage.saveAndExpectSuccess();

  // Attach a screenshot right after the success alert is confirmed, directly to the HTML report — direct evidence the upload completed.
  const confirmedScreenshot = await page.screenshot({ fullPage: true });
  await testInfo.attach('profile-picture-upload-confirmed', {
    body: confirmedScreenshot,
    contentType: 'image/png',
  });

  saveDiscoveredEndpoints(captured);
});