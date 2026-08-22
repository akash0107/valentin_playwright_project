import { Page, Locator, expect } from '@playwright/test';

export class ConfirmAccountPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly confirmationCodeInput: Locator;
  readonly confirmAccountButton: Locator;
  readonly resendCodeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Confirm Your Account' });
    this.confirmationCodeInput = page.locator("//input[@name='code']");
    this.confirmAccountButton = page.getByRole('button', { name: 'Confirm Account' });
    this.resendCodeButton = page.getByRole('button', { name: 'Resend Code' });
  }

  async enterConfirmationCode(code: string) {
    await this.confirmationCodeInput.fill(code);
  }

  async clickConfirm() {
    await this.confirmAccountButton.click();
  }

  async clickResendCode() {
    await this.resendCodeButton.click();
  }

  async verifyPageLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.confirmationCodeInput).toBeVisible();
  }
}