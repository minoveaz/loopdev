import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

const authenticatedRoutes = [
  { name: 'launchpad', path: '/launchpad' },
];

for (const route of authenticatedRoutes) {
  test(`${route.name} is usable on mobile when authenticated`, async ({ page }, testInfo) => {
    const browserErrors = [];
    page.on('pageerror', (error) => browserErrors.push(error.message));

    await page.goto(route.path);
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByText('Your session has expired')).toHaveCount(0);
    await expect(page).toHaveURL(new RegExp(`${route.path.replaceAll('/', '\\/')}$`), {
      timeout: 15000,
    });
    await expect(page.getByText('Checking your secure workspace access...')).toHaveCount(0, {
      timeout: 15000,
    });
    await expect(page.getByText('Initialize your Work Context to start building.')).toBeVisible({
      timeout: 15000,
    });
    await expect(page.locator('#main-content')).toBeVisible({ timeout: 15000 });

    const visibleControlBounds = await page
      .locator('button, a, input, select, textarea')
      .evaluateAll((elements) => {
        const viewportWidth = document.documentElement.clientWidth;
        return elements
          .filter((element) => {
            const style = window.getComputedStyle(element);
            const scrollContainer = element.closest('#app-shell-nav, [class*="overflow-x-auto"]');
            return (
              style.visibility !== 'hidden' &&
              style.display !== 'none' &&
              !element.closest('.sr-only') &&
              !scrollContainer
            );
          })
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              label: element.getAttribute('aria-label') || element.textContent?.trim().slice(0, 60),
              left: rect.left,
              right: rect.right,
              isWithinViewport: rect.left >= 0 && rect.right <= viewportWidth,
            };
          })
          .filter((control) => !control.isWithinViewport);
      });

    await testInfo.attach('authenticated-mobile-visible-control-bounds.json', {
      body: JSON.stringify(visibleControlBounds, null, 2),
      contentType: 'application/json',
    });
    expect(visibleControlBounds).toEqual([]);

    const layoutMetrics = await page.locator('body').evaluate((element) => ({
      viewportWidth: element.clientWidth,
      contentWidth: element.scrollWidth,
      viewportHeight: element.clientHeight,
      contentHeight: element.scrollHeight,
      hasHorizontalOverflow: element.scrollWidth > element.clientWidth,
    }));

    await testInfo.attach('authenticated-mobile-layout-metrics.json', {
      body: JSON.stringify(layoutMetrics, null, 2),
      contentType: 'application/json',
    });
    const screenshotPath = testInfo.outputPath('authenticated-mobile-page.png');
    await page.screenshot({ path: screenshotPath, fullPage: true, animations: 'disabled' });
    await testInfo.attach('authenticated-mobile-page.png', {
      path: screenshotPath,
      contentType: 'image/png',
    });
    expect(browserErrors).toEqual([]);
    expect(layoutMetrics.hasHorizontalOverflow).toBe(false);
  });
}
