import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';

// Explicitly resolves .env relative to this config file's own location
// (rather than relying on the current working directory), so it's
// found reliably regardless of which folder the test command is run from.
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  //workers: process.env.CI ? 1 : undefined,
  workers: 1,
  timeout: 60_000,
  

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // Multiple reporters: HTML for humans, JSON for CI artifacts / dashboards,
  // list for readable console output while running locally.
  //reporter: 'html',
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    //baseURL: 'https://ndosisimplifiedautomation.vercel.app',
    //actionTimeout: 0,
    //navigationTimeout: 30000,
    //screenshot: 'on',
    //trace: 'on-first-retry',
  //},
  baseURL: process.env.BASE_URL || 'https://ndosisimplifiedautomation.vercel.app',
  viewport: { width: 1920, height: 1080 },
  trace: 'on-first-retry',
  screenshot: 'on',
  video: 'retain-on-failure',
  actionTimeout: 15_000,
  },
  
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    //{
      //name: 'firefox',
     // use: { ...devices['Desktop Firefox'] },
    //},

    //{
      //name: 'webkit',
      //use: { ...devices['Desktop Safari'] },
    //},

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  
});
