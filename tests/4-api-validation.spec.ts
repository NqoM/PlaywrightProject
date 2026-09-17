import { test, expect } from '@playwright/test';
import { loadDiscoveredEndpoints } from '../src/utils/networkRecorder';

test.describe('API endpoint validation', () => {
  const endpoints = loadDiscoveredEndpoints();

  test('endpoints were discovered from the UI flow', () => {
    expect(
      endpoints.length,
      'No endpoints found - run profile.spec.ts first so it can populate test-results/discovered-endpoints.json'
    ).toBeGreaterThan(0);
  });

  for (const { url, method } of endpoints) {
    test(`${method} ${url} -> returns a non-error status`, async ({ request }) => {
      const response = await request.fetch(url, { method });
      expect(response.status(), `${method} ${url} returned ${response.status()}`).toBeLessThan(500);
    });
  }
});