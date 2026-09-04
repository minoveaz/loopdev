import { test, expect } from '@playwright/test';

const shellRoutes = [
  { name: 'login', path: '/login' },
  { name: 'launchpad', path: '/launchpad' },
];

for (const route of shellRoutes) {
  test(`${route.name} loads without emitting browser errors`, async ({ page }) => {
    const browserErrors = [];
    page.on('pageerror', (error) => browserErrors.push(error.message));

    await page.goto(route.path);
    await expect(page.locator('body')).toBeVisible();
    expect(browserErrors).toEqual([]);
  });

  test(`${route.name} remains within the viewport without horizontal overflow`, async ({
    page,
  }) => {
    await page.goto(route.path);

    const hasNoOverflow = await page.locator('body').evaluate((element) => {
      return element.scrollWidth <= element.clientWidth;
    });

    expect(hasNoOverflow).toBe(true);
  });
}
