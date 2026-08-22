// Checkout.ts - Page Object Model Locators
import { expect,Locator,Page } from "@playwright/test";
export class CheckoutPage {
  readonly page: Page;

  // Contact Information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;

  // Shipping Address
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly zipCodeInput: Locator;

  // Payment Information
  readonly cardNameInput: Locator;
  readonly cardNumberInput: Locator;
  readonly expiryInput: Locator;
  readonly cvcInput: Locator;

  // Actions
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Contact Information
    this.firstNameInput = page.getByLabel('First Name');
    this.lastNameInput = page.getByLabel('Last Name');
    this.emailInput = page.getByLabel('Email');

    // Shipping Address
    this.addressInput = page.getByLabel('Address');
    this.cityInput = page.getByLabel('City');
    this.zipCodeInput = page.getByLabel('ZIP Code');
    

    // Payment Information
    this.cardNameInput = page.getByLabel('Name on Card');
    this.cardNumberInput = page.getByLabel('Card Number');
    this.expiryInput = page.getByLabel('Expiry (MM/YY)');
    this.cvcInput = page.getByLabel('CVC');

    // Actions
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
  }

  async fillContactInfo(firstName:string,lastName:string,email:string){
    await this.firstNameInput.fill(firstName)
    await this.lastNameInput.fill(lastName)
    await this.emailInput.fill(email)
  }

  async shippingAddressInfo(address:string,city:string,zipCode:string){
    await this.addressInput.fill(address)
    await this.cityInput.fill(city)
    await this.zipCodeInput.fill(zipCode)
    
  }

  async paymentInfo(cardName:string,cardNumber:string,expiry:string,cvc:string){
    await this.cardNameInput.fill(cardName)
    await this.cardNumberInput.fill(cardNumber)
    await this.expiryInput.fill(expiry)
    await this.cvcInput.fill(cvc)
  }

  async placeOrder(){
    await this.placeOrderButton.click()
  }
}