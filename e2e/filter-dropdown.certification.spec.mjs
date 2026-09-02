import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

async function openFilterDropdown(page) {
  await page.goto('/composition-showcase?recipe=CertificationLab&component=CRMPrimitives');
  await expect(page.getByRole('heading', { name: 'Shared components', exact: true })).toBeVisible();
  const evidencePanel = page.locator('aside').filter({ hasText: 'Evidence record' });
  if (await evidencePanel.count()) {
    await evidencePanel.getByRole('button').first().click();
  }
  const fixture = page.getByTestId('crm-filter-dropdown-fixture');
  await expect(fixture).toBeVisible();
  return fixture;
}

test.describe('FilterDropdown certification', () => {
  test('smoke renders the CRM FilterDropdown fixture with an accessible Segment trigger', async ({
    page,
  }) => {
    const fixture = await openFilterDropdown(page);
    await expect(fixture.getByRole('button', { name: 'Segment' })).toHaveAttribute(
      'aria-haspopup',
      'menu',
    );
  });

  test('opens, toggles an option, stays open and closes with Escape', async ({ page }) => {
    const fixture = await openFilterDropdown(page);
    const trigger = fixture.locator('button[aria-label="Segment"]');
    await trigger.click();
    const enterprise = page.getByRole('menuitemcheckbox', { name: 'Enterprise' });
    await expect(enterprise).toBeVisible();
    await enterprise.click();
    await expect(trigger).toContainText('1');
    await expect(enterprise).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  });

  for (const theme of ['light', 'dark']) {
    test(`${theme} keeps the fixture within the configured viewport`, async ({
      page,
    }, testInfo) => {
      await page.goto('/composition-showcase?recipe=CertificationLab&component=CRMPrimitives');
      await page.evaluate((selectedTheme) => {
        window.localStorage.setItem('lpd-theme', selectedTheme);
        document.documentElement.classList.toggle('dark', selectedTheme === 'dark');
      }, theme);
      await page.reload();
      const fixture = await openFilterDropdown(page);
      const dimensions = await fixture.evaluate((element) => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
      }));
      expect(dimensions.scrollWidth, `overflow in ${testInfo.project.name}`).toBeLessThanOrEqual(
        dimensions.clientWidth,
      );
      await expect(fixture.getByRole('button', { name: 'Segment' })).toBeVisible();
    });
  }
});
