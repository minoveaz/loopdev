import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';

if (fs.existsSync('.env.local')) {
  process.loadEnvFile('.env.local');
}

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3001';
const e2eCatalog = JSON.parse(fs.readFileSync('config/e2e-validation-catalog.json', 'utf8'));

function testMatchForProject(project) {
  return e2eCatalog.specs
    .filter((spec) => spec.projects.includes(project))
    .map((spec) => `**/${spec.file}`);
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.PLAYWRIGHT_REPORTER ?? 'line',
  use: {
    baseURL,
    actionTimeout: 15000,
    navigationTimeout: 30000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  expect: {
    timeout: 10000,
  },
  webServer: {
    command: 'pnpm --filter loopdev-os dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      ...process.env,
      NEXT_PUBLIC_E2E_AUTH_BYPASS: 'true',
      PLAYWRIGHT_E2E_AUTH_BYPASS: 'true',
      NEXT_PUBLIC_CRM_CONTACTS_FIXTURE: 'true',
      NEXT_PUBLIC_VISUAL_CERTIFICATION: 'true',
      NEXT_DIST_DIR: '.next-e2e',
      PORT: '3001',
    },
  },
  globalSetup: './e2e/auth.setup.mjs',
  projects: [
    {
      name: 'desktop',
      testMatch: testMatchForProject('desktop'),
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      testMatch: testMatchForProject('mobile'),
      workers: 1,
      use: {
        ...devices['iPhone 13'],
        browserName: 'chromium',
        snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}-{projectName}{ext}',
      },
    },
    {
      name: 'mobile-compact',
      testMatch: testMatchForProject('mobile-compact'),
      workers: 1,
      use: {
        ...devices['iPhone 13'],
        browserName: 'chromium',
        viewport: { width: 320, height: 800 },
        snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}-{projectName}{ext}',
      },
    },
  ],
});
