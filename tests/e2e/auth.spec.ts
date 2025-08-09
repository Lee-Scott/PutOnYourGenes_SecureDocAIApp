import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('should allow a user to register and log in', async ({ page }) => {
    // Navigate to the registration page
    await page.goto('/register');

    // Fill out the registration form
    await page.locator('input[name="username"]').fill('testuser');
    await page.locator('input[name="email"]').fill('testuser@example.com');
    await page.locator('input[name="password"]').fill('password123');
    await page.locator('button[type="submit"]').click();

    // Verify that the user is redirected to the login page
    await expect(page).toHaveURL('/login');

    // Fill out the login form
    await page.locator('input[name="username"]').fill('testuser');
    await page.locator('input[name="password"]').fill('password123');
    await page.locator('button[type="submit"]').click();

    // Verify that the user is redirected to the home page
    await expect(page).toHaveURL('/');
  });
});
