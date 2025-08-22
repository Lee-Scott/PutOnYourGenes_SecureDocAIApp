// import { test, expect } from '@playwright/test';

// test.describe('Chat', () => {
//   test('should allow a user to create a chat room and send a message', async ({ page }) => {
//     await page.goto('/chat');
//     // Create a new chat room
//     console.log('Attempting to find and click "Start New Chat" button');
//     await expect(page.locator('button:has-text("Start New Chat")')).toBeVisible();
//     await page.locator('button:has-text("Start New Chat")').click();

//     // TODO: FIX
//     await page.locator('#userSearch').fill('Dr. Docu');
//     await page.locator('button:has-text("Dr. Docu The AI Helper")').click();
//     await page.locator('button:has-text("Start Chat")').click();

//     // Send a message
//     await page.locator('textarea[name="message"]').fill('Hello, world!');
//     await page.locator('button:has-text("Send")').click();

//     // Verify that the message was sent
//     await expect(page.locator('text=Hello, world!')).toBeVisible();
//   });
// });
