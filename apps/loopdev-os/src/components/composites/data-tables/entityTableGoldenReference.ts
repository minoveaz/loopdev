export const entityTableGoldenReference = {
  id: 'entity-table-golden-v1',
  sourceComponent: 'EntityTable',
  approval: 'pending-human-visual-approval',
  planes: {
    context: {
      required: true,
      responsibilities: ['title', 'result-count', 'primary-action'],
    },
    controls: {
      required: true,
      responsibilities: ['search', 'frequent-filters', 'advanced-filters', 'clear-actions'],
    },
    querySummary: {
      requiredWhenActive: true,
      responsibilities: ['active-filter-chips', 'selection-summary'],
    },
    data: {
      required: true,
      responsibilities: ['caption', 'column-header', 'identity-first-rows', 'semantic-status', 'row-actions'],
    },
    navigation: {
      required: true,
      responsibilities: ['result-range', 'current-page', 'rows-per-page', 'previous-next'],
    },
  },
  visualTokens: {
    primaryText: 'text-main',
    secondaryText: 'text-muted',
    technicalBoundary: 'border-technical',
    rowBoundary: 'border-subtle',
    selectedState: 'primary',
    status: ['success', 'warning', 'danger', 'info', 'neutral'],
  },
  responsive: {
    viewports: {
      desktop: { width: 1440, height: 900 },
      mobile: { width: 390, height: 844 },
      mobileCompact: { width: 320, height: 800 },
    },
    pageOverflow: false,
    mobileRepresentation: 'semantic-identity-first-row',
    minimumInteractiveTarget: 44,
  },
  sharedSlots: [
    'context',
    'controls',
    'querySummary',
    'data',
    'navigation',
    'states',
    'responsiveRow',
  ],
  entityTableSpecific: {
    title: 'Customer records',
    columns: ['name', 'segment', 'owner', 'status', 'email', 'region', 'updated'],
    actions: ['create-customer', 'assign-owner', 'export', 'open-record'],
    filters: ['status', 'segment', 'owner'],
  },
} as const;

export type EntityTableGoldenReference = typeof entityTableGoldenReference;
