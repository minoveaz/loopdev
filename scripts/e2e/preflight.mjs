import { chromium } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3001';
const route = '/composition-showcase?recipe=CertificationLab&component=CRMPrimitives';

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
    await page.getByRole('heading', { name: 'Shared components', exact: true }).waitFor();
    await page.getByTestId('crm-filter-dropdown-fixture').waitFor();
  } finally {
    await browser.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await runE2EPreflight();
  console.log(`E2E preflight passed: ${baseURL}${route}`);
}