import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 1024, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const inputLabels = [
  'Ready {ready}',
  'Focused {focused}',
  'Error {error}',
  'Disabled {disabled}',
  'Loading {loading}',
  'Password {password}',
];

async function openInputCatalog(page, theme) {
  await page.goto('/composition-showcase?recipe=CertificationLab&component=CRMPrimitives');
  await page.evaluate((selectedTheme) => {
    window.localStorage.setItem('lpd-theme', selectedTheme);
    document.documentElement.classList.toggle('dark', selectedTheme === 'dark');
  }, theme);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Shared components', exact: true })).toBeVisible();
  await expect(page.locator('[aria-label="Ready {ready}"]:visible')).toBeVisible();
}

test.describe('Input UI/UX certification', () => {
  for (const viewport of viewports) {
    for (const theme of ['light', 'dark']) {
      test(`${viewport.name} ${theme} renders all declared states without overflow`, async ({
        page,
      }, testInfo) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await openInputCatalog(page, theme);

        const layoutShift = await page.evaluate(() => {
          let total = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) total += entry.value;
            }
          }).observe({ type: 'layout-shift', buffered: true });
          return total;
        });
        const mainDimensions = await page.locator('#main-content').evaluate((element) => ({
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
        }));
        const states = await Promise.all(
          inputLabels.map(async (label) => ({
            label,
            visible: await page.locator(`[aria-label="${label}"]:visible`).isVisible(),
          })),
        );

        expect(states.every((state) => state.visible)).toBe(true);
        await expect(page.locator('[aria-label="Error {error}"]:visible')).toHaveAttribute(
          'aria-invalid',
          'true',
        );
        await expect(page.locator('[aria-label="Disabled {disabled}"]:visible')).toBeDisabled();
        await expect(page.getByRole('status', { name: 'Cargando' }).first()).toBeVisible();
        await expect(page.getByRole('button', { name: 'Mostrar contraseña' })).toBeVisible();
        expect(mainDimensions.scrollWidth, `overflow at ${viewport.name}`).toBeLessThanOrEqual(
          mainDimensions.clientWidth,
        );
        expect(layoutShift, `initial CLS at ${viewport.name}`).toBeLessThan(0.1);

        await page.screenshot({
          path: testInfo.outputPath(`input-${theme}-${viewport.name}.png`),
          fullPage: true,
          animations: 'disabled',
        });
      });
    }
  }

  test('password visibility control is keyboard reachable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openInputCatalog(page, 'light');
    const toggle = page.getByRole('button', { name: 'Mostrar contraseña' });
    await toggle.focus();
    await expect(toggle).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('[aria-label="Password {password}"]:visible')).toHaveAttribute(
      'type',
      'text',
    );
  });
});
