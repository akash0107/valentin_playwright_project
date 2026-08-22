import { test as setup } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SignupPage } from '../pages/SignUpPage';
import { ConfirmAccountPage } from '../pages/ConfirmAccountPage';
import { LoginPage } from '../pages/LoginPage';
import { TempMail } from '../utils/TempMail';
import { hasStoredCredentials, readCredentials, saveCredentials, STORAGE_STATE_PATH } from '../utils/authStorage';

const SIGNUP_PASSWORD = 'Test@123';

setup.afterEach(async ({ page }) => {
  if (!page.isClosed()) {
    await page.close();
  }
});

// Runs once before the rest of the suite (see the 'setup' project in playwright.config.ts).
// First run: signs up a brand new account and stores its credentials.
// Every later run: reuses the stored credentials instead of signing up again.
// Either way, it finishes by logging in and saving the authenticated session
// to playwright/.auth/login-data.json for the other tests to reuse.
setup('authenticate', async ({ page }) => {
  let email: string;
  let password: string;

  if (hasStoredCredentials()) {
    ({ email, password } = readCredentials());
    console.log(`Reusing existing account: ${email}`);
  } else {
    console.log('No stored credentials found. Signing up a new account...');

    const homePage = new HomePage(page);
    const signUpPage = new SignupPage(page);
    const confirmPage = new ConfirmAccountPage(page);
    const tempMail = new TempMail();

    password = SIGNUP_PASSWORD;

    await page.goto('/');
    await homePage.clickSignUpBtn();
    ({ email } = await tempMail.createAccount());
    await tempMail.getToken();

    await signUpPage.fillSignupForm({
      firstName: 'Max',
      lastName: 'Robinson',
      email,
      password,
    });
    await signUpPage.submit();

    const otp = await tempMail.fetchOtp();
    console.log(`Fetched OTP: ${otp}`);

    await confirmPage.verifyPageLoaded();
    await confirmPage.enterConfirmationCode(otp);
    await confirmPage.clickConfirm();

    await homePage.checkLoginBtnVisibility();

    // Credentials are deliberately NOT saved yet. The confirm-account step
    // above doesn't surface API failures in the UI (a wrong/late OTP fails
    // silently there), so the only reliable proof the account is actually
    // usable is a real login succeeding below. Persisting here would risk
    // caching a permanently-unconfirmed account for every future run.
  }

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.verifyPageLoaded();
  await loginPage.login(email, password);

  const homePage = new HomePage(page);
  try {
    await homePage.checkLoginBtnHidden();
  } catch (error) {
    throw new Error(
      'Login failed after sign-up. The account was most likely never confirmed: ' +
      'the confirm-account step does not surface API failures in the UI, so a ' +
      'wrong or stale OTP fails silently there and only shows up here as a ' +
      `rejected login. Original error: ${(error as Error).message}`
    );
  }

  saveCredentials({ email, password });
  await page.context().storageState({ path: STORAGE_STATE_PATH });
});
