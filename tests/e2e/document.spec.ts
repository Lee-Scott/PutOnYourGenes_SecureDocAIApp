import { test, expect } from '@playwright/test';

test.describe.skip('Document Management', () => {
  test('should allow a user to upload, view, and download a document', async ({ page }) => {
    await page.goto('/documents');
    // Upload a document
    await expect(page.locator('button:has-text("Upload")')).toBeVisible();
    await page.locator('input[type="file"]').setInputFiles('tests/fixtures/sample.pdf');
    await page.locator('button:has-text("Upload")').click();
    await page.waitForResponse(response => response.url().includes('/documents') && response.status() === 201);

    // Verify that the document is listed
    await expect(page.locator('text=sample.pdf')).toBeVisible({ timeout: 10000 });

    // View the document
    await page.locator('text=sample.pdf').click();
    await expect(page.locator('h2')).toHaveText('sample.pdf');

    // Download the document
    const [ download ] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('button:has-text("Download")').click()
    ]);

    // Verify that the download was successful
    expect(download.suggestedFilename()).toBe('sample.pdf');
  });
});
