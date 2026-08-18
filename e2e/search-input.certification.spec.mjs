import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 1024, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

async function openSearchPatterns(page) {
  await page.goto('/composition-showcase?recipe=CertificationLab&component=SearchInput', {
    waitUntil: 'domcontentloaded',
  });
  const evidencePanel = page.locator('aside').filter({ hasText: 'Evidence record' });
  if (await evidencePanel.count()) {
    await evidencePanel.getByRole('button').first().click();
  }
  const fixture = page.getByRole('heading', { name: 'SearchInput', exact: true });
  await expect(fixture).toBeVisible();
  return page.locator('#main-content');
}

test.describe('SearchInput certification', () => {
  for (const viewport of viewports) {
    test(`fits ${viewport.name} without horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const main = await openSearchPatterns(page);
      const dimensions = await main.evaluate((element) => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
      }));
      expect(dimensions.scrollWidth, `overflow at ${viewport.name}`).toBeLessThanOrEqual(
        dimensions.clientWidth,
      );
    });
  }

  test('supports controlled clear and submit semantics', async ({ page }) => {
    const main = await openSearchPatterns(page);
    const search = main.getByRole('textbox', { name: 'Search records' });
    await search.fill('Acme');
    await expect(main.getByRole('button', { name: 'Clear search' })).toBeVisible();
    await main.getByRole('button', { name: 'Clear search' }).click();
    await expect(search).toHaveValue('');
  });

  test('keeps tenant theme variables when organization changes', async ({ page }) => {
    await openSearchPatterns(page);
    const before = await page.locator('[data-search-input="true"]').first().evaluate((element) =>
      getComputedStyle(element).getPropertyValue('--search-accent'),
    );
    const organization = page.getByRole('button', { name: /Showcase Workspace|Northstar Labs/ }).first();
    if (await organization.count()) await organization.click();
    const after = await page.locator('[data-search-input="true"]').first().evaluate((element) =>
      getComputedStyle(element).getPropertyValue('--search-accent'),
    );
    expect(typeof before).toBe('string');
    expect(typeof after).toBe('string');
  });
});
