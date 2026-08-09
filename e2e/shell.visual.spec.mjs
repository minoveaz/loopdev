import { test, expect } from '@playwright/test';

const visualRoutes = [
  { name: 'login', path: '/login' },
  { name: 'launchpad', path: '/launchpad' },
];

for (const theme of ['light', 'dark']) {
  for (const route of visualRoutes) {
    test(`${route.name} matches the ${theme} desktop visual baseline`, async ({ page }) => {
      await page.addInitScript((selectedTheme) => {
        window.localStorage.setItem('lpd-theme', selectedTheme);
        document.documentElement.classList.toggle('dark', selectedTheme === 'dark');
      }, theme);

      await page.goto(route.path);
      await expect(page.locator('body')).toBeVisible();
      await expect(page).toHaveScreenshot(`${route.name}-${theme}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
}
