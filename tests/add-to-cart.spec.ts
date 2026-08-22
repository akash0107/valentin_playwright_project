import { test,expect } from "@playwright/test";
import { Products } from "../pages/Products";
import { Cart } from "../pages/Cart";
import { CheckoutPage } from "../pages/CheckOut";
import { Orders } from "../pages/Orders";

// This spec exercises guest checkout (it fills in its own name/email below),
// so it opts out of the authenticated session the 'chromium' project injects
// by default (see playwright.config.ts + tests/auth.setup.ts). Staying logged
// in here would change the checkout form's behavior, e.g. the name fields
// come back pre-filled and disabled for a logged-in user.
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


test('e2e checkout workflow', async ({ page }) => {
    let products = new Products(page)
    let cart = new Cart(page)
    let checkOut = new CheckoutPage(page)
    let orders = new Orders(page)
    let productName = ""
    let productPriceNumber = 0
    let cartItemName = ""
    let cartPriceNumber = 0
    let orderSummaryNumber = 0
    let orderId: string | null = null
    let emailId: string | null = null

    await test.step('Navigate to products page and add product to cart', async () => {
        await page.goto("/products")
        let productResult = await products.productDetails()
        productName = productResult.productName
        productPriceNumber = productResult.productPriceNumber
        await products.addProductToCart()
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

    await test.step('Fill checkout contact and shipping information', async () => {
        await checkOut.fillContactInfo("akash", "debnath", "akash@email.com")
        await checkOut.shippingAddressInfo("121/Harrisson street", "New York", "122450")
    })

    await test.step('Fill payment details and place order', async () => {
        await checkOut.paymentInfo("Akash Debnath", "1234 5678 9012 3456", "11/26", "606")
        await checkOut.placeOrder()
    })

    await test.step('Retrieve and verify order confirmation details', async () => {
        orderId = await orders.retrieveOrderNumber()
        emailId = await orders.retrieveEmailId()
        console.log(`Fetched orderId and email id is ${orderId} and ${emailId}`)
        expect(orderId).toBeTruthy()
        expect(emailId).toBeTruthy()
        await orders.clickOrderTrackButton(orderId!, emailId!)
        await orders.verifyTrackedProduct(cartItemName)
    })
})
