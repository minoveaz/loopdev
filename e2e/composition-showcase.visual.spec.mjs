import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 1024, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  test(`reference compositions fit ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const recipe of ['SuiteOverview', 'DataWorkspace', 'RecordWorkspace', 'BoardWorkspace', 'SplitWorkspace', 'ImmersiveWorkflow', 'CreativeEditor']) {
      await page.goto(`/composition-showcase?recipe=${recipe}`);
      const shell = page.locator('#main-content');
      const content = shell.getByRole('main');
      await expect(shell).toBeVisible();
      await expect(page.getByText('Your session has expired')).toHaveCount(0);
      if (recipe === 'CreativeEditor' && viewport.name === 'mobile') {
        await expect(page.getByRole('heading', { name: 'Media Details', exact: true }).first()).toBeVisible();
      } else {
        await expect(content).toBeVisible();
      }

      const dimensions = await shell.evaluate((element) => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
      }));
      expect(dimensions.scrollWidth, `${recipe} overflows at ${viewport.name}`).toBeLessThanOrEqual(dimensions.clientWidth);
    }
  });
}