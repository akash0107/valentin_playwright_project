import { test, expect } from "@playwright/test";
import { Products } from "../../pages/Products";
import { Cart } from "../../pages/Cart";

test.use({ storageState: { cookies: [], origins: [] } });

test.afterEach(async ({ page }) => {
    if (!page.isClosed()) {
        await page.close()
    }
})

test('Item is added to the cart', async ({ page }) => {
    let products = new Products(page)
    let cart = new Cart(page)
    let productName = ""
    let productPriceNumber = 0
    let cartItemName = ""
    let cartPriceNumber = 0
    let orderSummaryNumber = 0

    await test.step('Navigate to products page', async () => {
        await page.goto("/products")
        let productResult = await products.productDetails()
        productName = productResult.productName
        productPriceNumber = productResult.productPriceNumber
    })

    await test.step('Add product to cart', async () => {
        await page.getByTestId("product-card-add-to-cart-button-504").click()
        await page.getByTestId("header-cart-button").click()
    })

    await test.step('Verify cart item price matches order summary', async () => {
        let cartResult = await cart.cartDetails()
        cartItemName = cartResult.cartItemName
        cartPriceNumber = cartResult.cartPriceNumber
        orderSummaryNumber = cartResult.orderSummaryNumber
        expect(cartItemName).toEqual(productName)
        expect(cartPriceNumber).toEqual(productPriceNumber)
        expect(cartPriceNumber).toEqual(orderSummaryNumber)
    })
})
