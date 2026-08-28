import { test, expect } from '@playwright/test';

const shellRoutes = [
  { name: 'login', path: '/login' },
  { name: 'launchpad', path: '/launchpad' },
];

for (const route of shellRoutes) {
  test(`${route.name} renders for mobile inspection`, async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'diagnostic',
      description: 'Mobile is not yet a certified product requirement.',
    });

    await page.goto(route.path);
    await expect(page.locator('body')).toBeVisible();

    const layoutMetrics = await page.locator('body').evaluate((element) => ({
      viewportWidth: element.clientWidth,
      contentWidth: element.scrollWidth,
      hasHorizontalOverflow: element.scrollWidth > element.clientWidth,
    }));

    await testInfo.attach('mobile-layout-metrics.json', {
      body: JSON.stringify(layoutMetrics, null, 2),
      contentType: 'application/json',
    });

    const screenshotPath = testInfo.outputPath('mobile-page.png');
    await page.screenshot({ path: screenshotPath, fullPage: true, animations: 'disabled' });
    await testInfo.attach('mobile-page.png', {
      path: screenshotPath,
      contentType: 'image/png',
    });
  });
}
