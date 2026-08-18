import { describe, expect, it } from 'vitest';
import { entityTableGoldenReference } from './entityTableGoldenReference';

describe('EntityTable golden reference', () => {
  it('defines the reusable CRM composition contract in code', () => {
    expect(Object.keys(entityTableGoldenReference.planes)).toEqual([
      'context',
      'controls',
      'querySummary',
      'data',
      'navigation',
    ]);
    expect(entityTableGoldenReference.sharedSlots).toContain('data');
    expect(entityTableGoldenReference.sharedSlots).toContain('responsiveRow');
    expect(entityTableGoldenReference.responsive.pageOverflow).toBe(false);
    expect(entityTableGoldenReference.responsive.minimumInteractiveTarget).toBe(44);
    expect(entityTableGoldenReference.approval).toBe('pending-human-visual-approval');
  });
});
