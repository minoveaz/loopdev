import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 1024, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

test('shell showcase remains contained at the project viewport', async ({ page }) => {
    const viewport = page.viewportSize();
    const viewportName = viewport?.width && viewport.width <= 320 ? 'mobile-compact' : viewport?.width && viewport.width < 768 ? 'mobile' : viewport?.width === 1024 ? 'tablet' : 'desktop';
    await page.goto('/shell-showcase');
    await expect(page.locator('body')).toBeVisible();

    const dimensions = await page.locator('body').evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      clientHeight: element.clientHeight,
    }));

    expect(dimensions.scrollWidth, `shell overflows horizontally at ${viewportName}`).toBeLessThanOrEqual(
      dimensions.clientWidth,
    );
    expect(dimensions.clientHeight).toBeGreaterThan(0);

});

test('shell showcase has no serious accessibility violations', async ({ page }) => {
  await page.goto('/shell-showcase');
  await expect(page.locator('body')).toBeVisible();

  const results = await new AxeBuilder({ page })
    .disableRules(['color-contrast'])
    .analyze();
  const seriousViolations = results.violations.filter((violation) =>
    ['critical', 'serious'].includes(violation.impact),
  );

  expect(seriousViolations).toEqual([]);
});

test('iPad breakpoint keeps the suite navigation toggle visible beside the logo', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('/shell-showcase');

  const toggle = page.getByRole('button', { name: 'Toggle navigation' });
  await expect(toggle).toBeVisible();

  const geometry = await toggle.evaluate((element) => {
    const header = element.closest('header');
    const headerRect = header?.getBoundingClientRect();
    const toggleRect = element.getBoundingClientRect();
    return {
      isInsideHeader: Boolean(headerRect && toggleRect.top >= headerRect.top && toggleRect.bottom <= headerRect.bottom),
      headerTop: headerRect?.top,
      headerBottom: headerRect?.bottom,
      toggleTop: toggleRect.top,
      toggleBottom: toggleRect.bottom,
    };
  });

  expect(geometry.isInsideHeader).toBe(true);
});
