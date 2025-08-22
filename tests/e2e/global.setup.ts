import { chromium, FullConfig, expect } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(baseURL + '/login');
    await page.locator('input[type="email"], input[type="text"]').first().fill('leesanlive@gmail.com');
    await page.locator('input[type="password"]').fill('4934');
    await page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first().click();

    // Wait for navigation to complete, then check the URL.
    await page.waitForNavigation();

    const url = page.url();
    if (!url.endsWith('/documents')) {
        await page.screenshot({ path: 'tests/e2e/global-setup-error.png' });
        throw new Error(`Login failed. Expected to be on /documents, but was on ${url}`);
    }

    await expect(page).toHaveURL(baseURL + '/documents');

    await page.context().storageState({ path: storageState as string });
  } catch (error) {
    // Also take screenshot on any other error
    await page.screenshot({ path: 'tests/e2e/global-setup-error.png' });
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;