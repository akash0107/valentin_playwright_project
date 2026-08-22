import { expect,Locator,Page } from "@playwright/test";

export class Products{

    readonly page:Page
    readonly firstProductDiv:Locator
    readonly firstProductPrice:Locator
    readonly firstProductName:Locator
    readonly productToCart:Locator
    readonly cartIcon:Locator
    constructor(page:Page){
        this.page = page
        this.firstProductDiv = page.locator(".p-6").first()
        this.firstProductName = this.firstProductDiv.getByRole("heading")
        this.firstProductPrice = this.firstProductDiv.locator(".font-bold")
        this.productToCart = page.getByTestId("product-card-add-to-cart-button-504")
        this.cartIcon = page.getByTestId("header-cart-button")
    }

    async productDetails(){
        let firstProductDisplayName = (await this.firstProductName.textContent())?.trim() ?? ""
        let firstProductPriceDisplayNumber = await this.firstProductPrice.textContent()
        let firstProductPriceRaw = Number(firstProductPriceDisplayNumber?.substring(1))
        console.log(`Product name dislay in products page ${firstProductDisplayName}`);
        console.log(`Product price display in products page ${firstProductPriceRaw}`);

        return {
            productName: firstProductDisplayName,
            productPriceNumber: firstProductPriceRaw,
        }
    }

    async addProductToCart(){
        await this.productToCart.click()
        await this.cartIcon.click()

    }
}