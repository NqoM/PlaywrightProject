import { test, expect } from '@playwright/test';
import path from 'path';

test('upload new profile picture', async ({ page }) => {
  const capturedRequests: { url: string; method: string }[] = [];

  page.on('request', (req) => {
    capturedRequests.push({ url: req.url(), method: req.method() });
  });

  // 1. Login
  await page.goto('/login');
  await page.fill('#username', process.env.TEST_USERNAME!);
  await page.fill('#password', process.env.TEST_PASSWORD!);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/dashboard/);

  // 2. Click menu
  await page.click('[data-testid="menu-button"]');

  // 3. Click my profile
  await page.click('text=My Profile');

  // 4. Click edit profile
  await page.click('text=Edit Profile');

  // 5. Upload a new profile picture
  const filePath = path.join(__dirname, 'fixtures', 'test-avatar.jpg');
  await page.setInputFiles('input[type="file"]', filePath);
  await page.click('button:has-text("Save")');

  // 6. Ensure the profile picture is updated
  await expect(page.locator('img.profile-picture')).toHaveAttribute(
    'src',
    /test-avatar|updated/
  );

  console.log('Captured endpoints:', capturedRequests);
  require('fs').writeFileSync(
    'test-results/discovered-endpoints.json',
    JSON.stringify(capturedRequests, null, 2)
  );
});