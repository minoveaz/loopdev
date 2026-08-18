import assert from 'node:assert/strict';
import test from 'node:test';
import { buildCommands, resolveImpact } from './validate-package-impact.mjs';

function commandList(files) {
  return buildCommands(resolveImpact(files).packageRules).map((args) => args.join(' '));
}

test('ignores documentation-only changes, including package documentation', () => {
  const impact = resolveImpact(['docs/package-lifecycle.md', 'ds/packages/ui/README.md']);

  assert.deepEqual(impact.packageIds, []);
  assert.equal(impact.globalFallback, false);
  assert.equal(impact.hasTargetedValidation, false);
});

test('validates UI and its web consumer without global fallback', () => {
  const impact = resolveImpact(['ds/packages/ui/src/index.ts']);
  const commands = commandList(['ds/packages/ui/src/index.ts']);

  assert.deepEqual(impact.packageIds, ['ui']);
  assert.equal(impact.globalFallback, false);
  assert.ok(commands.includes('--filter @loopdev/ui test -- --maxWorkers=1'));
  assert.ok(commands.includes('--filter loopdev-os build'));
});

test('forces global fallback for contracts and validates declared consumers', () => {
  const files = ['packages/contracts/src/platform/navigation.ts'];
  const impact = resolveImpact(files);
  const commands = commandList(files);

  assert.deepEqual(impact.packageIds, ['contracts']);
  assert.equal(impact.globalFallback, true);
  assert.ok(commands.includes('--filter @loopdev/ui build'));
  assert.ok(commands.includes('--filter loopdev-os build'));
  assert.ok(commands.includes('--filter loopdev-mobile typecheck'));
  assert.ok(commands.includes('--filter loopdev-mobile test'));
});

test('keeps package validation in dependency order for mixed changes', () => {
  const commands = commandList([
    'ds/packages/tokens/src/index.ts',
    'ds/packages/ui/src/index.ts',
    'packages/contracts/src/platform/navigation.ts',
  ]);

  assert.ok(
    commands.indexOf('--filter @loopdev/contracts build') <
      commands.indexOf('--filter @loopdev/ui build'),
  );
});

test('can omit native mobile consumers for a shell-only validation scope', () => {
  const files = ['packages/contracts/src/platform/navigation.ts'];
  const skippedConsumers = new Set(['@loopdev/ui-native', 'loopdev-mobile']);
  const commands = buildCommands(resolveImpact(files).packageRules, skippedConsumers).map((args) =>
    args.join(' '),
  );

  assert.ok(commands.includes('--filter @loopdev/ui build'));
  assert.ok(commands.includes('--filter loopdev-os build'));
  assert.ok(!commands.includes('--filter @loopdev/ui-native typecheck'));
  assert.ok(!commands.includes('--filter loopdev-mobile typecheck'));
  assert.ok(!commands.includes('--filter loopdev-mobile test'));
});

test('routes mobile application changes to native mobile validation only', () => {
  const impact = resolveImpact(['apps/loopdev-mobile/src/App.tsx']);

  assert.deepEqual(impact.packageIds, []);
  assert.equal(impact.globalFallback, false);
  assert.equal(impact.mobile, true);
});

test('keeps web application changes out of native mobile and global fallback', () => {
  const impact = resolveImpact([
    'apps/loopdev-os/src/app/page.tsx',
    'e2e/entity-table.certification.spec.mjs',
  ]);

  assert.equal(impact.globalFallback, false);
  assert.equal(impact.frontend, true);
  assert.equal(impact.mobile, false);
});

test('leaves Supabase-only changes to its specialized workflow', () => {
  const impact = resolveImpact(['supabase/migrations/20260812000000_example.sql']);

  assert.deepEqual(impact.packageIds, []);
  assert.equal(impact.globalFallback, false);
  assert.equal(impact.mobile, false);
});

test('uses global fallback for root, shared configuration, and unknown changes', () => {
  for (const file of ['pnpm-lock.yaml', 'ds/packages/eslint-config/src/index.js', 'unknown.ts']) {
    const impact = resolveImpact([file]);
    assert.equal(impact.globalFallback, true, file);
  }
});
