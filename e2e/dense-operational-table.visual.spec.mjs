import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const DATA_TABLES_URL = '/composition-showcase/certification-lab/data-tables';

async function openDenseOperationalTable(page) {
  await page.goto(DATA_TABLES_URL, { waitUntil: 'domcontentloaded' });
  const fixture = page.getByRole('region', { name: 'DenseOperationalTable' });
  await expect(fixture).toBeVisible();
  const evidencePanel = page.getByTestId('module-context-panel');
  if (await evidencePanel.isVisible()) {
    await evidencePanel.getByRole('button').first().click();
  }
  return fixture;
}

test('DenseOperationalTable exposes sorting and pagination without CRM controls', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'desktop',
    'Operational table controls are verified on the desktop table representation.',
  );
  const fixture = await openDenseOperationalTable(page);
  await expect(fixture.getByRole('columnheader', { name: 'Customer' })).toBeVisible();
  expect(await fixture.getByText('Acme Industries').count()).toBeGreaterThan(0);
  expect(await fixture.getByText('Summit Works').count()).toBe(0);

  await fixture.getByRole('button', { name: 'Next' }).click({ force: true });
  expect(await fixture.getByText('Summit Works').count()).toBeGreaterThan(0);
  expect(await fixture.getByText('Acme Industries').count()).toBe(0);

  await expect(fixture.getByRole('columnheader', { name: /Customer/ })).toHaveAttribute(
    'aria-sort',
    'ascending',
  );
  await fixture.getByRole('button', { name: /Sort by Customer/ }).click({ force: true });
  await expect(fixture.getByRole('columnheader', { name: /Customer/ })).toHaveAttribute(
    'aria-sort',
    'descending',
  );
  await expect(fixture.getByRole('textbox')).toHaveCount(0);
  await expect(fixture.getByRole('checkbox')).toHaveCount(0);
});

test('DenseOperationalTable passes Axe checks in its operational region', async ({
  page,
}, testInfo) => {
  const fixture = await openDenseOperationalTable(page);
  const results = await new AxeBuilder({ page })
    .include('section[aria-labelledby="denseoperationaltable-heading"]')
    .options({
      rules: {
        'color-contrast': { enabled: false },
        'landmark-no-duplicate-banner': { enabled: false },
      },
    })
    .analyze();
  expect(results.violations).toEqual([]);
  test.skip(
    testInfo.project.name !== 'desktop',
    'The visual baseline is defined for the desktop operational composition.',
  );
  await expect(fixture).toHaveScreenshot('dense-operational-table-desktop.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.01,
  });
});

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'mobile-compact', width: 320, height: 800 },
]) {
  test(`DenseOperationalTable remains contained at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const fixture = await openDenseOperationalTable(page);
    const dimensions = await fixture.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(
      dimensions.scrollWidth,
      `DenseOperationalTable overflows at ${viewport.name}`,
    ).toBeLessThanOrEqual(dimensions.clientWidth);
  });
}
