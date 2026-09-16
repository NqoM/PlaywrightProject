import { test, expect } from '../src/fixtures/CustomFixtures';
import path from 'path';
import { testFiles } from '../src/data/testData';
import { recordNetworkRequests, saveDiscoveredEndpoints } from '../src/utils/networkRecorder';

test('user can upload a new profile picture', async ({ page, authenticatedPage, userProfilePage }) => {
  const captured = recordNetworkRequests(page);

  await authenticatedPage.openMenu();
  await authenticatedPage.goToMyProfile();
  await userProfilePage.goToEditProfile();

  const filePath = path.resolve(process.cwd(), testFiles.newProfilePicture);
  await userProfilePage.uploadProfilePicture(filePath);
  await userProfilePage.saveAndExpectSuccess();

  saveDiscoveredEndpoints(captured);
});