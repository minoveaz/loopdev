import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const DATA_TABLES_URL = '/composition-showcase/certification-lab/data-tables';

async function openQuantitativeTable(page) {
  await page.goto(DATA_TABLES_URL, { waitUntil: 'domcontentloaded' });
  const fixture = page.getByRole('region', { name: 'QuantitativeTable' });
  await expect(fixture).toBeVisible();
  const evidencePanel = page.getByTestId('module-context-panel');
  if (await evidencePanel.isVisible()) {
    await evidencePanel.getByRole('button').first().click();
  }
  return fixture;
}

test('QuantitativeTable exposes metric comparison without pagination', async ({ page }) => {
  const fixture = await openQuantitativeTable(page);
  const table = fixture.getByRole('table', { name: 'Quantitative metrics' });
  if (await table.count()) {
    await expect(table).toBeVisible();
    await expect(fixture.getByText('Current').first()).toBeVisible();
    await expect(fixture.getByText('Change').first()).toBeVisible();
    await expect(fixture.getByText('vs last month').first()).toBeVisible();
    await expect(fixture.getByText('Target vs goal').first()).toBeVisible();
  } else {
    await expect(fixture.locator('[aria-label="Quantitative metrics mobile list"]')).toBeVisible();
  }
  await expect(fixture.getByRole('progressbar')).toHaveCount(3);
  await expect(fixture.getByRole('button', { name: 'Next' })).toHaveCount(0);
  await expect(fixture.getByRole('button', { name: 'Previous' })).toHaveCount(0);
});

test('QuantitativeTable passes Axe checks in its quantitative region', async ({ page }) => {
  await openQuantitativeTable(page);
  const results = await new AxeBuilder({ page })
    .include('section[aria-labelledby="quantitativetable-heading"]')
    .options({ rules: { 'color-contrast': { enabled: false }, 'landmark-no-duplicate-banner': { enabled: false } } })
    .analyze();
  expect(results.violations).toEqual([]);
});

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'mobile-compact', width: 320, height: 800 },
]) {
  test(`QuantitativeTable remains contained at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const fixture = await openQuantitativeTable(page);
    const dimensions = await fixture.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(dimensions.scrollWidth, `QuantitativeTable overflows at ${viewport.name}`).toBeLessThanOrEqual(dimensions.clientWidth);
  });
}
