import { test, expect } from '@playwright/test';

const CRM_URL = '/composition-showcase?recipe=CertificationLab&component=CRMPrimitives';

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'mobile-compact', width: 320, height: 800 },
]) {
  test(`CRM primitives render without overflow at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(CRM_URL, { waitUntil: 'domcontentloaded' });

    await expect(page.getByText('Select', { exact: true })).toBeVisible();
    await expect(page.getByText('Checkbox', { exact: true })).toBeVisible();
    await expect(page.getByText('Badge / TechnicalStatusBadge', { exact: true })).toBeVisible();
    await expect(page.getByText('EmptyState', { exact: true })).toBeVisible();
    await expect(page.getByText('LoadingState / Skeleton', { exact: true })).toBeVisible();
    await expect(page.getByText('PageHeader', { exact: true })).toBeVisible();
    await expect(page.getByText('SectionHeader', { exact: true })).toBeVisible();
    await expect(page.getByText('UserAvatar', { exact: true })).toBeVisible();
    await expect(page.getByText('CommandBarTrigger', { exact: true })).toBeVisible();

    const main = page.locator('#main-content');
    const dimensions = await main.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(
      dimensions.scrollWidth,
      `CRM showcase overflows at ${viewport.name}`,
    ).toBeLessThanOrEqual(dimensions.clientWidth);
  });
}

test('CRM primitives expose selection and menu behavior', async ({ page }) => {
  await page.goto(CRM_URL, { waitUntil: 'domcontentloaded' });

  const checkbox = page.getByRole('checkbox', { name: 'Select contact' });
  await expect(checkbox).not.toBeChecked();
  await checkbox.check();
  await expect(checkbox).toBeChecked();

  const filterTrigger = page.getByRole('button', { name: 'Segment' });
  await expect(filterTrigger).toBeVisible();

  const selectTrigger = page.getByRole('button', { name: 'Contact status Default' });
  await selectTrigger.click({ force: true });
  await expect(page.getByRole('menuitem', { name: 'Prospect' })).toBeVisible();
  await page.getByRole('menuitem', { name: 'Prospect' }).click();
  await expect(selectTrigger).toContainText('Prospect');
});

test('CommandBarTrigger preserves full, icon, disabled and custom shortcut contracts', async ({
  page,
}) => {
  await page.goto(CRM_URL, { waitUntil: 'domcontentloaded' });

  const commandBar = page
    .getByTestId('crm-command-bar-fixture')
    .getByRole('button', { name: 'Abrir paleta de comandos' });
  await expect(commandBar).toHaveCount(4);
  await expect(commandBar.nth(0)).toContainText('Search or type a command...');
  await expect(commandBar.nth(0)).toContainText('⌘K');
  await expect(commandBar.nth(1)).not.toContainText('Search or type a command...');
  await expect(commandBar.nth(2)).toBeDisabled();
  await expect(commandBar.nth(3)).toContainText('Search CRM actions');
  await expect(commandBar.nth(3)).toContainText('Ctrl K');
});

test('CRM primitives render in light and dark themes', async ({ page }) => {
  await page.goto(CRM_URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('lpd-theme', 'light');
    document.documentElement.classList.remove('dark');
  });
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
  await expect(page.getByText('Badge / TechnicalStatusBadge', { exact: true })).toBeVisible();

  const themeButton = page.getByRole('button', { name: /toggle theme/i });
  await expect(themeButton).toBeVisible();
  await themeButton.evaluate((button) => button.click());
  await expect
    .poll(() => page.evaluate(() => document.documentElement.classList.contains('dark')))
    .toBe(true);
});
