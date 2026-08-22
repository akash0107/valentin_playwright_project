import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

// No login here on purpose: the 'chromium' project (playwright.config.ts)
// already injects the session saved by tests/auth.setup.ts via storageState,
// so every test — this one and any future ones — starts already logged in.
// The UI login only happens once, inside auth.setup.ts.
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
