import assert from 'node:assert/strict';
import test from 'node:test';
import { isVisualIntentFile, isVisualSnapshot, validateVisualChange } from './validate-visual-change.mjs';

const validIntent = {
  kind: 'visual-contract-change',
  surfaces: ['e2e/login-snapshots'],
  userIntent: 'Update the approved login visual direction.',
  evidence: {
    functional: 'Login tests pass.',
    accessibility: 'Axe checks pass.',
    visual: 'Reviewed updated baselines.',
  },
  approvedBy: 'design-system',
};

test('detects Playwright snapshot paths and snap files', () => {
  assert.equal(isVisualSnapshot('e2e/login-snapshots/login-light.png'), true);
  assert.equal(isVisualSnapshot('components/button.snap'), true);
  assert.equal(isVisualSnapshot('components/Button.tsx'), false);
});

test('accepts only the stable visual intent file convention', () => {
  assert.equal(isVisualIntentFile('config/visual-contract-intents/login.json'), true);
  assert.equal(isVisualIntentFile('config/visual-contract-intent.example.json'), false);
  assert.equal(isVisualIntentFile('config/visual-contract-intents/nested/login.json'), false);
});

test('does not require intent when no snapshot changes are present', () => {
  assert.deepEqual(validateVisualChange(['apps/loopdev-os/src/app/page.tsx']), {
    required: false,
    snapshotFiles: [],
    errors: [],
  });
});

test('requires valid intent when snapshots change', () => {
  const result = validateVisualChange(
    ['e2e/login-snapshots/login-light.png'],
    validIntent,
    ['config/visual-contract-intents/login.json'],
  );

  assert.equal(result.required, true);
  assert.deepEqual(result.errors, []);
});

test('rejects snapshot changes without intent', () => {
  const result = validateVisualChange(['e2e/login-snapshots/login-light.png']);

  assert.equal(result.required, true);
  assert.ok(result.errors.includes('exactly one changed config/visual-contract-intents/*.json file is required'));
});

test('rejects multiple changed visual intent files', () => {
  const result = validateVisualChange(
    ['e2e/login-snapshots/login-light.png'],
    undefined,
    ['config/visual-contract-intents/login.json', 'config/visual-contract-intents/signup.json'],
  );

  assert.ok(result.errors.includes('only one changed config/visual-contract-intents/*.json file is allowed'));
});