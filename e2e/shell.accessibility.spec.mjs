import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const accessibleRoutes = [
  { name: 'login', path: '/login' },
  { name: 'launchpad', path: '/launchpad' },
];

for (const route of accessibleRoutes) {
  test(`${route.name} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(route.path);
    await expect(page.locator('body')).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze();
    const seriousViolations = accessibilityScanResults.violations.filter((violation) =>
      ['critical', 'serious'].includes(violation.impact),
    );

    expect(seriousViolations).toEqual([]);
  });
}
