import { describe, expect, it } from 'vitest';

import {
  getWorkbenchHeaderSegments,
  shouldShowWorkbenchContextPanel,
} from './DocumentIntelligenceShell';
import { DOCUMENT_INTELLIGENCE_SUITE_CONFIG } from './config';

describe('DocumentIntelligenceShell context panel visibility', () => {
  it('keeps the preparation and processing surfaces focused on the document', () => {
    expect(shouldShowWorkbenchContextPanel('preparation')).toBe(false);
    expect(shouldShowWorkbenchContextPanel('processing')).toBe(false);
  });

  it('shows extraction context only once review or recovery needs it', () => {
    expect(shouldShowWorkbenchContextPanel('review')).toBe(true);
    expect(shouldShowWorkbenchContextPanel('error')).toBe(true);
  });

  it('derives desktop and mobile breadcrumbs from the active SuiteConfig module', () => {
    const workbenchModule = DOCUMENT_INTELLIGENCE_SUITE_CONFIG.modules.find(
      ({ moduleId }) => moduleId === 'workbench',
    );
    if (!workbenchModule) throw new Error('Document Intelligence workbench module is not configured');

    const { desktopSegments, mobileSegments } = getWorkbenchHeaderSegments(workbenchModule);

    expect(desktopSegments.map(({ label }) => label)).toEqual([
      'Document Intelligence',
      'Document extraction',
    ]);
    expect(mobileSegments).toEqual([
      { id: 'workbench', label: 'Document extraction', isActive: true },
    ]);
  });
});
