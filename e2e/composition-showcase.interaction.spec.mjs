import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

test('RecordWorkspace exposes keyboard focus and read-only action guards', async ({ page }) => {
  await page.goto('/composition-showcase?recipe=RecordWorkspace');
  await expect(page.locator('#main-content')).toBeVisible();

  const state = page.getByLabel('Review state');
  await state.selectOption('read-only');
  await expect(page.getByRole('button', { name: 'Edit record' })).toBeDisabled();

  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
});

test('BoardWorkspace disables card creation for forbidden access', async ({ page }) => {
  await page.goto('/composition-showcase?recipe=BoardWorkspace');
  await page.getByLabel('Review state').selectOption('forbidden');
  await expect(page.getByRole('button', { name: 'Add card' })).toBeDisabled();
  await expect(page.getByText('Board restricted')).toBeVisible();
});

test('showcase honors reduced motion preferences', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/composition-showcase?recipe=SuiteOverview');
  await expect(page.locator('#main-content')).toBeVisible();

  const reducedMotionRule = await page.evaluate(() => {
    return [...document.styleSheets]
      .flatMap((sheet) => {
        try {
          return [...sheet.cssRules];
        } catch {
          return [];
        }
      })
      .some((rule) => rule.cssText.includes('prefers-reduced-motion'));
  });

  expect(reducedMotionRule).toBe(true);
});

test('CreativeEditor exposes active tools and a focusable timeline', async ({ page }) => {
  await page.goto('/composition-showcase?recipe=CreativeEditor');
  await expect(page.getByRole('button', { name: 'Edit' })).toHaveAttribute('aria-pressed', 'true');
  const timeline = page.getByRole('region', { name: 'SuiteCanvas' }).getByLabel('Timeline tracks');
  await timeline.focus();
  await expect(timeline).toBeFocused();
});

test('SplitWorkspace keeps list and detail context visible', async ({ page }) => {
  await page.goto('/composition-showcase?recipe=SplitWorkspace');
  await expect(page.getByRole('heading', { name: 'Accounts', exact: true })).toBeVisible();
  await expect(page.getByText('Selected record')).toBeVisible();
  await expect(page.getByText('Selection context')).toBeVisible();
});

test('showcase audits light and dark semantic surfaces', async ({ page }) => {
  await page.goto('/composition-showcase?recipe=SuiteOverview');
  const root = page.locator('[data-showcase-theme]');
  const themeButton = page.getByRole('button', { name: 'Switch to dark theme' });
  const lightColors = await root.evaluate((element) => {
    const surface = element.querySelector('[class*="bg-"]');
    return surface ? getComputedStyle(surface).color : getComputedStyle(element).color;
  });

  await themeButton.click();
  await expect(root).toHaveAttribute('data-showcase-theme', 'dark');
  await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible();
  const darkColors = await root.evaluate((element) => getComputedStyle(element).color);
  expect(darkColors).not.toBe(lightColors);
});

test('showcase reports navigation and performance without sensitive data', async ({ page }) => {
  const events = [];
  await page.exposeFunction('captureShowcaseEvent', (event) => events.push(event));
  await page.addInitScript(() => {
    window.addEventListener('loopdev:showcase:view', (event) => window.captureShowcaseEvent(event.detail));
    window.addEventListener('loopdev:showcase:navigation', (event) => window.captureShowcaseEvent(event.detail));
  });
  await page.goto('/composition-showcase?recipe=RecordWorkspace');
  await page.getByText('SuiteOverview', { exact: true }).first().click();
  await expect(page).toHaveURL(/recipe=SuiteOverview/);
  await expect.poll(() => events.length).toBeGreaterThan(0);
  const measures = await page.evaluate(() => performance.getEntriesByType('measure').map((entry) => entry.name));
  expect(measures.some((name) => name.includes('composition-showcase'))).toBe(true);
  expect(JSON.stringify(events)).not.toMatch(/password|token|email|access_token/i);
});