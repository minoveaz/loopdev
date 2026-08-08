import { test, expect } from '@playwright/test';

const shellRoutes = [
  { name: 'login', path: '/login' },
  { name: 'launchpad', path: '/launchpad' },
  { name: 'marketing-studio', path: '/marketing-studio' },
  { name: 'brand-hub', path: '/marketing-studio/brand-hub' },
  { name: 'sales-crm', path: '/sales-crm' },
  { name: 'sales-pipeline', path: '/sales-crm/pipeline' },
];

for (const route of shellRoutes) {
  test(`${route.name} renders without a browser error`, async ({ page }) => {
    const browserErrors = [];
    page.on('pageerror', (error) => browserErrors.push(error.message));

    await page.goto(route.path);
    await expect(page.locator('body')).toBeVisible();
    expect(browserErrors).toEqual([]);
  });

  test(`${route.name} has no horizontal overflow`, async ({ page }) => {
    await page.goto(route.path);

    const hasNoOverflow = await page.locator('body').evaluate((element) => {
      return element.scrollWidth <= element.clientWidth;
    });

    expect(hasNoOverflow).toBe(true);
  });
}
