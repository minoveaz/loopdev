import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';

if (fs.existsSync('.env.local')) {
  process.loadEnvFile('.env.local');
}

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'pnpm --filter loopdev-os start',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      ...process.env,
      NEXT_PUBLIC_E2E_AUTH_BYPASS: 'true',
      PLAYWRIGHT_E2E_AUTH_BYPASS: 'true',
    },
  },
  globalSetup: './e2e/auth.setup.mjs',
  projects: [
    {
      name: 'desktop',
      testMatch: [
        '**/*.smoke.spec.mjs',
        '**/*.accessibility.spec.mjs',
        '**/*.visual.spec.mjs',
        '**/shell-showcase.contract.spec.mjs',
        '**/authenticated.application.spec.mjs',
        '**/phase5.certification.spec.mjs',
        '**/marketing-studio.dam.spec.mjs',
      ],
      testIgnore: ['**/responsive.visual.spec.mjs'],
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      testMatch: [
        '**/*.mobile-diagnostic.spec.mjs',
        '**/*.visual.spec.mjs',
        '**/authenticated.mobile.spec.mjs',
      ],
      workers: 1,
      use: {
        ...devices['iPhone 13'],
        browserName: 'chromium',
        snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}-{projectName}{ext}',
      },
    },
    {
      name: 'mobile-compact',
      testMatch: [
        '**/*.mobile-diagnostic.spec.mjs',
        '**/*.visual.spec.mjs',
        '**/authenticated.mobile.spec.mjs',
      ],
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
