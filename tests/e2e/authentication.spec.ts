import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";

test.describe('Authentication flow', () => {
    test.afterEach(async ({ page }) => {
        if (!page.isClosed()) {
            await page.close();
        }
    });

    test('reuses the stored session and starts already logged in', async ({ page }) => {
        const homePage = new HomePage(page);

        await page.goto('/');
        await homePage.checkLoginBtnHidden();
    });
});
