import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildGithubOutputs,
  buildValidationPlan,
  changedFilesFromCommit,
  changedFilesFromWorktree,
  renderGithubSummary,
} from './validate-plan.mjs';

function gitFixture(responses) {
  return (_command, args) => responses.get(args.join(' ')) ?? '';
}

test('explains a shell change and skips unrelated domains', () => {
  const plan = buildValidationPlan([
    'ds/packages/ui/src/components/composites/shell/SuiteShell.tsx',
  ]);

  assert.ok(plan.selected.some((check) => check.id === 'shell'));
  assert.ok(plan.selected.some((check) => check.id === 'packages'));
  assert.equal(plan.fullFallback, false);
  assert.ok(plan.skipped.some((check) => check.id === 'mobile' && check.reason === 'not affected'));
});

test('selects the full fallback for workflow changes', () => {
  const plan = buildValidationPlan(['.github/workflows/ci.yml']);

  assert.equal(plan.fullFallback, true);
  assert.match(plan.fallbackReason, /workflow configuration/);
});

test('keeps cross-domain shell changes on full certification', () => {
  const plan = buildValidationPlan([
    '.github/workflows/ci.yml',
    'apps/loopdev-mobile/package.json',
    'apps/loopdev-mobile/__tests__/App.test.tsx',
    'apps/loopdev-os/src/app/shell-showcase/page.tsx',
    'ds/packages/ui/src/components/composites/shell/SuiteCanvas.tsx',
    'e2e/shell.visual.spec.mjs',
    'packages/contracts/src/platform/shell.ts',
    'pnpm-lock.yaml',
  ]);

  assert.equal(plan.fullFallback, true);
  for (const domain of ['mobile', 'shell', 'web', 'packages']) {
    assert.ok(
      plan.selected.some((check) => check.id === domain),
      domain,
    );
    assert.ok(!plan.skipped.some((check) => check.id === domain), domain);
  }
});

test('keeps documentation-only changes explainable without executable checks', () => {
  const plan = buildValidationPlan(['docs/testing-guide.md']);

  assert.deepEqual(plan.selected, []);
  assert.equal(plan.fullFallback, false);
  assert.ok(plan.note?.includes('no registered executable surface'));
});

test('keeps a documentation edit isolated from an earlier branch fallback', () => {
  const worktreePlan = buildValidationPlan(['docs/testing-guide.md']);
  const branchPlan = buildValidationPlan(['pnpm-lock.yaml', 'docs/testing-guide.md']);

  assert.deepEqual(worktreePlan.selected, []);
  assert.equal(worktreePlan.fullFallback, false);
  assert.equal(branchPlan.fullFallback, true);
});

test('collects unstaged, staged, and untracked files once for worktree validation', () => {
  const files = changedFilesFromWorktree(
    gitFixture(
      new Map([
        ['diff --name-only', 'docs/guide.md\napps/cimo/src/App.tsx\n'],
        ['diff --name-only --cached', 'apps/cimo/src/App.tsx\ntracks/active/apps/cimo.md\n'],
        ['ls-files --others --exclude-standard', 'notes.txt\n'],
      ]),
    ),
  );

  assert.deepEqual(files, [
    'apps/cimo/src/App.tsx',
    'docs/guide.md',
    'notes.txt',
    'tracks/active/apps/cimo.md',
  ]);
});

test('collects only the specified commit revision for commit validation', () => {
  const files = changedFilesFromCommit(
    'HEAD~2',
    gitFixture(new Map([['diff-tree --no-commit-id --name-only -r HEAD~2', 'docs/guide.md\n']])),
  );

  assert.deepEqual(files, ['docs/guide.md']);
});

test('renders selected and skipped protections without a skip override', () => {
  const summary = renderGithubSummary(
    buildValidationPlan(['ds/packages/ui/src/components/composites/shell/SuiteShell.tsx']),
  );

  assert.match(summary, /## Validation plan/);
  assert.match(summary, /Shell experience \| Selected/);
  assert.match(summary, /Mobile application \| Skipped \| not affected/);
  assert.match(summary, /does not provide a skip override/);
});

test('selects mobile protection without a global fallback for mobile changes', () => {
  const plan = buildValidationPlan(['apps/loopdev-mobile/src/App.tsx']);

  assert.ok(plan.selected.some((check) => check.id === 'mobile'));
  assert.equal(plan.fullFallback, false);
});

test('selects database protection without treating Supabase changes as package impact', () => {
  const plan = buildValidationPlan(['supabase/migrations/20260812_add_policy.sql']);

  assert.ok(plan.selected.some((check) => check.id === 'data'));
  assert.equal(plan.fullFallback, false);
});

test('selects web protection without a global fallback for application changes', () => {
  const plan = buildValidationPlan(['apps/loopdev-os/src/app/page.tsx']);

  assert.ok(plan.selected.some((check) => check.id === 'web'));
  assert.equal(plan.fullFallback, false);
});

test('selects only CIMO validation for a CIMO application change', () => {
  const plan = buildValidationPlan(['apps/cimo/src/App.tsx']);

  assert.ok(plan.selected.some((check) => check.id === 'cimo'));
  assert.ok(!plan.selected.some((check) => check.id === 'mobile'));
  assert.ok(!plan.selected.some((check) => check.id === 'web'));
  assert.equal(plan.fullFallback, false);
});

test('keeps root and workflow changes on full certification', () => {
  const plan = buildValidationPlan(['turbo.json']);

  assert.equal(plan.fullFallback, true);
  assert.match(plan.fallbackReason, /shared repository or workflow configuration/);
});

test('publishes stable outputs for workflow routing', () => {
  const outputs = buildGithubOutputs(buildValidationPlan(['turbo.json']));

  assert.match(outputs, /full_fallback=true/);
  assert.match(outputs, /selected_domains=/);
  assert.match(outputs, /fallback_reason=.*shared repository or workflow configuration/);
  assert.match(outputs, /browser_desktop=false/);
  assert.match(outputs, /browser_mobile=false/);
  assert.match(outputs, /browser_visual=false/);
});

test('selects desktop, mobile, and visual experiences for UI changes', () => {
  const plan = buildValidationPlan(['ds/packages/ui/src/components/Button.tsx']);

  assert.deepEqual(plan.experiences, { desktop: true, mobile: true, visual: true });
});

test('selects only mobile experience for a mobile browser spec', () => {
  const plan = buildValidationPlan(['e2e/authenticated.mobile.spec.mjs']);

  assert.deepEqual(plan.experiences, { desktop: false, mobile: true, visual: false });
});
