export class TempMail {

    private baseUrl = "https://api.mail.tm"
    private email = ""
    private password = ""
    private token = ""

    private randomString(length: number): string {
        return Math.random().toString(36).substring(2, 2 + length)
    }

    async createAccount(): Promise<{ email: string; password: string }> {
        const domainsRes = await fetch(`${this.baseUrl}/domains`)
        const domainsData = await domainsRes.json()
        const domain = domainsData["hydra:member"][0].domain

        this.email = `${this.randomString(8)}@${domain}`
        this.password = this.randomString(12)

        await fetch(`${this.baseUrl}/accounts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address: this.email, password: this.password })
        })

        return { email: this.email, password: this.password }
    }

    async getToken(): Promise<void> {
        const res = await fetch(`${this.baseUrl}/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address: this.email, password: this.password })
        })
        const data = await res.json()
        this.token = data.token
    }

    // Polls the inbox and scans every message present (not just the first
    // one to arrive) for a 6-digit code. Grabbing messages[0] unconditionally
    // is fragile: if a non-OTP email (e.g. a welcome message) arrives before
    // or alongside the real confirmation email, it can be mistaken for the
    // OTP email, silently used, and end up submitting a wrong code, this
    // fails without any visible error since the confirm-account page doesn't
    // surface the failure. So keep polling until a message actually yields
    // a 6-digit code instead of trusting whichever message showed up first.
    async fetchOtp(retries = 10, delayMs = 3000): Promise<string> {
        for (let i = 0; i < retries; i++) {
            const res = await fetch(`${this.baseUrl}/messages`, {
                headers: { "Authorization": `Bearer ${this.token}` }
            })
            const data = await res.json()
            const messages = data["hydra:member"]

            for (const message of messages) {
                const fullMsgRes = await fetch(`${this.baseUrl}/messages/${message.id}`, {
                    headers: { "Authorization": `Bearer ${this.token}` }
                })
                const fullMessage = await fullMsgRes.json()
                const html = Array.isArray(fullMessage.html) ? fullMessage.html.join(" ") : (fullMessage.html ?? "")
                const text = typeof fullMessage.text === "string" ? fullMessage.text : html
                const match = text.match(/\b\d{6}\b/)
                if (match) return match[0]
            }

            await new Promise(resolve => setTimeout(resolve, delayMs))
        }
        throw new Error("6-digit OTP not found in any inbox message within the timeout period")
    }

    getEmail(): string {
        return this.email
    }
}
