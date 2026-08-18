import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 1024, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

async function openFiltersActions(page) {
  await page.goto('/composition-showcase?recipe=CertificationLab&component=FiltersActions', {
    waitUntil: 'domcontentloaded',
  });
  const evidencePanel = page.locator('aside').filter({ hasText: 'Evidence record' });
  if (await evidencePanel.count()) {
    await evidencePanel.getByRole('button').first().click();
  }
  const fixture = page.getByRole('region', { name: 'FiltersActions' });
  await expect(
    fixture.getByRole('heading', { name: 'Customer records', exact: true }),
  ).toBeVisible();
  await expect(fixture.getByRole('toolbar', { name: 'Customer records' })).toBeVisible();
  return fixture;
}

test.describe('FiltersActions certification', () => {
  for (const viewport of viewports) {
    test(`fits ${viewport.name} without overflow or layout shift`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await openFiltersActions(page);

      const layoutShift = await page.evaluate(() => {
        let total = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) total += entry.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
        return total;
      });
      const dimensions = await page.locator('#main-content').evaluate((element) => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
      }));
      expect(dimensions.scrollWidth, `overflow at ${viewport.name}`).toBeLessThanOrEqual(
        dimensions.clientWidth,
      );
      expect(layoutShift, `initial CLS at ${viewport.name}`).toBeLessThan(0.1);
    });
  }

  test('supports search clear and advanced-filter Escape focus return', async ({ page }) => {
    const fixture = await openFiltersActions(page);
    const search = fixture.getByRole('textbox', {
      name: 'Search contacts by name, email or company',
    });
    await search.fill('Acme');
    await expect(fixture.getByRole('button', { name: 'Clear search' })).toBeVisible();
    await fixture.getByRole('button', { name: 'Clear search' }).click();
    await expect(search).toHaveValue('');

    const moreFilters = fixture.getByRole('button', { name: 'More filters' });
    await moreFilters.click();
    await expect(moreFilters).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(moreFilters).toHaveAttribute('aria-expanded', 'false');
    await expect(moreFilters).toBeFocused();
  });

  test('keeps semantic surfaces readable in light and dark themes', async ({ page }) => {
    await openFiltersActions(page);
    await page.evaluate(() => {
      localStorage.setItem('lpd-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await page.reload();
    await openFiltersActions(page);
    const root = page.locator('html');
    await expect(root).not.toHaveClass(/dark/);
    await page.getByRole('button', { name: /toggle theme/i }).click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('lpd-theme'))).toBe('dark');
    await expect(root).toHaveClass(/dark/);
  });
});
