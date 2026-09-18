

// Adds test data: file paths and expected values.

export const testFiles = {
  newProfilePicture: 'src/fixtures/test-avatar.jpg',
};

export const expectedStatusCodes: Record<string, number[]> = {
  
  login: [200, 302],
  profile: [200],
  uploadAvatar: [200, 201],
};