import assert from 'node:assert/strict';
import test from 'node:test';
import { runPhase, validationPhases } from './validate-ci.mjs';

function phase(id) {
  return validationPhases.find((candidate) => candidate.id === id);
}

test('keeps shared contracts as a barrier before compilation and production build', () => {
  const contractIndex = validationPhases.findIndex((candidate) => candidate.id === 'contracts');
  const certificationIndex = validationPhases.findIndex(
    (candidate) => candidate.id === 'certification',
  );

  assert.ok(contractIndex >= 0);
  assert.equal(certificationIndex, contractIndex + 1);
  assert.deepEqual(phase('contracts').steps, [
    ['Build shared contracts', ['turbo', 'run', 'build', '--filter=@loopdev/contracts']],
  ]);
});

test('runs the expensive independent certification controls in parallel', () => {
  assert.deepEqual(
    phase('certification').steps.map(([label]) => label),
    ['Typecheck', 'Unit and component tests', 'Production build'],
  );
});

test('keeps static checks parallel without moving them behind executable gates', () => {
  assert.deepEqual(
    phase('static').steps.map(([label]) => label),
    ['Documentation links', 'Registry catalog synchronization', 'Lint', 'Frontend quality gate'],
  );
});

test('waits for all parallel controls before returning a failed phase', async () => {
  const started = [];
  const completed = [];
  const result = await runPhase(
    {
      label: 'test phase',
      steps: [
        ['failing control', []],
        ['slow control', []],
      ],
    },
    async ([label]) => {
      started.push(label);
      await new Promise((resolve) => setTimeout(resolve, label === 'slow control' ? 10 : 1));
      if (label === 'failing control') throw new Error('expected failure');
      completed.push(label);
    },
  );

  assert.equal(result, false);
  assert.deepEqual(started, ['failing control', 'slow control']);
  assert.deepEqual(completed, ['slow control']);
});
