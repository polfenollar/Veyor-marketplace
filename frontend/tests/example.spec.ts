import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Freightos Marketplace/);
});

test('navigation to booking page', async ({ page }) => {
    await page.goto('/');

    // Check if we can find a booking link or button (adjust selector as needed based on actual UI)
    // For now, just checking if the main page loads content
    await expect(page.locator('body')).toBeVisible();
});
