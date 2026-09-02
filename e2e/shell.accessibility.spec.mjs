import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const accessibleRoutes = [
  { name: 'login', path: '/login', storageState: undefined },
  { name: 'launchpad', path: '/launchpad', storageState: undefined },
];

for (const route of accessibleRoutes) {
  test.describe(route.name, () => {
    test.use({ storageState: route.storageState });

    test(`has no serious accessibility violations on the ${route.name} route`, async ({ page }) => {
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
  });
}
