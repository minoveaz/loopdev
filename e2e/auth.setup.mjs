import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const authDirectory = path.resolve('playwright/.auth');
const storageStatePath = path.join(authDirectory, 'user.json');

export default async function globalSetup() {
  process.loadEnvFile('.env.local');

  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error('E2E_TEST_EMAIL and E2E_TEST_PASSWORD are required in .env.local');
  }

  fs.mkdirSync(authDirectory, { recursive: true });
  const browser = await chromium.launch();
  const contextOptions = {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000',
  };

  if (process.env.PLAYWRIGHT_E2E_AUTH_BYPASS === 'true') {
    await browser.close();
    return;
  }

  if (fs.existsSync(storageStatePath)) {
    const existingContext = await browser.newContext({
      ...contextOptions,
      storageState: storageStatePath,
    });
    const existingPage = await existingContext.newPage();
    await existingPage.goto('/launchpad');
    if (existingPage.url().endsWith('/launchpad')) {
      await existingContext.close();
      await browser.close();
      return;
    }
    await existingContext.close();
  }

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  try {
    await page.goto('/login');
    await page.getByLabel('Usuario').fill(email);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('**/launchpad', { timeout: 30000 });
    await page.context().storageState({ path: storageStatePath });
  } finally {
    await browser.close();
  }
}
