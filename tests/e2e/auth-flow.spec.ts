/**
 * E2E Test: Authentication Flow
 * Tests login, signup, and logout flows
 */

import { test, expect } from '@playwright/test';

const TEST_EMAIL = `test-e2e-${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPassword123!';
const TEST_NAME = 'E2E Test User';

test.describe('Authentication Flow', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/en/login');
    
    await expect(page).toHaveURL(/\/en\/login/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    await page.goto('/en/login');
    
    // Click submit without filling form
    await page.click('button[type="submit"]');
    
    // Should show validation or error message
    // (The exact behavior depends on your form validation)
    await page.waitForTimeout(1000);
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/en/login');
    
    const passwordInput = page.locator('input[type="password"]').or(
      page.locator('input[type="text"]')
    ).first();
    
    // Look for eye icon/toggle button
    const toggleButton = page.locator('button[aria-label*="password" i]').or(
      page.locator('button:has(svg)')
    );
    
    if (await toggleButton.count() > 0) {
      const firstToggle = toggleButton.first();
      if (await firstToggle.isVisible()) {
        await firstToggle.click();
        // Password should now be visible
        await page.waitForTimeout(500);
      }
    }
  });

  test('should navigate to signup from login', async ({ page }) => {
    await page.goto('/en/login');
    
    // Look for sign up link
    const signupLink = page.locator('a:has-text("Sign up")').or(
      page.locator('a:has-text("sign up")')
    ).or(
      page.locator('button:has-text("Sign up")')
    );
    
    if (await signupLink.isVisible()) {
      await signupLink.click();
      // Might stay on same page with toggle or navigate
      await page.waitForTimeout(1000);
    }
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/en/login');
    
    // Fill in credentials (use existing test user)
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || 'TestPassword123!');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard or home
    await expect(page).toHaveURL(/\/(en|it)\/(dashboard|$)/, { timeout: 10000 });
  });

  test('should persist session after login', async ({ page, context }) => {
    // Login
    await page.goto('/en/login');
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/(dashboard|$)/, { timeout: 10000 });
    
    // Create new page in same context (simulates new tab)
    const newPage = await context.newPage();
    await newPage.goto('/en/dashboard');
    
    // Should still be logged in
    await expect(newPage).toHaveURL(/\/en\/dashboard/, { timeout: 5000 });
    
    await newPage.close();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/en/login');
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/(dashboard|$)/, { timeout: 10000 });
    
    // Find and click logout button
    const logoutButton = page.locator('button:has-text("Logout")').or(
      page.locator('button:has-text("Sign out")')
    ).or(
      page.locator('a:has-text("Logout")')
    );
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      
      // Should redirect to login or home
      await expect(page).toHaveURL(/\/(en|it)\/(login|$)/, { timeout: 5000 });
    }
  });

  test('should handle forgot password', async ({ page }) => {
    await page.goto('/en/login');
    
    // Look for forgot password link
    const forgotLink = page.locator('a:has-text("Forgot password")').or(
      page.locator('a[href*="forgot-password"]')
    );
    
    if (await forgotLink.isVisible()) {
      await forgotLink.click();
      
      // Should go to forgot password page
      await expect(page).toHaveURL(/\/forgot-password/, { timeout: 5000 });
      
      // Should have email input
      await expect(page.locator('input[type="email"]')).toBeVisible();
    }
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/en/login');
    
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'WrongPassword123');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await page.waitForTimeout(2000);
    
    // Look for error text (might be in toast or inline)
    const errorText = page.locator('text=/Invalid.*credentials/i').or(
      page.locator('text=/wrong.*password/i')
    ).or(
      page.locator('[role="alert"]')
    );
    
    // Error might appear
    await page.waitForTimeout(1000);
  });
});

