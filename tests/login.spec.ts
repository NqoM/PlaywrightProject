import {expect, test} from '../src/fixtures/CustomFixtures';
import {validUsers, invalidUsers} from '../src/data/Testdata';


test('Positive login - Admin', async ({ loginPage, homePage, page }) => {
    await loginPage.basePageGoToUrl('/');
    await loginPage.navigateToLoginPage();
    await loginPage.userLogin(validUsers.admin.username, validUsers.admin.password);
    //soft assertion
    //await expect.soft(page).toHaveURL(/dashboard123/); //failing the test on purpose so we can test soft assertions
    await expect.soft(page).toHaveURL(/dashboard/); // Restore path to make test pass.

    await homePage.verifyHomePageIsDisplayed();
});

