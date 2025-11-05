/**
 * E2E Test: Guest User Journey
 * Tests browsing, reading posts, and attempting to comment (should redirect to login)
 */

import { test, expect } from '@playwright/test';

test.describe('Guest User Journey', () => {
  test('should browse blog and read a post', async ({ page }) => {
    // Go to home page
    await page.goto('/en');
    
    // Check page loaded
    await expect(page).toHaveTitle(/StackMoneyUp/);
    
    // Navigate to blog
    await page.click('a[href="/en/blog"]');
    await expect(page).toHaveURL(/\/en\/blog/);
    
    // Wait for blog posts to load
    await page.waitForSelector('article', { timeout: 10000 });
    
    // Click on first blog post
    const firstPost = page.locator('article').first();
    const postTitle = await firstPost.locator('h2').textContent();
    await firstPost.click();
    
    // Verify we're on post page
    await expect(page).toHaveURL(/\/en\/blog\/.+/);
    
    // Verify post content loaded
    if (postTitle) {
      await expect(page.locator('h1')).toContainText(postTitle.trim());
    }
  });

  test('should see language switcher', async ({ page }) => {
    await page.goto('/en');
    
    // Look for language switcher
    const langSwitcher = page.locator('button:has-text("EN")').or(page.locator('a[href^="/it"]'));
    await expect(langSwitcher.first()).toBeVisible();
  });

  test('should switch between languages', async ({ page }) => {
    // Start on English
    await page.goto('/en');
    await expect(page).toHaveURL(/\/en/);
    
    // Switch to Italian
    await page.click('a[href^="/it"]');
    await expect(page).toHaveURL(/\/it/);
    
    // Switch back to English
    await page.click('a[href^="/en"]');
    await expect(page).toHaveURL(/\/en/);
  });

  test('should redirect to login when trying to comment', async ({ page }) => {
    // Navigate to a blog post
    await page.goto('/en/blog');
    
    // Wait for posts and click first one
    await page.waitForSelector('article', { timeout: 10000 });
    await page.locator('article').first().click();
    
    // Scroll to comments section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Try to add comment (should redirect to login)
    const commentButton = page.locator('button:has-text("Add Comment")').or(
      page.locator('button:has-text("Aggiungi Commento")')
    ).or(
      page.locator('textarea[placeholder*="comment" i]')
    );
    
    if (await commentButton.isVisible()) {
      await commentButton.click();
      
      // Should redirect to login
      await expect(page).toHaveURL(/\/en\/login/, { timeout: 5000 });
    }
  });

  test('should see cookie consent banner', async ({ page }) => {
    // Clear cookies first
    await page.context().clearCookies();
    
    // Visit site
    await page.goto('/en');
    
    // Cookie banner should appear
    const cookieBanner = page.locator('text=We value your privacy').or(
      page.locator('text=Rispettiamo la tua privacy')
    );
    
    await expect(cookieBanner).toBeVisible({ timeout: 5000 });
    
    // Accept cookies
    await page.click('button:has-text("Accept All")');
    
    // Banner should disappear
    await expect(cookieBanner).not.toBeVisible();
  });

  test('should navigate through pages', async ({ page }) => {
    await page.goto('/en');
    
    // Check all main navigation links
    const links = [
      { href: '/en/blog', text: 'Blog' },
      { href: '/en/about', text: 'About' },
      { href: '/en/contact', text: 'Contact' },
    ];
    
    for (const link of links) {
      await page.goto('/en');
      await page.click(`a[href="${link.href}"]`);
      await expect(page).toHaveURL(new RegExp(link.href));
    }
  });

  test('should see footer links', async ({ page }) => {
    await page.goto('/en');
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check footer links exist
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('a[href="/en/privacy"]')).toBeVisible();
    await expect(page.locator('a[href="/en/terms"]')).toBeVisible();
  });
});

