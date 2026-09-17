# Profile Picture Automation — Ndosi Test Site

End-to-end UI and API automation for the "upload a profile picture" flow on the ndosi automation practice site, built with **Playwright + TypeScript**.

Live site: https://ndosisimplifiedautomation.vercel.app

## What this covers

**UI** (`tests/1-login.spec.ts`, `2-home.spec.ts`, `3-profile.spec.ts`): 
Login → Menu → My Profile → Edit Profile → upload picture → verify success.

**API** (`tests/4-api-validation.spec.ts`): endpoints are discovered automatically during the UI flow (via network interception) and re-validated for non-error response codes.

**Reporting**: HTML + JSON reports, screenshots on every test, video on failure.

## Tech stack

Playwright, TypeScript, dotenv (local credentials), GitHub Actions (CI).

## Project structure

```
src/
├── data/TestData.ts # File paths + expected status codes
├── fixtures/ # CustomFixtures.ts + test image fixtures
├── pages/ # Page objects: BasePage, LoginPage, HomePage, UserProfilePage
└── utils/networkRecorder.ts # Captures API calls during UI flow
tests/
├── 1-login.spec.ts
├── 2-home.spec.ts
├── 3-profile.spec.ts
└── 4-api-validation.spec.ts
```

Test files are numbered to guarantee execution order — `4-api-validation` depends on `3-profile` running first in the same command, since that's what populates `discovered-endpoints.json`.

## Setup

```bash
npm install
npx playwright install --with-deps
```

Create a `.env` file in the project root:

BASE_URL=https://ndosisimplifiedautomation.vercel.app
TEST_USERNAME=your-test-username
TEST_PASSWORD=your-test-password


## Running tests

```bash
npx playwright test              # run full suite, in order
npx playwright show-report       # view last report
```

Tests run sequentially (`workers: 1`) — running them in parallel caused login race conditions against the shared test account.

## CI/CD

`.github/workflows/playwright.yml` runs on push/PR to `main`, nightly at midnight SAST (`cron: '0 22 * * *'`, since GitHub Actions cron is UTC and SAST is UTC+2), and manually via `workflow_dispatch`.

**Required GitHub secrets:** `BASE_URL`, `TEST_USERNAME`, `TEST_PASSWORD`.



## Lesson learned / Notable issues found while building this

- Login form lives at `/#practice`, not the site root.
- Browser wasn't opening at full screen size when running tests, causing the "Menu" button to be cut off and not clickable. Fixed by adding an explicit `viewport` size in `playwright.config.ts` to make the browser window wider.
- Running tests in parallel caused intermittent login and navigation failures, since multiple tests were logging into the same live test account at the same time.Fixed with `fullyParallel: false` and  `workers: 1` in the Playwright.config file.
- Playwright runs spec files in alphabetical order by default, so `api-validation.spec.ts` ran before `profile.spec.ts` and always found an empty results file. Fixed by numbering test files (`1-login`, `2-home`, `3-profile`, `4-api-validation`) to guarantee execution order.
-  A file casing mismatch (TestData.ts vs testData.ts) passed locally on Windows but failed in CI, since Linux file systems are case-sensitive and Windows' aren't. Fixed by renaming through a temporary filename first (`git mv TestData.ts TestData-temp.ts` then `git mv TestData-temp.ts TestData.ts`), since a direct same-name-different-case rename isn't reliably recognized by git on Windows.
- Local `.env` values don't automatically transfer to CI — the same  `BASE_URL`, `TEST_USERNAME`, and `TEST_PASSWORD` values had to be added separately as GitHub repository secrets before the workflow could log in successfully.