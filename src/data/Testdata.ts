/**
 * Test data: file paths and expected values.
 * Credentials are intentionally NOT stored here — they're read
 * directly from environment variables in tests/login.spec.ts and
 * src/fixtures/CustomFixtures.ts, the only two places that actually
 * need them.
 */

export const testFiles = {
  newProfilePicture: 'src/fixtures/test-avatar.jpg',
  invalidFileType: 'src/fixtures/invalid-file.txt',
};

export const expectedStatusCodes: Record<string, number[]> = {
  // Map endpoint keywords to acceptable status codes.
  // Adjust these once you observe the real API responses from the site.
  login: [200, 302],
  profile: [200],
  uploadAvatar: [200, 201],
};