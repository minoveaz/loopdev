import assert from 'node:assert/strict';
import test from 'node:test';
import { validateVisualContractIntent } from './validate-visual-contract-intent.mjs';

const validIntent = {
  kind: 'visual-contract-change',
  surfaces: ['apps/loopdev-os/src/app/login'],
  userIntent: 'Improve compact mobile login hierarchy.',
  evidence: {
    functional: 'Login behavior remains covered.',
    accessibility: 'Axe checks remain green.',
    visual: 'Reviewed light and dark snapshots.',
  },
  approvedBy: 'design-system',
};

test('accepts complete visual contract intent', () => {
  assert.deepEqual(validateVisualContractIntent(validIntent), []);
});

test('requires functional, accessibility, and visual evidence', () => {
  const errors = validateVisualContractIntent({ ...validIntent, evidence: {} });

  assert.deepEqual(errors, [
    'evidence.functional is required',
    'evidence.accessibility is required',
    'evidence.visual is required',
  ]);
});

test('rejects visual intent without an affected surface or approval', () => {
  const errors = validateVisualContractIntent({ ...validIntent, surfaces: [], approvedBy: '' });

  assert.ok(errors.includes('surfaces must contain at least one affected surface'));
  assert.ok(errors.includes('approvedBy is required'));
});