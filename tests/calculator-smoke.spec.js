// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Capacitance Calculator smoke', () => {
  test('home page loads with title and calculator mode selector', async ({ page }) => {
    const response = await page.goto('/');

    expect(response, 'home page response').not.toBeNull();
    expect(response.ok(), 'home page response is OK').toBeTruthy();

    await expect(page).toHaveTitle(/Capacitance Calculator/i);
    await expect(page.getByRole('heading', { name: 'Capacitance Calculator', level: 1 })).toBeVisible();

    const modeSelector = page.getByRole('combobox', { name: /select calculator mode/i }).first();
    await expect(modeSelector).toBeVisible();
    await expect(modeSelector).toContainText('Unit Converter');
  });
});
