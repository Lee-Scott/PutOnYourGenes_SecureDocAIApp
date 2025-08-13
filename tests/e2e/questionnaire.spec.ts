import { test, expect } from '@playwright/test';

test.describe('Questionnaire', () => {
  test.beforeEach(async ({ page }) => {
    // Log in before each test
    await page.goto('/login');
    await page.locator('input[name="username"]').fill('familyFirstSoftware@gmail.com');
    await page.locator('input[name="password"]').fill('4934');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL('/');

    await page.goto('/questionnaires');
  });

  test('should display the questionnaire page', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Questionnaires');
  });

  test('should allow creating a new questionnaire', async ({ page }) => {
    await page.click('button:has-text("New Questionnaire")');
    await expect(page.locator('h2')).toHaveText('Create Questionnaire');

    // Fill out the questionnaire form
    await page.locator('input[name="title"]').fill('Test Questionnaire');
    await page.locator('textarea[name="description"]').fill('This is a test questionnaire.');
    await page.locator('button:has-text("Add Question")').click();
    await page.locator('input[name="questions.0.questionText"]').fill('What is your favorite color?');
    await page.locator('button[type="submit"]').click();

    // Verify that the questionnaire was created successfully
    await expect(page.locator('text=Test Questionnaire')).toBeVisible();
  });
});
