import assert from 'node:assert/strict';
import test from 'node:test';
import { commandsForPlan } from './validate-local.mjs';

test('runs the conservative full certification for a changed fallback plan', () => {
  const commands = commandsForPlan({ fullFallback: true, selected: [] }, 'changed');

  assert.deepEqual(commands, [['validate:branch-base'], ['validate:ci']]);
});

test('deduplicates controls selected by multiple changed domains', () => {
  const commands = commandsForPlan(
    { fullFallback: false, selected: [{ id: 'shell' }, { id: 'packages' }] },
    'changed',
  );

  assert.deepEqual(commands, [['validate:branch-base'], ['test:shell:changed'], ['validate:package-impact']]);
});

test('selects only the requested experience control', () => {
  const commands = commandsForPlan({ fullFallback: false, selected: [] }, 'experience', 'shell');

  assert.deepEqual(commands, [['validate:branch-base'], ['test:shell:changed']]);
});

test('includes visual intent for changed web surfaces', () => {
  const commands = commandsForPlan(
    { fullFallback: false, selected: [{ id: 'web' }] },
    'changed',
  );

  assert.deepEqual(commands, [
    ['validate:branch-base'],
    ['design:visual:changed'],
  ]);
});

test('rejects an unknown domain instead of silently running broad validation', () => {
  assert.throws(
    () => commandsForPlan({ fullFallback: false, selected: [] }, 'domain', 'unknown'),
    /Unknown domain scope/,
  );
});