import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('dashboard cards are visible and not overlapped', async ({ page }) => {
        const dashboard = page.locator('.max-w-6xl.mx-auto.w-full.px-4.md\\:px-8.-mt-10.mb-20.relative.z-20');
        await expect(dashboard).toBeVisible();

        // Check z-index to ensure it's above other elements if necessary
        const zIndex = await dashboard.evaluate((el) => window.getComputedStyle(el).zIndex);
        expect(zIndex).toBe('20');
    });

    test('navigation works for "Book your first shipment"', async ({ page }) => {
        await page.getByRole('button', { name: 'Book your first shipment' }).click();
        await expect(page).toHaveURL(/.*\/shipments/);
    });

    test('navigation works for "View payments"', async ({ page }) => {
        await page.getByRole('button', { name: 'View payments' }).click();
        await expect(page).toHaveURL(/.*\/account\/billing/);
    });
});
