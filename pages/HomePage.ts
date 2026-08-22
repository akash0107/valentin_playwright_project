import { expect,Locator,Page } from "@playwright/test";

export class HomePage{

    readonly page:Page
    readonly loginBtn:Locator
    readonly signUpBtn:Locator

    constructor(page:Page){
        this.page=page
        this.loginBtn=page.getByTestId("header-login-button-desktop")
        this.signUpBtn=page.getByTestId("header-signup-button-desktop")
    }

    async clickLoginBtn(){
        await this.loginBtn.click()
    }

    async clickSignUpBtn(){
        await this.signUpBtn.click()
    }

    async checkLoginBtnVisibility(){
        await expect(this.loginBtn).toBeVisible()
    }

    async checkLoginBtnHidden(){
        await expect(this.loginBtn).toBeHidden()
    }
}