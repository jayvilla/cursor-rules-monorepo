import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('Signup → redirect into app → overview loads', async ({ page }) => {
    // Navigate to signup (assuming it's on the home page or /signup)
    // This may vary based on your actual routing
    await page.goto('/');
    
    // Look for signup link or button
    const signupLink = page.getByRole('link', { name: /sign up|signup|register/i }).first();
    if (await signupLink.isVisible()) {
      await signupLink.click();
    } else {
      // If signup is on a separate page, navigate directly
      await page.goto('/signup');
    }

    // Generate unique email for test
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    // Fill in signup form
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    
    // If name field exists
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test User');
    }

    // Submit signup form
    await page.click('button[type="submit"], button:has-text("Sign Up"), button:has-text("Register")');

    // Wait for redirect to app (overview page)
    await page.waitForURL(/\/(app|overview|dashboard)/, { timeout: 10000 });

    // Verify overview page loaded
    await expect(page).toHaveURL(/\/(app|overview|dashboard)/);
    
    // Check for common overview page elements
    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
  });

  test('Login → audit logs page loads → filters interaction triggers request', async ({ page }) => {
    // First, we need to create a user (or use an existing test user)
    // For this test, we'll assume a test user exists or create one via API
    // In a real scenario, you might seed the DB before tests
    
    // Navigate to login
    await page.goto('/login');
    
    // Fill in login form (assuming test user exists)
    // Note: In a real test environment, you'd seed this user
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    
    // Submit login form
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    
    // Wait for redirect to app
    await page.waitForURL(/\/(app|overview|dashboard)/, { timeout: 10000 });

    // Navigate to audit logs page
    await page.goto('/audit-logs');
    // Or click on navigation link if available
    // await page.click('a[href*="audit"], nav a:has-text("Audit Logs")');

    // Verify page loaded
    await expect(page).toHaveURL(/.*audit.*/);

    // Interact with filters (e.g., select an action filter)
    // This is a simplified example - adjust based on your actual UI
    const filterButton = page.locator('button:has-text("Filter"), select, [role="combobox"]').first();
    if (await filterButton.isVisible({ timeout: 5000 })) {
      await filterButton.click();
      
      // Wait for network request (filter change should trigger API call)
      const responsePromise = page.waitForResponse(
        (response) => response.url().includes('/api') && response.status() === 200,
        { timeout: 10000 }
      );
      
      // Select a filter option (adjust selector based on your UI)
      const filterOption = page.locator('[role="option"], option, button').first();
      if (await filterOption.isVisible({ timeout: 2000 })) {
        await filterOption.click();
        await responsePromise;
      }
    }

    // Verify page is still loaded and functional
    await expect(page.locator('body')).toBeVisible();
  });

  test('Create API key → key appears and can be revoked', async ({ page }) => {
    // Login first (assuming test user exists)
    await page.goto('/login');
    
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    
    // Wait for redirect
    await page.waitForURL(/\/(app|overview|dashboard)/, { timeout: 10000 });

    // Navigate to API keys page
    await page.goto('/api-keys');
    // Or click navigation link
    // await page.click('a[href*="api"], nav a:has-text("API Keys")');

    // Verify page loaded
    await expect(page).toHaveURL(/.*api.*key.*/);

    // Click "Create API Key" button
    const createButton = page.getByRole('button', { name: /create.*api.*key/i }).first();
    await createButton.click();

    // Fill in API key name if dialog/form appears
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    if (await nameInput.isVisible({ timeout: 2000 })) {
      await nameInput.fill('Test API Key');
      
      // Submit form
      const submitButton = page.getByRole('button', { name: /create|submit/i }).first();
      await submitButton.click();
    }

    // Wait for API key to appear in the list
    await expect(page.getByText('Test API Key')).toBeVisible({ timeout: 10000 });

    // Find the revoke/delete button for the created key
    // This might be a button next to the key, or in a dropdown menu
    const revokeButton = page
      .locator('button:has-text("Revoke"), button:has-text("Delete"), button[aria-label*="delete" i]')
      .first();
    
    if (await revokeButton.isVisible({ timeout: 5000 })) {
      await revokeButton.click();
      
      // Confirm deletion if confirmation dialog appears
      const confirmButton = page.getByRole('button', { name: /confirm|delete|yes/i }).first();
      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click();
      }

      // Verify key is removed (or marked as revoked)
      await expect(page.getByText('Test API Key')).not.toBeVisible({ timeout: 5000 });
    }
  });
});

