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
        file: 'marketing-studio.dam.spec.mjs',
        domain: 'marketing-studio',
        profile: 'domain',
        projects: ['desktop'],
      },
    ],
  };

  assert.deepEqual(filesForSelection('domain:marketing-studio', catalog), [
    'e2e/marketing-studio.dam.spec.mjs',
  ]);
});

test('uses Playwright discovery for full certification', () => {
  assert.equal(filesForSelection('full'), null);
});
