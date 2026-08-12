import assert from 'node:assert/strict';
import test from 'node:test';
import { summarizeObservations, validateObservations } from './validate-observations.mjs';

const validDocument = {
  version: 1,
  observations: [
    {
      id: 'web-1',
      representativeClass: 'web-source-change',
      source: 'PR #1',
      durationSeconds: 120,
      outcome: 'passed',
      selectedControls: ['visual-contract-intent'],
      skippedControls: [{ id: 'database-contract', reason: 'not affected' }],
      falseSkip: false,
      falseRun: false,
      duplicateRisks: [],
    },
  ],
};

test('accepts a complete calibration observation', () => {
  assert.deepEqual(validateObservations(validDocument), []);
});

test('summarizes duration and routing findings', () => {
  assert.deepEqual(summarizeObservations(validDocument), {
    count: 1,
    averageDurationSeconds: 120,
    falseSkips: 0,
    falseRuns: 0,
    duplicateRisks: 0,
  });
});

test('rejects incomplete or duplicated observations', () => {
  const invalid = {
    ...validDocument,
    observations: [
      validDocument.observations[0],
      { ...validDocument.observations[0], durationSeconds: -1 },
    ],
  };

  const errors = validateObservations(invalid);
  assert.ok(errors.includes('observations[1].id must be unique'));
  assert.ok(errors.includes('observations[1].durationSeconds must be a non-negative number'));
});