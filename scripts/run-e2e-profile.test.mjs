import assert from 'node:assert/strict';
import test from 'node:test';
import { filesForSelection } from './run-e2e-profile.mjs';

test('selects smoke files from the E2E catalog', () => {
  assert.deepEqual(filesForSelection('smoke'), ['e2e/shell.smoke.spec.mjs']);
});

test('selects a domain without selecting unrelated domains', () => {
  const catalog = {
    specs: [
      {
        file: 'contacts-form.certification.spec.mjs',
        domain: 'crm',
        profile: 'domain',
        projects: ['desktop', 'mobile', 'mobile-compact'],
      },
    ],
  };

  assert.deepEqual(filesForSelection('domain:crm', catalog), [
    'e2e/contacts-form.certification.spec.mjs',
  ]);
});

test('uses Playwright discovery for full certification', () => {
  assert.equal(filesForSelection('full'), null);
});
