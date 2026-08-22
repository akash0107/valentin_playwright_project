import { expect,Locator,Page } from "@playwright/test";

export class Orders{
    readonly page:Page
    readonly orderIdLocator:Locator
    readonly emailLocator:Locator
    readonly trackOrder:Locator
    readonly orderIdInput:Locator
    readonly emailInput:Locator
    readonly trackOrderButton:Locator

    constructor(page:Page){
        this.page=page
        this.orderIdLocator=page.locator("p.text-2xl")
        this.emailLocator=page.locator("p.text-sm strong")
        this.trackOrder=page.getByText("Track Your Order")
        this.orderIdInput=page.getByLabel("Order ID")
        this.emailInput=page.getByLabel("Email Address")
        this.trackOrderButton=page.getByRole("button", { name: "Track Order" })
    }

    async retrieveOrderNumber(){
        let ordernum = await this.orderIdLocator.textContent()
        return ordernum;
    }

    async retrieveEmailId(){
        let emailId= await this.emailLocator.textContent()
        return emailId
    }

    async clickOrderTrackButton(orderId: string, email: string){
        await this.trackOrder.click()
        await this.orderIdInput.fill(orderId)
        await this.emailInput.fill(email)
        await this.trackOrderButton.click()
    }

    async verifyTrackedProduct(productName: string){
        await expect(this.page.getByText(productName, { exact: true })).toBeVisible()
    }
}