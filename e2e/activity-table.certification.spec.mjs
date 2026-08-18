import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const DATA_TABLES_URL = '/composition-showcase/certification-lab/data-tables';

async function openDataTables(page) {
  await page.goto(DATA_TABLES_URL, { waitUntil: 'domcontentloaded' });
  const fixture = page.getByRole('region', { name: 'ActivityTable' });
  await expect(fixture).toBeVisible();
  const evidencePanel = page.getByTestId('module-context-panel');
  if (await evidencePanel.isVisible()) {
    await evidencePanel.getByRole('button').first().click();
  }
  return fixture;
}

test('ActivityTable exposes newest-first events and interactive sorting', async ({ page }, testInfo) => {
  const fixture = await openDataTables(page);
  if (testInfo.project.name === 'desktop') {
    await expect(fixture.getByRole('table', { name: 'Activity events' })).toBeVisible();
    await expect(fixture.getByRole('columnheader', { name: /Date/ })).toHaveAttribute('aria-sort', 'descending');
    await expect(fixture.getByRole('cell', { name: 'Today, 09:30' })).toBeVisible();
    await fixture.getByRole('button', { name: /Sort by Date/ }).click();
    await expect(fixture.getByRole('columnheader', { name: /Date/ })).toHaveAttribute('aria-sort', 'ascending');
  } else {
    await expect(fixture.getByRole('button', { name: /Follow-up scheduled.*Ana Morgan.*Today, 09:30/ })).toBeVisible();
  }
  await expect(fixture.getByText('Showing recent 3 events')).toBeVisible();
});

test('ActivityTable opens the selected event in ModuleContextPanel', async ({ page }, testInfo) => {
  const fixture = await openDataTables(page);
  const eventRow = testInfo.project.name === 'desktop'
    ? fixture.getByRole('cell', { name: 'Follow-up scheduled' })
    : fixture.getByRole('button', { name: /Follow-up scheduled.*Ana Morgan/ });
  await eventRow.click();

  const panel = page.getByTestId('module-context-panel');
  await expect(panel).toBeVisible();
  await expect(panel.getByText('Activity detail')).toBeVisible();
  await expect(panel.getByText('Follow-up scheduled')).toBeVisible();
  await expect(panel.getByText('Ana Morgan')).toBeVisible();
  await expect(panel.getByText('Open')).toBeVisible();
});

test('ActivityTable passes Axe checks in its region', async ({ page }) => {
  await openDataTables(page);
  const results = await new AxeBuilder({ page })
    .include('section[aria-labelledby="activitytable-heading"]')
    .options({ rules: { 'color-contrast': { enabled: false }, 'landmark-no-duplicate-banner': { enabled: false } } })
    .analyze();
  expect(results.violations).toEqual([]);
});

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'mobile-compact', width: 320, height: 800 },
]) {
  test(`ActivityTable remains contained at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const fixture = await openDataTables(page);
    const dimensions = await fixture.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(dimensions.scrollWidth, `ActivityTable overflows at ${viewport.name}`).toBeLessThanOrEqual(dimensions.clientWidth);
  });
}
