import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ENTITY_TABLE_URL = '/composition-showcase/certification-lab/data-tables';

async function openEntityTable(page) {
  await page.goto(ENTITY_TABLE_URL, { waitUntil: 'domcontentloaded' });
  const fixture = page.getByLabel('EntityTable');
  await expect(fixture).toBeVisible();
  return fixture;
}

test('EntityTable smoke route exposes its primary contract', async ({ page }) => {
  const fixture = await openEntityTable(page);
  await expect(fixture.getByRole('button', { name: 'Create customer' })).toBeVisible();
  await expect(fixture.getByRole('columnheader', { name: 'Customer' })).toBeVisible();
  await expect(fixture.getByRole('checkbox', { name: 'Select row acme' })).not.toBeChecked();
});

test('EntityTable selection is unified across row, checkbox and clear action', async ({ page }) => {
  const fixture = await openEntityTable(page);
  const row = fixture.getByRole('row', { name: /Acme Industries/ });
  const checkbox = fixture.getByRole('checkbox', { name: 'Select row acme' });
  await row.getByRole('cell', { name: 'Acme Industries', exact: true }).click();
  await expect(checkbox).toBeChecked();
  await expect(row).toHaveAttribute('aria-selected', 'true');
  await checkbox.uncheck();
  await expect(checkbox).not.toBeChecked();
});

test('EntityTable keeps actions and pagination outside the horizontal table scroller', async ({ page }) => {
  const fixture = await openEntityTable(page);
  const metrics = await fixture.locator('[aria-label="Scrollable data table"]').evaluate((element) => {
    const scrollRegion = element.querySelector('.overflow-x-auto');
    const bulkAction = [...element.querySelectorAll('button')].find((button) => button.textContent?.includes('Assign owner'));
    const pagination = element.querySelector('[aria-label="Go to page"]');
    return {
      regionScrolls: Boolean(scrollRegion && scrollRegion.scrollWidth > scrollRegion.clientWidth),
      controlsInScrollRegion: Boolean(scrollRegion && ((bulkAction && scrollRegion.contains(bulkAction)) || (pagination && scrollRegion.contains(pagination)))),
      rootOverflow: document.querySelector('#main-content').scrollWidth > document.querySelector('#main-content').clientWidth,
    };
  });
  const viewportWidth = page.viewportSize()?.width ?? 1440;
  expect(metrics.regionScrolls).toBe(viewportWidth < 1200);
  expect(metrics.controlsInScrollRegion).toBe(false);
  expect(metrics.rootOverflow).toBe(false);
});

test('EntityTable passes accessibility checks in light and dark themes', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Theme toggle is intentionally hidden on mobile shell layouts.');
  await page.goto(ENTITY_TABLE_URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('lpd-theme', 'light');
    document.documentElement.classList.remove('dark');
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await openEntityTable(page);
  const axeOptions = {
    rules: {
      'color-contrast': { enabled: false },
      'landmark-no-duplicate-banner': { enabled: false },
    },
  };
  const lightResults = await new AxeBuilder({ page }).include('section[aria-labelledby="entitytable-heading"]').options(axeOptions).analyze();
  expect(lightResults.violations).toEqual([]);
  await page.getByRole('button', { name: /toggle theme/i }).click({ force: true });
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(true);
  const darkResults = await new AxeBuilder({ page }).include('section[aria-labelledby="entitytable-heading"]').options(axeOptions).analyze();
  expect(darkResults.violations).toEqual([]);
});

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'mobile-compact', width: 320, height: 800 },
]) {
  test(`EntityTable remains contained at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await openEntityTable(page);
    const dimensions = await page.locator('#main-content').evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(dimensions.scrollWidth, `EntityTable shell overflows at ${viewport.name}`).toBeLessThanOrEqual(dimensions.clientWidth);
  });
}
