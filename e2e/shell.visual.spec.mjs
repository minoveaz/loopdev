import { test, expect } from '@playwright/test';

const visualRoutes = [{ name: 'login', path: '/login', storageState: undefined }];

for (const theme of ['light', 'dark']) {
  for (const route of visualRoutes) {
    test.describe(`${route.name} ${theme}`, () => {
      test.use({ storageState: route.storageState });

      test(`matches the ${route.name} ${theme} visual baseline`, async ({ page }, testInfo) => {
        await page.addInitScript((selectedTheme) => {
          window.localStorage.setItem('lpd-theme', selectedTheme);
          document.documentElement.classList.toggle('dark', selectedTheme === 'dark');
        }, theme);

        await page.goto(route.path);
        await expect(page.locator('body')).toBeVisible();
        await expect(page).toHaveScreenshot(`${route.name}-${theme}.png`, {
          fullPage: true,
          animations: 'disabled',
          maxDiffPixelRatio:
            route.name === 'login' && testInfo.project.name.startsWith('mobile')
              ? 0.05
              : route.name !== 'shell-showcase'
                ? 0.02
                : testInfo.project.name === 'mobile-compact'
                  ? 0.06
                  : 0.03,
        });
      });
    });
  }
}
