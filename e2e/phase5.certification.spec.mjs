import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

const suites = [{ name: 'launchpad', path: '/launchpad' }];

for (const theme of ['light', 'dark']) {
  for (const suite of suites) {
    test(`${suite.name} has no overflow or unexpected browser errors in ${theme} theme`, async ({
      page,
    }) => {
      const browserErrors = [];
      page.on('pageerror', (error) => browserErrors.push(error.message));

      await page.addInitScript((selectedTheme) => {
        window.localStorage.setItem('lpd-theme', selectedTheme);
        document.documentElement.classList.toggle('dark', selectedTheme === 'dark');
      }, theme);

      await page.goto(suite.path);
      await expect(page.locator('body')).toBeVisible();
      await expect(page.getByText('Your session has expired')).toHaveCount(0);
      await expect(page.locator('#main-content')).toBeVisible({ timeout: 15000 });

      const metrics = await page.locator('body').evaluate((element) => ({
        viewportWidth: element.clientWidth,
        contentWidth: element.scrollWidth,
        hasHorizontalOverflow: element.scrollWidth > element.clientWidth,
      }));

      expect(
        browserErrors.filter(
          (message) => !message.includes("Cannot read properties of null (reading 'classList')"),
        ),
      ).toEqual([]);
      expect(metrics.hasHorizontalOverflow).toBe(false);
    });
  }
}
