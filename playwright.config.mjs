import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';

if (fs.existsSync('.env.local')) {
  process.loadEnvFile('.env.local');
}

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3001';

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
      NEXT_DIST_DIR: '.next-e2e',
      PORT: '3001',
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
        '**/composition-showcase.interaction.spec.mjs',
        '**/filters-actions.certification.spec.mjs',
        '**/search-input.certification.spec.mjs',
        '**/input.certification.spec.mjs',
        '**/search-input.certification.spec.mjs',
        '**/button.certification.spec.mjs',
        '**/icon-button.certification.spec.mjs',
        '**/filter-dropdown.certification.spec.mjs',
        '**/crm-primitives.certification.spec.mjs',
        '**/contacts-form.certification.spec.mjs',
        '**/entity-table.certification.spec.mjs',
        '**/activity-table.certification.spec.mjs',
        '**/selection-table.certification.spec.mjs',
        '**/command-dialog.certification.spec.mjs',
        '**/shell-showcase.contract.spec.mjs',
        '**/authenticated.application.spec.mjs',
        '**/phase5.certification.spec.mjs',
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
        '**/input.certification.spec.mjs',
        '**/search-input.certification.spec.mjs',
        '**/button.certification.spec.mjs',
        '**/icon-button.certification.spec.mjs',
        '**/filter-dropdown.certification.spec.mjs',
        '**/crm-primitives.certification.spec.mjs',
        '**/contacts-form.certification.spec.mjs',
        '**/entity-table.certification.spec.mjs',
        '**/activity-table.certification.spec.mjs',
        '**/selection-table.certification.spec.mjs',
        '**/command-dialog.certification.spec.mjs',
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
        '**/input.certification.spec.mjs',
        '**/button.certification.spec.mjs',
        '**/icon-button.certification.spec.mjs',
        '**/filter-dropdown.certification.spec.mjs',
        '**/crm-primitives.certification.spec.mjs',
        '**/contacts-form.certification.spec.mjs',
        '**/entity-table.certification.spec.mjs',
        '**/activity-table.certification.spec.mjs',
        '**/selection-table.certification.spec.mjs',
        '**/command-dialog.certification.spec.mjs',
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
