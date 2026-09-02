import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

test('keeps each reference recipe within the active project viewport', async ({ page }) => {
  const viewport = page.viewportSize();
  const isCompactMobile = viewport?.width === 320;
  const isMobile = Boolean(viewport?.width && viewport.width < 768);
  const viewportName = isCompactMobile
    ? 'mobile-compact'
    : isMobile
      ? 'mobile'
      : viewport?.width === 1024
        ? 'tablet'
        : 'desktop';

  const recipes = isMobile
    ? [
        'SuiteOverview',
        'DataWorkspace',
        'RecordWorkspace',
        'BoardWorkspace',
        'SplitWorkspace',
        'ImmersiveWorkflow',
        'CertificationLab',
      ]
    : [
        'SuiteOverview',
        'DataWorkspace',
        'RecordWorkspace',
        'BoardWorkspace',
        'SplitWorkspace',
        'ImmersiveWorkflow',
        'CreativeEditor',
        'CertificationLab',
      ];

  for (const recipe of recipes) {
    await page.goto(`/composition-showcase?recipe=${recipe}`);
    const shell = page.locator('#main-content');
    const content = shell.getByRole('main');
    await expect(shell).toBeVisible();
    await expect(page.getByText('Your session has expired')).toHaveCount(0);
    await expect(content).toBeVisible();

    const dimensions = await shell.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(dimensions.scrollWidth, `${recipe} overflows at ${viewportName}`).toBeLessThanOrEqual(
      dimensions.clientWidth,
    );
  }
});
