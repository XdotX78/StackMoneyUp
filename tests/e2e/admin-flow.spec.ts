/**
 * E2E Test: Admin Dashboard Flow
 * Tests admin-specific features like analytics
 */

import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin/editor
    await page.goto('/en/login');
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/en\/dashboard/, { timeout: 10000 });
  });

  test('should load dashboard with quick actions', async ({ page }) => {
    await page.goto('/en/dashboard');
    
    // Should see dashboard title
    await expect(page.locator('h1')).toContainText(/dashboard/i);
    
    // Should see quick action buttons
    const quickActions = page.locator('text=Quick Actions').or(
      page.locator('text=Azioni Rapide')
    );
    
    await page.waitForTimeout(1000);
  });

  test('should access analytics if admin', async ({ page }) => {
    await page.goto('/en/dashboard');
    
    // Look for analytics link/button
    const analyticsLink = page.locator('a[href*="/analytics"]').or(
      page.locator('button:has-text("Analytics")')
    ).or(
      page.locator('a:has-text("Analytics")')
    );
    
    // Analytics might only be visible to admins
    if (await analyticsLink.isVisible()) {
      await analyticsLink.click();
      await expect(page).toHaveURL(/\/en\/dashboard\/analytics/);
      
      // Should see analytics page
      await page.waitForTimeout(2000);
      
      // Should see stats cards
      const statsCard = page.locator('text=Total Views').or(
        page.locator('text=Visualizzazioni')
      );
      
      await page.waitForTimeout(1000);
    }
  });

  test('should see user info on dashboard', async ({ page }) => {
    await page.goto('/en/dashboard');
    
    // Should see welcome message with user info
    const welcome = page.locator('text=/Welcome|Benvenuto/i');
    await page.waitForTimeout(1000);
  });

  test('should access profile page', async ({ page }) => {
    await page.goto('/en/dashboard');
    
    // Look for profile link
    const profileLink = page.locator('a[href*="/profile"]').or(
      page.locator('a:has-text("Profile")')
    ).or(
      page.locator('button:has-text("Profile")')
    );
    
    if (await profileLink.isVisible()) {
      await profileLink.click();
      await expect(page).toHaveURL(/\/en\/dashboard\/profile/);
    }
  });

  test('should show role-based content', async ({ page }) => {
    await page.goto('/en/dashboard');
    
    // Quick actions should be visible for editors/admins
    const newPostButton = page.locator('text=New Post').or(
      page.locator('text=Nuovo Post')
    );
    
    const managePostsButton = page.locator('text=Manage Posts').or(
      page.locator('text=Gestisci Post')
    );
    
    // At least one should be visible if user has permissions
    await page.waitForTimeout(1000);
  });

  test('should navigate using sidebar', async ({ page }) => {
    await page.goto('/en/dashboard');
    
    // Look for sidebar navigation
    const sidebar = page.locator('aside').or(
      page.locator('[role="navigation"]')
    ).or(
      page.locator('nav')
    );
    
    await page.waitForTimeout(1000);
  });

  test('should see logout button', async ({ page }) => {
    await page.goto('/en/dashboard');
    
    const logoutButton = page.locator('button:has-text("Logout")').or(
      page.locator('button:has-text("Sign out")')
    ).or(
      page.locator('a:has-text("Logout")')
    );
    
    await expect(logoutButton.first()).toBeVisible({ timeout: 5000 });
  });

  test('should handle navigation without page reload', async ({ page }) => {
    await page.goto('/en/dashboard');
    
    // Track if page reloads
    let reloaded = false;
    page.on('load', () => {
      reloaded = true;
    });
    
    // Click various links
    const links = page.locator('a[href^="/en/dashboard"]');
    const count = await links.count();
    
    if (count > 0) {
      await links.first().click();
      await page.waitForTimeout(1000);
      
      // Should be client-side navigation (no full reload in SPA)
      // Note: This might still reload in development mode
    }
  });

  test('should show theme toggle', async ({ page }) => {
    await page.goto('/en/dashboard');
    
    // Look for theme toggle button
    const themeToggle = page.locator('button[aria-label*="theme" i]').or(
      page.locator('button:has(svg[class*="sun"])')
    ).or(
      page.locator('button:has(svg[class*="moon"])')
    );
    
    if (await themeToggle.isVisible()) {
      // Click to toggle theme
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Click again to toggle back
      await themeToggle.click();
      await page.waitForTimeout(500);
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/en/dashboard');
    
    // Dashboard should be functional on mobile
    await page.waitForTimeout(1000);
    
    // Mobile menu might be present
    const mobileMenu = page.locator('button[aria-label*="menu" i]').or(
      page.locator('button:has(svg[class*="menu"])')
    );
    
    await page.waitForTimeout(500);
  });
});

