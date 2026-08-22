import { expect, test } from "@playwright/test";

let orderId: string

test.describe("api tests", () => {
    test.describe.configure({ mode: 'serial' })

    test('should get all products', async ({ request }) => {
        const response = await request.get("/products")
        const responseBody = await response.json()
        console.log(responseBody);

        expect(response.status()).toBe(200)
        expect(response.headers()['content-type']).toBe('application/json')
        expect(responseBody).toHaveProperty('success', true)
        expect(Array.isArray(responseBody.data)).toBe(true)
        expect(responseBody.data.length).toBeGreaterThan(0)
    })

    test('creating orders', async ({ request }) => {
        const payload = {
            "customerDetails": {
                "firstName": "John",
                "lastName": "Doe",
                "email": "john.doe@example.com",
                "address": "1234 Main St.",
                "city": "Rhyolite",
                "zipCode": "89003",
                "country": "United States"
            },
            "items": [
                {
                    "productId": "504",
                    "quantity": 1
                }
            ]
        }
        const response = await request.post("/orders", { data: payload })
        const responseBody = await response.json()
        orderId = responseBody.data.orderId
        console.log(responseBody);
        expect(responseBody).toHaveProperty('success', true)
        expect(responseBody.data.orderId).toBeTruthy()
    })

    test('fetch created order', async ({ request }) => {
        const apiPayload = {
            "orderId": orderId,
            "email": "john.doe@example.com"
        }
        const response = await request.post("/orders/lookup", { data: apiPayload })
        const responseBody = await response.json()
        console.log(responseBody);
        expect(response.status()).toBe(200)
        expect(responseBody).toHaveProperty("success", true)
        expect(responseBody.data.orderId).toBe(orderId)
    })
})
