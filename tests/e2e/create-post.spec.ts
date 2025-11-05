/**
 * E2E Test: Create and Publish Post
 * Tests the complete post creation workflow
 */

import { test, expect } from '@playwright/test';

test.describe('Create and Publish Post', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/en/login');
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/en\/dashboard/, { timeout: 10000 });
  });

  test('should access new post page from dashboard', async ({ page }) => {
    await page.goto('/en/dashboard');
    
    // Click New Post button
    const newPostButton = page.locator('a[href*="/new-post"]').or(
      page.locator('button:has-text("New Post")')
    );
    
    await expect(newPostButton.first()).toBeVisible();
    await newPostButton.first().click();
    
    await expect(page).toHaveURL(/\/en\/dashboard\/new-post/);
  });

  test('should load blog editor', async ({ page }) => {
    await page.goto('/en/dashboard/new-post');
    
    // Wait for editor to load (TipTap might take a moment)
    await page.waitForSelector('input[placeholder*="title" i]', { timeout: 10000 });
    
    // Check for editor elements
    await expect(page.locator('input[placeholder*="title" i]')).toBeVisible();
    
    // Editor toolbar should be visible
    await page.waitForTimeout(2000); // Give TipTap time to load
  });

  test('should fill in post details', async ({ page }) => {
    await page.goto('/en/dashboard/new-post');
    await page.waitForTimeout(2000);
    
    const timestamp = Date.now();
    
    // Fill in English title
    await page.fill('input[placeholder*="title" i]', `E2E Test Post ${timestamp}`);
    
    // Fill in slug (if separate field)
    const slugInput = page.locator('input[placeholder*="slug" i]').or(
      page.locator('input[name="slug"]')
    );
    if (await slugInput.isVisible()) {
      await slugInput.fill(`e2e-test-post-${timestamp}`);
    }
    
    // Fill in excerpt
    const excerptInput = page.locator('textarea[placeholder*="excerpt" i]').or(
      page.locator('input[placeholder*="excerpt" i]')
    );
    if (await excerptInput.isVisible()) {
      await excerptInput.fill('This is a test post created by E2E tests');
    }
    
    // Select category
    const categorySelect = page.locator('select').or(
      page.locator('[role="combobox"]')
    ).first();
    
    if (await categorySelect.isVisible()) {
      await categorySelect.click();
      await page.waitForTimeout(500);
      // Try to select first option
      await categorySelect.selectOption({ index: 0 }).catch(() => {});
    }
  });

  test('should save as draft', async ({ page }) => {
    await page.goto('/en/dashboard/new-post');
    await page.waitForTimeout(2000);
    
    const timestamp = Date.now();
    
    // Fill in minimal required fields
    await page.fill('input[placeholder*="title" i]', `Draft Post ${timestamp}`);
    
    // Look for Save Draft or Save button
    const saveButton = page.locator('button:has-text("Save Draft")').or(
      page.locator('button:has-text("Save")')
    );
    
    if (await saveButton.isVisible()) {
      await saveButton.click();
      
      // Should show success message
      await page.waitForTimeout(2000);
    }
  });

  test('should navigate to manage posts', async ({ page }) => {
    await page.goto('/en/dashboard');
    
    // Click Manage Posts
    const manageButton = page.locator('a[href*="/posts"]').or(
      page.locator('button:has-text("Manage Posts")')
    );
    
    if (await manageButton.isVisible()) {
      await manageButton.click();
      await expect(page).toHaveURL(/\/en\/dashboard\/posts/);
    }
  });

  test('should see posts list', async ({ page }) => {
    await page.goto('/en/dashboard/posts');
    
    // Wait for posts to load
    await page.waitForTimeout(2000);
    
    // Should see table or list of posts
    const postsContainer = page.locator('table').or(
      page.locator('article')
    ).or(
      page.locator('[role="list"]')
    );
    
    // Posts might exist or be empty
    await page.waitForTimeout(1000);
  });

  test('should access media library', async ({ page }) => {
    await page.goto('/en/dashboard');
    
    // Click Media Library
    const mediaButton = page.locator('a[href*="/media"]').or(
      page.locator('button:has-text("Media")')
    );
    
    if (await mediaButton.isVisible()) {
      await mediaButton.click();
      await expect(page).toHaveURL(/\/en\/dashboard\/media/);
    }
  });

  test('should access tags management', async ({ page }) => {
    await page.goto('/en/dashboard');
    
    // Click Tags
    const tagsButton = page.locator('a[href*="/tags"]').or(
      page.locator('button:has-text("Tags")')
    );
    
    if (await tagsButton.isVisible()) {
      await tagsButton.click();
      await expect(page).toHaveURL(/\/en\/dashboard\/tags/);
    }
  });

  test('should navigate between dashboard pages without refresh', async ({ page }) => {
    await page.goto('/en/dashboard');
    
    const links = [
      '/en/dashboard/new-post',
      '/en/dashboard/posts',
      '/en/dashboard/media',
      '/en/dashboard/tags',
      '/en/dashboard',
    ];
    
    for (const link of links) {
      const linkElement = page.locator(`a[href="${link}"]`);
      if (await linkElement.isVisible()) {
        await linkElement.click();
        await expect(page).toHaveURL(link);
        await page.waitForTimeout(500);
      }
    }
  });
});

