import assert from 'node:assert/strict';
import test from 'node:test';
import { validateCiOrchestration, validateRegistry } from './validate-ci-orchestration.mjs';

const registry = {
  checks: [
    {
      id: 'catalog',
      domain: 'platform',
      owner: 'platform',
      risk: 'routing',
      command: 'pnpm validate:catalog',
      modes: ['changed'],
    },
    {
      id: 'full',
      domain: 'repository',
      owner: 'platform',
      risk: 'integration',
      command: 'pnpm validate:ci',
      modes: ['full'],
    },
  ],
};

const workflow = [
  'pnpm test:domain-catalog',
  'pnpm test:e2e-catalog',
  'pnpm test:protected-surfaces',
  'pnpm test:package-impact',
  'pnpm validate:plan',
  '- name: Protect platform-owned shell surfaces',
  "if: github.event_name == 'pull_request'",
].join('\n');

test('accepts a registry and CI workflow with required gates', () => {
  assert.deepEqual(validateCiOrchestration(registry, workflow), []);
});

test('rejects duplicate control commands', () => {
  const invalid = { checks: [...registry.checks, { ...registry.checks[0], id: 'duplicate' }] };

  assert.ok(validateRegistry(invalid).some((error) => error.includes('duplicate command')));
});

test('rejects a workflow missing a catalog gate', () => {
  const errors = validateCiOrchestration(registry, workflow.replace('pnpm test:e2e-catalog', ''));

  assert.ok(errors.some((error) => error.includes('test:e2e-catalog')));
});

test('rejects unscoped protected-surface ownership', () => {
  const errors = validateCiOrchestration(registry, workflow.replace("\nif: github.event_name == 'pull_request'", ''));

  assert.ok(errors.some((error) => error.includes('protected-surface ownership')));
});
