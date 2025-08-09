import { test, expect } from '@playwright/test';

test.describe('Questionnaire', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/questionnaires');
  });

  test('should display the questionnaire page', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Questionnaires');
  });

  test('should allow creating a new questionnaire', async ({ page }) => {
    await page.click('button:has-text("New Questionnaire")');
    await expect(page.locator('h2')).toHaveText('Create Questionnaire');
  });
});
