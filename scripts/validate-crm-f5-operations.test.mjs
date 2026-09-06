import assert from 'node:assert/strict';
import test from 'node:test';
import { requiredSections } from './validate-crm-f5-operations.mjs';

test('requires every operational F5 evidence section', () => {
  assert.deepEqual(requiredSections, [
    '## Gate de CI',
    '## Staging reproducible',
    '## Observabilidad',
    '## Continuidad y rollback',
    '## Evidencia y bloqueos',
  ]);
});
