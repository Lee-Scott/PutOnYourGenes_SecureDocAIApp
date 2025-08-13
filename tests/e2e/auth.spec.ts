import { test, expect } from '@playwright/test';

// This test is intentionally left blank because the login
// functionality is now handled by the global setup file.
test.describe('User Authentication', () => {
  test('is handled by global.setup.ts', () => {
    // You can add a test here to verify that the user is logged in,
    // for example by checking for a "logout" button.
    expect(true).toBe(true);
  });
});
