import { chromium } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3001';
const route = '/launchpad';

export async function runE2EPreflight() {
  let lastError;
  for (let attempt = 1; attempt <= 10; attempt += 1) {
    try {
      const response = await fetch(new URL(route, baseURL));
      if (!response.ok) {
        throw new Error(`E2E preflight failed: ${response.status} ${response.statusText} for ${route}`);
      }
      lastError = undefined;
      break;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  if (lastError) {
    throw lastError;
  }

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(new URL(route, baseURL).toString(), { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: /Initialize your Work Context/i }).waitFor();
  } finally {
    await browser.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await runE2EPreflight();
  console.log(`E2E preflight passed: ${baseURL}${route}`);
}