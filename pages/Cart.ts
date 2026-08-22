import { expect, Locator, Page } from "@playwright/test";

export class Cart {

    readonly page: Page
    readonly cartItem: Locator
    readonly cartItemName: Locator
    readonly cartItemPrice: Locator
    readonly orderSummaryTotal: Locator
    readonly proceedToCheckOut: Locator

    constructor(page: Page) {
        this.page = page
        this.cartItem = page.getByTestId("cart-item")
        this.cartItemName = this.cartItem.getByRole("heading")
        this.cartItemPrice = this.cartItem.locator("p.text-coffee-900")
        this.orderSummaryTotal = page.locator(".border-coffee-200").locator("span.font-semibold").nth(1)
        this.proceedToCheckOut = page.getByTestId("proceed-to-checkout")
    }

    async cartDetails() {
        let cartPriceString = await this.cartItemPrice.textContent()
        let cartPriceNumber = Number(cartPriceString?.substring(1))
        console.log(`cart summary total ${cartPriceNumber}`);

        let orderSummaryString = await this.orderSummaryTotal.textContent()
        let orderSummaryNumber = Number(orderSummaryString?.substring(1))
        console.log(`order summary total ${orderSummaryNumber}`);
        let cartItemName = (await this.cartItemName.textContent())?.trim() ?? ""
        await this.proceedToCheckOut.click()
        return { cartItemName, cartPriceNumber, orderSummaryNumber }
    }
}
