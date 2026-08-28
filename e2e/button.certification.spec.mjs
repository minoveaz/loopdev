import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

const buttonVariants = ['primary', 'secondary', 'outline', 'ghost', 'energy', 'danger'];
const buttonSizes = ['sm', 'md', 'lg'];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 1024, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

async function openButtonCatalog(page, theme) {
  await page.goto('/composition-showcase?recipe=CertificationLab&component=CRMPrimitives');
  await page.evaluate((selectedTheme) => {
    window.localStorage.setItem('lpd-theme', selectedTheme);
    document.documentElement.classList.toggle('dark', selectedTheme === 'dark');
  }, theme);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Shared components', exact: true })).toBeVisible();
  await expect(
    page.locator('button[data-control="button"]', { hasText: 'Primary {primary}' }).first(),
  ).toBeVisible();
}

test.describe('Button UI/UX certification', () => {
  for (const viewport of viewports) {
    for (const theme of ['light', 'dark']) {
      test(`${viewport.name} ${theme} renders the public matrix without overflow`, async ({
        page,
      }, testInfo) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await openButtonCatalog(page, theme);

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

        for (const variant of buttonVariants) {
          await expect(
            page.locator('button[data-control="button"]', { hasText: `{${variant}}` }).first(),
          ).toBeVisible();
        }
        for (const size of buttonSizes) {
          await expect(
            page.locator('button[data-control="button"]', { hasText: `{${size}}` }).first(),
          ).toBeVisible();
        }
        await expect(
          page
            .locator('button[data-control="button"]', { hasText: 'Loading {isLoading: true}' })
            .first(),
        ).toBeDisabled();
        await expect(
          page
            .locator('button[data-control="button"]', { hasText: 'Loading {isLoading: true}' })
            .first(),
        ).toHaveAttribute('aria-busy', 'true');
        await expect(
          page
            .locator('button[data-control="button"]', { hasText: 'Disabled {disabled: true}' })
            .first(),
        ).toBeDisabled();
        await expect(
          page.locator('button[data-control="button"]', { hasText: 'Full width' }).first(),
        ).toHaveClass(/w-full/);
        expect(dimensions.scrollWidth, `overflow at ${viewport.name}`).toBeLessThanOrEqual(
          dimensions.clientWidth,
        );
        expect(layoutShift, `initial CLS at ${viewport.name}`).toBeLessThan(0.1);

        await page.screenshot({
          path: testInfo.outputPath(`button-${theme}-${viewport.name}.png`),
          fullPage: true,
          animations: 'disabled',
        });
      });
    }
  }

  test('supports keyboard focus and activation for an enabled action', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openButtonCatalog(page, 'light');
    const action = page
      .locator('button[data-control="button"]', { hasText: 'Primary {primary}' })
      .first();
    await action.focus();
    await expect(action).toBeFocused();
    await expect(action).toHaveClass(/focus-visible:ring-2/);
    await page.keyboard.press('Enter');
    await expect(action).toBeFocused();
  });
});
