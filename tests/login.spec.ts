import { test, expect } from '../src/fixtures/CustomFixtures';
import { testUser } from '../src/data/testData';

test('user can log in successfully', async ({ loginPage }) => {
  await loginPage.login(testUser.username, testUser.password);
  await loginPage.expectLoggedIn();
});