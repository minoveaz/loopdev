import { test, expect } from '@playwright/test';

test.describe('shell-showcase canonical contract', () => {
  test('preserves the shell navigation model', async ({ page }) => {
    await page.goto('/shell-showcase');

    await expect(page.getByRole('heading', { name: 'SuiteHome canvas' })).toBeVisible();
    const organizationButton = page.getByRole('button', { name: 'Select organization' });
    await expect(organizationButton).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sales & CRM' })).toBeVisible();

    await organizationButton.click();
    await expect(page.getByRole('menuitem', { name: /Northstar Labs/ })).toBeVisible();
    await page.getByRole('menuitem', { name: /Northstar Labs/ }).click();

    await expect(page.getByRole('button', { name: /Northstar Labs/ })).toBeVisible();
    await expect
      .poll(() =>
        page
          .locator('html')
          .evaluate((element) =>
            getComputedStyle(element).getPropertyValue('--lpd-color-brand-primary').trim(),
          ),
      )
      .toBe('#57c19a');

    await page.getByRole('button', { name: 'Sales & CRM' }).click();
    const suiteMenu = page.getByRole('menu', { name: 'Sales & CRM' });
    const selectedSuite = suiteMenu.getByRole('menuitem', { name: 'Sales & CRM' });

    await expect(selectedSuite).toBeVisible();
    await expect(selectedSuite).toHaveClass(/bg-\[var\(--lpd-color-bg-primary-subtle\)\]/);
    await expect(suiteMenu.getByRole('menuitem', { name: 'Marketing Studio' })).toBeVisible();
    await expect(suiteMenu.getByRole('menuitem', { name: 'Volver al Launchpad' })).toBeVisible();

    await suiteMenu.getByRole('menuitem', { name: 'Volver al Launchpad' }).click();
    await expect(page).toHaveURL(/\/launchpad$/);
  });

  test('hydrates canvas modes from the URL and preserves browser history', async ({ page }) => {
    await page.goto('/shell-showcase?canvasMode=board');

    await expect(page.getByRole('heading', { name: 'Work queue' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Board', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(page.locator('main')).toHaveCount(1);

    await page.getByRole('menuitem', { name: 'Data' }).click();
    await expect(page).toHaveURL(/\/shell-showcase\?canvasMode=data$/);
    await expect(page.getByRole('heading', { name: 'Resource directory' })).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(/\/shell-showcase\?canvasMode=board$/);
    await expect(page.getByRole('heading', { name: 'Work queue' })).toBeVisible();
  });
});
