import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Marketing Studio DAM', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketing-studio/dam');
  });

  test('opens the asset library with the offline fixture set', async ({ page }) => {
    await expect(page).toHaveURL(/\/marketing-studio\/dam$/);
    await expect(page.getByPlaceholder('Search assets')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Grid view' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Upload asset' }).last()).toBeDisabled();
    await expect(page.getByText('Offline development fixtures')).toBeVisible();
    await expect(page.getByRole('button', { name: /VitaBlue primary logo/ })).toBeVisible();
  });

  test('filters assets by search and approval status', async ({ page }) => {
    const assetCards = page.locator('button[aria-pressed]');

    await expect(assetCards).toHaveCount(2);

    await page.getByPlaceholder('Search assets').fill('Protege');
    await expect(assetCards).toHaveCount(1);
    await expect(page.getByRole('button', { name: /Protege Salud primary logo/ })).toBeVisible();

    await page.getByLabel('Filter by approval status').selectOption('archived');
    await expect(assetCards).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'No assets found' })).toBeVisible();
  });

  test('selects an asset and marks its card as selected', async ({ page }) => {
    const assetCard = page.getByRole('button', { name: /VitaBlue primary logo/ });

    await assetCard.click();

    await expect(assetCard).toHaveAttribute('aria-pressed', 'true');
  });
});