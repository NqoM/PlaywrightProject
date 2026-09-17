# Profile Picture Automation — Ndosi Test Site

End-to-end UI and API automation for the "upload a profile picture" flow on the Ndosi Automation test site, built with **Playwright + TypeScript**.

Website under test: https://ndosisimplifiedautomation.vercel.app

## What this covers

**UI** (tests/1-login.spec.ts, tests/2-home.spec.ts, tests/3-profile.spec.ts):    
 
Login -> Menu -> My Profile -> Edit Profile -> Upload picture -> Verify success.

Split across three separate spec files (one per screen) rather than one
long test, using Playwright's custom fixtures for shared setup like login


**API** (tests/4-api-validation.spec.ts): endpoints are discovered
automatically during the UI flow (via network interception) and
re-validated for non-error response codes.


**Reporting**:
 HTML + JSON reports, screenshots on every test, video on failure.
 
 
## Tech stack

Playwright, TypeScript, dotenv (local credentials), GitHub Actions (CI).


## Project structure

```
PlaywrightProject/
├── .github/
│   └── workflows/
│       └── playwright.yml       # CI pipeline (push/PR + nightly midnight SAST + manual trigger)
├── src/
│   ├── data/
│   │   └── TestData.ts          # File paths + expected status codes (no credentials)
│   ├── fixtures/
│   │   ├── CustomFixtures.ts    # Custom Playwright fixtures
│   │   └── test-avatar.jpg      # Sample image used for upload
│   ├── pages/
│   │   ├── BasePage.ts          # Shared base class
│   │   ├── LoginPage.ts         # Page Object: login screen
│   │   ├── HomePage.ts          # Page Object: menu, navigation
│   │   └── UserProfilePage.ts   # Page Object: edit profile, upload, save
│   └── utils/
│       └── networkRecorder.ts   # Captures + persists network requests
├── tests/
│   ├── 1-login.spec.ts
│   ├── 2-home.spec.ts
│   ├── 3-profile.spec.ts
│   └── 4-api-validation.spec.ts
├── .env                         # Local credentials (never committed)
├── .gitignore
├── playwright.config.ts
├── package.json
└── README.md

```
Test files are numbered to guarantee execution order - 4-api-validation depends on 3-profile running first in the same command, since that's what populates discovered-endpoints.json.


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


**CI/CD**
- Runs automatically on every push/PR to main
- Runs on a nightly schedule at midnight SAST
- Can also be triggered manually via GitHub's workflow_dispatch

**Required GitHub secrets:** `BASE_URL`, `TEST_USERNAME`, `TEST_PASSWORD`.


## Lessons learned /  Issues found while building this

- Browser wasn't opening at full screen size when running tests, causing the "Menu" button to be cut off and not clickable. Fixed by adding an explicit `viewport` size in `playwright.config.ts` to make the browser window wider.
- Running tests in parallel caused intermittent login and navigation failures, since multiple tests were logging into the same live test account at the same time.Fixed with `fullyParallel: false` and  `workers: 1` in the Playwright.config file.
- Playwright runs spec files in alphabetical order by default, so `api-validation.spec.ts` ran before `profile.spec.ts` and always found an empty results file. Fixed by numbering test files (`1-login`, `2-home`, `3-profile`, `4-api-validation`) to guarantee execution order.
-  A file casing mismatch (TestData.ts vs testData.ts) passed locally on Windows but failed in CI, since Linux file systems are case-sensitive and Windows' aren't. Fixed by renaming through a temporary filename first (`git mv TestData.ts TestData-temp.ts` then `git mv TestData-temp.ts TestData.ts`), since a direct same-name-different-case rename isn't reliably recognized by git on Windows.
- Local `.env` values don't automatically transfer to CI — the same  `BASE_URL`, `TEST_USERNAME`, and `TEST_PASSWORD` values had to be added separately as GitHub repository secrets before the workflow could log in successfully.
- File-based screenshots (`page.screenshot({ path: '...' })`) create real files on disk, but don't appear inside `npx playwright show-report` — the report only displays screenshots explicitly registered via `testInfo.attach()`. Switched to capturing screenshots as in-memory buffers and attaching them directly to the test's report entry, so evidence of the upload (before and after saving) is visible directly in the HTML report rather than as separate loose files.
- Full-page screenshots (`fullPage: true`) on this site visually duplicate the sticky navbar partway down the image, since Playwright stitches together multiple scroll positions and the navbar re-renders at each one. Removing `fullPage: true` avoided the duplication but cut off the actual profile content below the fold instead. Kept `fullPage: true`, since the navbar duplication is cosmetic and doesn't obscure the evidence, whereas cropping the content would.
