import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

const variants = ['neutral', 'primary', 'danger', 'success', 'ghost', 'energy'];
const sizes = ['sm', 'md', 'lg'];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 1024, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

async function openIconButtonCatalog(page, theme) {
  await page.goto('/composition-showcase?recipe=CertificationLab&component=CRMPrimitives');
  await page.evaluate((selectedTheme) => {
    window.localStorage.setItem('lpd-theme', selectedTheme);
    document.documentElement.classList.toggle('dark', selectedTheme === 'dark');
  }, theme);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Shared components', exact: true })).toBeVisible();
  await expect(page.locator('button[aria-label="Energy {energy}"]')).toBeVisible();
}

test.describe('IconButton UI/UX certification', () => {
  for (const viewport of viewports) {
    for (const theme of ['light', 'dark']) {
      test(`${viewport.name} ${theme} renders variants, sizes and states without overflow`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await openIconButtonCatalog(page, theme);

        const layoutShift = await page.evaluate(() => {
          let total = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) total += entry.value;
            }
          }).observe({ type: 'layout-shift', buffered: true });
          return total;
        });
        const dimensions = await page.locator('#main-content').evaluate((element) => ({
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
        }));

        for (const variant of variants) {
          await expect(page.locator(`button[aria-label="${variant[0].toUpperCase()}${variant.slice(1)} {${variant}}"]`)).toBeVisible();
        }
        for (const size of sizes) {
          const label = `${size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'} {${size}}`;
          await expect(page.locator(`button[aria-label="${label}"]`)).toBeVisible();
        }
        await expect(page.locator('button[aria-label="Loading {isLoading: true}"]')).toBeDisabled();
        await expect(page.locator('button[aria-label="Loading {isLoading: true}"]')).toHaveAttribute('aria-busy', 'true');
        await expect(page.locator('button[aria-label="Disabled {disabled: true}"]')).toBeDisabled();
        expect(dimensions.scrollWidth, `overflow at ${viewport.name}`).toBeLessThanOrEqual(dimensions.clientWidth);
        expect(layoutShift, `initial CLS at ${viewport.name}`).toBeLessThan(0.1);

        await page.screenshot({
          path: testInfo.outputPath(`icon-button-${theme}-${viewport.name}.png`),
          fullPage: true,
          animations: 'disabled',
        });
      });
    }
  }

  test('keeps the accessible name and focus visible for keyboard users', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openIconButtonCatalog(page, 'light');
    const action = page.locator('button[aria-label="Primary {primary}"]');
    await action.focus();
    await expect(action).toBeFocused();
    await expect(action).toHaveAttribute('aria-label', 'Primary {primary}');
    await expect(action).toHaveClass(/focus-visible:ring-2/);
  });
});
