# Valentino's Magic Beans — Playwright Test Suite

End-to-end and API test automation for [Valentino's Magic Beans](https://valentinos-magic-beans.click) coffee shop, built with Playwright and TypeScript.

---

## Project Structure

```
├── tests/
│   ├── e2e/
│   │   ├── cart.spec.ts           # Add to cart & price verification
│   │   ├── checkout.spec.ts       # Full guest checkout workflow
│   │   └── authentication.spec.ts # Session-based login verification
│   ├── api/
│   │   └── products.spec.ts       # API tests: products + order creation + order lookup
│   └── auth.setup.ts              # Creates & saves authenticated session before E2E tests
├── pages/                         # Page Object Models (POM)
│   ├── Products.ts
│   ├── Cart.ts
│   ├── CheckOut.ts
│   ├── Orders.ts
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── SignUpPage.ts
│   └── ConfirmAccountPage.ts
├── utils/
│   ├── TempMail.ts                # Temporary email utility using mail.tm API
│   └── authStorage.ts
├── playwright.config.ts
├── Jenkinsfile
└── .github/workflows/playwright.yml
```

---

## Prerequisites

- Node.js 18 or higher
- npm

---

## Installation

```bash
# Clone the repository
git clone git@github.com:akash0107/valentin_playwright_project.git
cd valentin_playwright_project

# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps
```

---

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Run all tests (E2E + API) |
| `npm run test:e2e` | Run E2E tests only (chromium) |
| `npm run test:api` | Run API tests only |

---

## Viewing Reports

### Playwright HTML Report
```bash
npx playwright show-report
```

### Allure Report
```bash
# Generate report from results
npm run allure:generate

# Open the generated report
npm run allure:open

# Or generate and serve in one command
npm run allure:serve
```

---

## CI/CD

### GitHub Actions
Tests run automatically on every push or pull request to `main` / `master`.

To trigger manually:
1. Go to the **Actions** tab on GitHub
2. Select **Playwright Tests**
3. Click **Run workflow**

After a run, download these artifacts from the workflow summary:
- `allure-report` — Full Allure report
- `playwright-report` — Playwright HTML report
- `failed-test-results` — Traces & screenshots (only on failure)

### Jenkins
A `Jenkinsfile` is included at the root. To set up:
1. Create a new **Pipeline** job in Jenkins
2. Set **SCM** to Git with this repository URL
3. Set **Script Path** to `Jenkinsfile`
4. Install the **HTML Publisher** plugin for report viewing

---

## Test Coverage

| Area | Tests |
|---|---|
| Cart | Add product, verify price matches order summary |
| Checkout | Full guest checkout: cart → shipping → payment → order confirmation |
| Authentication | Session reuse via stored auth state |
| API — Products | GET all products, status code, response shape |
| API — Orders | POST create order, POST lookup order by ID + email |
