import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const DATA_TABLES_URL = '/composition-showcase/certification-lab/data-tables';

async function openSelectionTable(page) {
  await page.goto(DATA_TABLES_URL, { waitUntil: 'domcontentloaded' });
  const fixture = page.getByRole('region', { name: 'SelectionTable' });
  await expect(fixture).toBeVisible();
  return fixture;
}

test('SelectionTable exposes default sorting and semantic selection atoms', async ({
  page,
}, testInfo) => {
  const fixture = await openSelectionTable(page);
  if (testInfo.project.name === 'desktop') {
    await expect(fixture.getByRole('table', { name: 'Selection workflows' })).toBeVisible();
    await expect(fixture.getByRole('columnheader', { name: /Customer/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
  }
  if (testInfo.project.name === 'desktop') {
    await expect(fixture.getByText('Active').first()).toBeVisible();
    await expect(fixture.getByText('Paused').first()).toBeVisible();
  }
  await expect(fixture.getByText('Showing 1-3 of 3 records')).toBeVisible();
});

test('SelectionTable supports partial master selection and contextual bulk actions', async ({
  page,
}, testInfo) => {
  const fixture = await openSelectionTable(page);
  test.skip(
    testInfo.project.name !== 'desktop',
    'Selection interaction is represented by the desktop table in this fixture.',
  );
  await fixture.getByRole('checkbox', { name: /Select row acme/i }).click();

  const masterCheckbox = fixture.getByRole('checkbox', { name: /Select all/i });
  await expect(masterCheckbox).toHaveAttribute('aria-checked', 'mixed');
  await expect(fixture.getByRole('toolbar', { name: 'Bulk actions' })).toBeVisible();
  await expect(fixture.getByText('1 selected')).toBeVisible();

  await masterCheckbox.click();
  await expect(masterCheckbox).toHaveAttribute('aria-checked', 'true');
  await expect(fixture.getByText('3 selected')).toBeVisible();
});

test('SelectionTable confirms Assign owner through the global modal overlay', async ({
  page,
}, testInfo) => {
  const fixture = await openSelectionTable(page);
  test.skip(
    testInfo.project.name !== 'desktop',
    'Selection interaction is represented by the desktop table in this fixture.',
  );
  await fixture.getByRole('checkbox', { name: /Select row acme/i }).click();
  await fixture
    .getByRole('toolbar', { name: 'Bulk actions' })
    .getByRole('button', { name: 'Assign owner' })
    .click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.locator('.lpd-technical-dialog-backdrop')).toBeVisible();
  await expect(dialog.getByText('You are assigning 1 record')).toBeVisible();

  await dialog.getByRole('button', { name: 'Select owner' }).click();
  await expect(page.getByRole('menu')).toBeVisible();
  await page.getByRole('menuitem', { name: 'Sofia' }).click();
  await expect(dialog.getByRole('button', { name: 'Assign owner' })).toBeEnabled();
  await dialog.getByRole('button', { name: 'Assign owner' }).click();
  await expect(dialog).toBeHidden();
  await expect(fixture.getByText('Sofia').first()).toBeVisible();
});

test('SelectionTable passes Axe checks in its region', async ({ page }) => {
  const fixture = await openSelectionTable(page);
  const results = await new AxeBuilder({ page })
    .include('section[aria-labelledby="selectiontable-heading"]')
    .options({
      rules: {
        'color-contrast': { enabled: false },
        'landmark-no-duplicate-banner': { enabled: false },
      },
    })
    .analyze();
  expect(results.violations).toEqual([]);
});

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'mobile-compact', width: 320, height: 800 },
]) {
  test(`SelectionTable remains contained at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const fixture = await openSelectionTable(page);
    const dimensions = await fixture.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(
      dimensions.scrollWidth,
      `SelectionTable overflows at ${viewport.name}`,
    ).toBeLessThanOrEqual(dimensions.clientWidth);
  });
}
