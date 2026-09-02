import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.use({ storageState: 'playwright/.auth/user.json' });

const A11Y_RECIPES = [
  'SuiteOverview',
  'DataWorkspace',
  'SplitWorkspace',
  'RecordWorkspace',
  'BoardWorkspace',
  'ImmersiveWorkflow',
  'CreativeEditor',
  'CertificationLab',
];

const RECIPES = [
  'SuiteOverview',
  'DataWorkspace',
  'SplitWorkspace',
  'RecordWorkspace',
  'BoardWorkspace',
  'ImmersiveWorkflow',
  'CreativeEditor',
  'CertificationLab',
];

const STATES = [
  'ready',
  'loading',
  'empty',
  'error',
  'forbidden',
  'read-only',
  'offline',
  'stale',
  'conflict',
];

test('renders every shared review state across all reference recipes', async ({ page }) => {
  for (const recipe of RECIPES) {
    await page.goto(`/composition-showcase?recipe=${recipe}`);
    const main = page.locator('main[data-showcase-state]');

    await expect(main).toBeVisible();
    await expect(page.getByLabel('Review state')).toBeVisible();

    for (const state of STATES) {
      const stateSelect = page.getByLabel('Review state');
      await expect(stateSelect).toBeVisible();
      await stateSelect.selectOption(state);
      await expect(main).toHaveAttribute('data-showcase-state', state);
      await expect(page.getByTestId('showcase-state-status')).toHaveText(`State: ${state}`);
    }
  }
});

test('global avatar opens the shared profile context panel', async ({ page }) => {
  await page.goto('/composition-showcase?recipe=SuiteOverview');

  const profileTrigger = page.getByRole('button', { name: 'Open profile' });
  await expect(profileTrigger).toBeVisible();
  await profileTrigger.click();

  await expect(page.getByRole('complementary', { name: 'Context Panel' })).toBeVisible();
  await expect(page.getByRole('complementary', { name: 'Context Panel' })).toContainText('Alex Morgan');
  await expect(page.getByRole('complementary', { name: 'Context Panel' }).getByRole('menu')).toHaveCount(0);
});

test('RecordWorkspace exposes keyboard focus and read-only action guards', async ({ page }) => {
  await page.goto('/composition-showcase?recipe=RecordWorkspace');
  await expect(page.locator('#main-content')).toBeVisible();

  const state = page.getByLabel('Review state');
  await state.selectOption('read-only');
  await expect(page.getByRole('button', { name: 'Edit record' })).toBeDisabled();

  await state.focus();
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus-visible')).toHaveCount(1);
});

test('BoardWorkspace disables card creation for forbidden access', async ({ page }) => {
  await page.goto('/composition-showcase?recipe=BoardWorkspace');
  await page.getByLabel('Review state').selectOption('forbidden');
  await expect(page.getByRole('button', { name: 'Add card' })).toBeDisabled();
  await expect(page.getByText('Board restricted')).toBeVisible();
});

test('DataWorkspace opens the selected workspace context and clears selection', async ({ page }) => {
  await page.goto('/composition-showcase?recipe=DataWorkspace');
  await page.getByText('Northstar Labs', { exact: true }).first().click();

  const panel = page.getByTestId('module-context-panel');
  await expect(panel).toBeVisible();
  await expect(panel).toContainText('Northstar Labs');

  await page.getByRole('button', { name: 'Clear selection' }).click();
  await expect(panel).toBeHidden();
});

test('ImmersiveWorkflow guards continuation for read-only and stale states', async ({ page }) => {
  await page.goto('/composition-showcase?recipe=ImmersiveWorkflow');
  const continueButton = page.getByRole('button', { name: 'Continue workflow' });

  await page.getByLabel('Review state').selectOption('read-only');
  await expect(continueButton).toBeDisabled();

  await page.getByLabel('Review state').selectOption('stale');
  await expect(continueButton).toBeDisabled();
});

test('CertificationLab opens its component inventory and navigates to CRM primitives', async ({ page }) => {
  await page.goto('/composition-showcase?recipe=CertificationLab');
  const toolbar = page.getByRole('toolbar', { name: 'Module toolbar' });
  await expect(toolbar.getByRole('button', { name: 'Open components' })).toBeVisible();
  await toolbar.getByRole('button', { name: 'Open components' }).click();
  await expect(page.getByRole('heading', { name: 'Certification Lab' })).toBeVisible();

  await page.getByRole('button', { name: /CRM Primitives/ }).click();
  await expect(page).toHaveURL(/certification-lab\/CRMPrimitives/);
  await expect(page.getByRole('heading', { name: 'Shared components' })).toBeVisible();
});

test('passes serious Axe checks for every reference recipe', async ({ page }) => {
  for (const recipe of A11Y_RECIPES) {
    await page.goto(`/composition-showcase?recipe=${recipe}`);
    await expect(page.locator('main[data-showcase-state]')).toBeVisible();

    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze();
    const seriousViolations = results.violations.filter((violation) =>
      ['critical', 'serious'].includes(violation.impact),
    );

    expect(seriousViolations, `${recipe} has serious accessibility violations`).toEqual([]);
  }
});

test('reference recipes remain usable under data and content pressure', async ({ page }) => {
  await page.goto('/composition-showcase?recipe=DataWorkspace');
  const search = page.getByPlaceholder('Search workspaces');
  await search.fill('Northstar Labs '.repeat(40));
  await expect(page.getByText('No workspaces match the current filters.')).toBeVisible();

  const tableShell = page.locator('main[data-showcase-state]');
  const dataDimensions = await tableShell.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(dataDimensions.scrollWidth, 'long table filter text overflows the workspace').toBeLessThanOrEqual(
    dataDimensions.clientWidth,
  );

  await page.goto('/composition-showcase?recipe=BoardWorkspace');
  const board = page.getByText('Customer success workflow');
  await expect(board).toBeVisible();
  const boardDimensions = await page.locator('main[data-showcase-state]').evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(boardDimensions.scrollWidth, 'board pressure escapes its owning canvas').toBeLessThanOrEqual(
    boardDimensions.clientWidth,
  );
});

test('reference recipe navigation and state changes stay within the performance budget', async ({ page }) => {
  await page.goto('/composition-showcase?recipe=DataWorkspace');
  await expect(page.locator('main[data-showcase-state]')).toBeVisible();
  await page.getByLabel('Review state').selectOption('loading');
  await page.getByLabel('Review state').selectOption('ready');
  const measures = await page.evaluate(() => performance.getEntriesByType('measure')
    .filter((entry) => entry.name.startsWith('composition-showcase:'))
    .map((entry) => entry.duration));
  expect(measures.length).toBeGreaterThan(0);
  expect(Math.max(...measures), 'composition measure budget exceeded').toBeLessThan(2000);
});

test('reference recipes use tokenized computed typography and no inline color literals', async ({ page }) => {
  await page.goto('/composition-showcase?recipe=SuiteOverview');
  const typography = await page.locator('main[data-showcase-state]').evaluate((root) => {
    const textNode = [...root.querySelectorAll('h1, h2, h3, p, span, button, label')]
      .find((element) => element.textContent?.trim());
    if (!textNode) return null;
    const style = getComputedStyle(textNode);
    const inlineColors = [...root.querySelectorAll('[style]')]
      .map((element) => element.getAttribute('style') ?? '')
      .filter((value) => /#[0-9a-f]{3,8}\b/i.test(value));
    return {
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      lineHeight: style.lineHeight,
      inlineColors,
    };
  });

  expect(typography).not.toBeNull();
  expect(typography.fontFamily).not.toBe('');
  expect(typography.fontSize).not.toBe('');
  expect(typography.lineHeight).not.toBe('normal');
  expect(typography.inlineColors).toEqual([]);
});

test('honors reduced-motion preferences across the composition showcase', async ({ page }) => {
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
  await page.evaluate(() => {
    localStorage.setItem('lpd-theme', 'light');
    document.documentElement.classList.remove('dark');
  });
  await page.reload();
  const themeButton = page.getByRole('button', { name: /toggle theme/i });
  await expect(themeButton).toBeVisible();
  const lightIsDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  expect(lightIsDark).toBe(false);

  await themeButton.click();
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(true);
  await expect(page.getByRole('button', { name: /toggle theme/i })).toBeVisible();

  const darkIsPersisted = await page.evaluate(() => localStorage.getItem('lpd-theme'));
  expect(darkIsPersisted).toBe('dark');

  await page.reload();
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(true);
  const darkColors = await page.locator('body').evaluate((element) => {
    return getComputedStyle(element).backgroundColor;
  });
  expect(darkColors).not.toBe('rgb(255, 255, 255)');
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