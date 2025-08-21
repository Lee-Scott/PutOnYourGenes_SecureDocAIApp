import { chromium, FullConfig } from '@playwright/test';
import { expect } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(baseURL + '/login');
  await page.locator('input[type="email"], input[type="text"]').first().fill('leesanlive@gmail.com');
  await page.locator('input[type="password"]').fill('4934');
  await page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first().click();
  
  await page.waitForURL(baseURL + '/documents');
  await expect(page).toHaveURL(baseURL + '/documents');

  await page.context().storageState({ path: storageState as string });
  await browser.close();
}

export default globalSetup;
