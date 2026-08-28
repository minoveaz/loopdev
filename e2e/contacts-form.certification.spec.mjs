import { test, expect } from '@playwright/test';

test.describe('Contacts table and create form', () => {
  test('renders fixture contacts and the responsive form contract', async ({ page }) => {
    await page.goto('/sales-crm/contacts', { waitUntil: 'domcontentloaded' });

    await expect(
      page
        .locator('[data-module-header="true"]')
        .getByRole('heading', { name: 'Contacts', exact: true }),
    ).toBeVisible();
    const contactName =
      page.viewportSize().width < 768
        ? page.getByLabel('Contacts mobile list').getByText('Ana Garcia')
        : page.locator('tbody').getByText('Ana Garcia');
    await expect(contactName).toBeVisible();

    await page.getByRole('button', { name: 'Create contact' }).click();
    await expect(page.getByRole('heading', { name: 'Create contact' })).toBeVisible();
    await expect(page.getByRole('group', { name: 'Identity' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create contact' })).toBeVisible();

    const dialog = page.getByRole('dialog');
    const dimensions = await dialog.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      scrollable: Boolean(element.querySelector('[style*="overflow-y"], .overflow-y-auto')),
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
    expect(dimensions.scrollable).toBe(true);
  });
});
