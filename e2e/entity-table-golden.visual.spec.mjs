import { test, expect } from '@playwright/test';

const DATA_TABLES_URL = '/composition-showcase/certification-lab/data-tables';

async function openEntityTable(page) {
  await page.goto(DATA_TABLES_URL, { waitUntil: 'domcontentloaded' });
  const fixture = page.getByRole('region', { name: 'EntityTable' });
  await expect(fixture).toBeVisible();
  const evidencePanel = page.getByTestId('module-context-panel');
  if (await evidencePanel.isVisible()) {
    await evidencePanel.getByRole('button').first().click();
  }
  return fixture;
}

test('EntityTable golden reference is captured per supported viewport', async ({ page }) => {
  const fixture = await openEntityTable(page);
  await expect(fixture.getByRole('columnheader', { name: 'Customer' })).toBeVisible();
  await expect(fixture.getByRole('textbox', { name: 'Search customers' })).toBeVisible();
  await expect(fixture.getByRole('button', { name: 'Create customer' })).toBeVisible();
  await expect(fixture).toHaveScreenshot('entity-table-golden.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.01,
  });
});
