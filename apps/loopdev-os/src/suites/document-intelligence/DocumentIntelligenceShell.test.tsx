import { describe, expect, it } from 'vitest';

import { shouldShowWorkbenchContextPanel } from './DocumentIntelligenceShell';

describe('DocumentIntelligenceShell context panel visibility', () => {
  it('keeps the preparation and processing surfaces focused on the document', () => {
    expect(shouldShowWorkbenchContextPanel('preparation')).toBe(false);
    expect(shouldShowWorkbenchContextPanel('processing')).toBe(false);
  });

  it('shows extraction context only once review or recovery needs it', () => {
    expect(shouldShowWorkbenchContextPanel('review')).toBe(true);
    expect(shouldShowWorkbenchContextPanel('error')).toBe(true);
  });
});
