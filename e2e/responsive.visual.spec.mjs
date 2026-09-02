import { test, expect } from '@playwright/test';

test.use({
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}-{projectName}{ext}',
});

for (const theme of ['light', 'dark']) {
  test.describe(`responsive login ${theme} visual certification`, () => {
    test(`matches the login visual baseline at the selected responsive viewport`, async ({
      page,
    }, testInfo) => {
      await page.addInitScript((selectedTheme) => {
        window.localStorage.setItem('lpd-theme', selectedTheme);
        document.documentElement.classList.toggle('dark', selectedTheme === 'dark');
      }, theme);

      await page.goto('/login');
      await expect(page.locator('body')).toBeVisible();
      await expect(page).toHaveScreenshot(`login-${theme}.png`, {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixelRatio: testInfo.project.name.startsWith('mobile') ? 0.05 : 0.02,
      });
    });
  });
}
