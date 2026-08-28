import { test, expect } from '@playwright/test';

const URL = '/composition-showcase?recipe=CertificationLab&component=CRMPrimitives';
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'mobile-compact', width: 320, height: 800 },
];

async function openShowcase(page, theme) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate((selectedTheme) => {
    localStorage.setItem('lpd-theme', selectedTheme);
    document.documentElement.classList.toggle('dark', selectedTheme === 'dark');
  }, theme);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByText('CommandDialog', { exact: true })).toBeVisible();
}

test.describe('CommandDialog certification', () => {
  for (const viewport of viewports) {
    for (const theme of ['light', 'dark']) {
      test(`${viewport.name} ${theme} opens without overflow`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await openShowcase(page, theme);

        const fixture = page.getByTestId('crm-command-dialog-fixture');
        await fixture.getByRole('button').first().click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Command palette' })).toBeFocused();
        await expect(page.getByRole('option', { name: 'Open schema selector O then S' })).toBeVisible();

        const dimensions = await page.locator('#main-content').evaluate((element) => ({
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
        }));
        expect(dimensions.scrollWidth, `overflow at ${viewport.name}`).toBeLessThanOrEqual(dimensions.clientWidth);
        await page.screenshot({ path: testInfo.outputPath(`command-dialog-${theme}-${viewport.name}.png`), fullPage: true, animations: 'disabled' });
      });
    }
  }

  test('filters, skips disabled commands and closes with Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openShowcase(page, 'light');
    await page.getByTestId('crm-command-dialog-fixture').getByRole('button').first().click();

    const input = page.getByRole('textbox', { name: 'Command palette' });
    await input.fill('project');
    await expect(page.getByRole('option', { name: /Connect to your project/ })).toBeVisible();
    await expect(page.getByRole('option', { name: /Connect to your project/ })).toBeDisabled();
    await input.fill('missing');
    await expect(page.getByRole('status')).toHaveText('No commands found.');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});