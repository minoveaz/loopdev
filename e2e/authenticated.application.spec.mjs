import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

test('Quant Ops opens and cancels the exchange connection flow', async ({ page }) => {
  await page.goto('/quant-ops/exchanges');
  await expect(page.getByRole('button', { name: 'Connect_New_Exchange' })).toBeVisible();

  await page.getByRole('button', { name: 'Connect_New_Exchange' }).click();
  await expect(page.getByText('Link_Broker_Account')).toBeVisible();

  await page.getByRole('button', { name: 'Cancel_Action' }).click();
  await expect(page.getByText('Link_Broker_Account')).toHaveCount(0);
});
