# E2E Tests (Playwright)

End-to-end tests simulate real user interactions with the application.

## Setup

1. **Install Playwright Browsers**

```bash
npx playwright install
```

2. **Environment Variables**

Tests use credentials from environment:

```env
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=TestPassword123!
```

3. **Dev Server**

Playwright will automatically start `npm run dev` before tests.

## Running Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run with UI (interactive)
npm run test:e2e:ui

# Run with browser visible
npm run test:e2e:headed

# Debug mode (step through)
npm run test:e2e:debug

# Run specific test file
npx playwright test guest-journey

# Run specific browser
npx playwright test --project=chromium
```

## Test Files

- **`guest-journey.spec.ts`** - Unauthenticated user browsing
- **`auth-flow.spec.ts`** - Login, signup, logout flows
- **`create-post.spec.ts`** - Post creation workflow
- **`admin-flow.spec.ts`** - Admin dashboard features

## Test Reports

After running tests:

```bash
# View HTML report
npx playwright show-report
```

Reports include:
- Screenshots on failure
- Videos of failed tests
- Step-by-step trace

## Writing New Tests

```typescript
import { test, expect } from '@playwright/test';

test('should do something', async ({ page }) => {
  // Navigate
  await page.goto('/en/dashboard');
  
  // Interact
  await page.click('button:has-text("Submit")');
  
  // Assert
  await expect(page).toHaveURL(/\/success/);
});
```

## Configuration

See `playwright.config.ts` for:
- Base URL
- Timeout settings
- Screenshot/video capture
- Browser configurations

## Debugging

### Interactive Mode
```bash
npm run test:e2e:ui
```

### Debug Single Test
```bash
npx playwright test auth-flow --debug
```

### Inspect Element
```typescript
await page.pause(); // Pauses test, opens inspector
```

### View Trace
```bash
npx playwright show-trace trace.zip
```

## CI/CD

Tests run in CI with:
- Headless mode
- 2 retries on failure
- Artifacts saved (screenshots, videos, traces)

## Best Practices

1. **Use semantic selectors** - `page.locator('button:has-text("Submit")')`
2. **Wait for elements** - `await expect(element).toBeVisible()`
3. **Avoid hard-coded waits** - Use `waitForSelector` instead of `waitForTimeout`
4. **Keep tests independent** - Each test should work alone
5. **Clean up test data** - Login/logout properly
6. **Use test IDs** for critical elements - `data-testid="submit-button"`

## Common Issues

### Test Times Out
- Increase timeout: `test.setTimeout(60000)`
- Check if element selector is correct
- Verify dev server is running

### Element Not Found
- Use `await page.waitForSelector('selector')`
- Check if element is in shadow DOM
- Try more specific selector

### Flaky Tests
- Add proper waits for dynamic content
- Use `expect(element).toBeVisible()` instead of checking count
- Avoid race conditions with proper async/await

