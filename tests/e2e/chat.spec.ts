import { test, expect } from '@playwright/test';

test.describe.skip('Chat', () => {
  test('should allow a user to create a chat room and send a message', async ({ page }) => {
    await page.goto('/chat');
    // Create a new chat room
    await expect(page.locator('button:has-text("New Chat Room")')).toBeVisible();
    await page.locator('button:has-text("New Chat Room")').click();
    await page.locator('input[name="name"]').fill('Test Chat Room');
    await page.locator('button:has-text("Create")').click();

    // Verify that the chat room was created
    await expect(page.locator('text=Test Chat Room')).toBeVisible();

    // Send a message
    await page.locator('text=Test Chat Room').click();
    await page.locator('textarea[name="message"]').fill('Hello, world!');
    await page.locator('button:has-text("Send")').click();

    // Verify that the message was sent
    await expect(page.locator('text=Hello, world!')).toBeVisible();
  });
});
