import type { ViewComposition } from '@loopdev/contracts';
import { ViewCompositionSchema, validateCompositionAgainstRegistry } from '@loopdev/contracts';

const createFixture = (composition: ViewComposition): ViewComposition => {
  const parsed = ViewCompositionSchema.parse(composition);
  const issues = validateCompositionAgainstRegistry(parsed);
  if (issues.length > 0) {
    throw new Error(`Invalid composition fixture: ${issues.map((issue) => issue.message).join(', ')}`);
  }
  return parsed;
};

export const SUITE_OVERVIEW_COMPOSITION = createFixture({
  recipe: 'SuiteOverview',
  grid: { columns: 12, gap: 'md' },
  regions: [
    { id: 'summary', slot: 'summary', component: 'StatusCardGroup', colSpan: 7, rowSpan: 2 },
    {
      id: 'visual-canvas',
      slot: 'visual-canvas',
      component: 'TechnicalCanvas',
      colSpan: 5,
      rowSpan: 2,
      responsive: { mobile: 'full' },
    },
    { id: 'metrics', slot: 'metrics', component: 'MetricCardGrid', colSpan: 12 },
    { id: 'activity', slot: 'activity', component: 'ActivityFeed', colSpan: 12 },
  ],
});

export const DATA_WORKSPACE_COMPOSITION = createFixture({
  recipe: 'DataWorkspace',
  grid: { columns: 12, gap: 'sm' },
  regions: [
    { id: 'filters', slot: 'filters', component: 'FilterBar', colSpan: 12 },
    { id: 'table', slot: 'content', component: 'DataTable', colSpan: 12 },
    { id: 'pagination', slot: 'pagination', component: 'Pagination', colSpan: 12 },
  ],
});

export const SPLIT_WORKSPACE_COMPOSITION = createFixture({
  recipe: 'SplitWorkspace',
  grid: { columns: 12, gap: 'md' },
  regions: [
    { id: 'toolbar', slot: 'toolbar', component: 'ModuleToolbar', colSpan: 12 },
    { id: 'list', slot: 'list', component: 'DataTable', colSpan: 5 },
    { id: 'detail', slot: 'detail', component: 'RecordPanel', colSpan: 7, rowSpan: 2 },
  ],
});

export const RECORD_WORKSPACE_COMPOSITION = createFixture({
  recipe: 'RecordWorkspace',
  grid: { columns: 12, gap: 'md' },
  regions: [
    { id: 'record', slot: 'record', component: 'RecordPanel', colSpan: 8 },
    { id: 'inspector', slot: 'inspector', component: 'InspectorPanel', colSpan: 4, rowSpan: 2 },
    { id: 'activity', slot: 'activity', component: 'ActivityFeed', colSpan: 8 },
  ],
});

export const BOARD_WORKSPACE_COMPOSITION = createFixture({
  recipe: 'BoardWorkspace',
  grid: { columns: 12, gap: 'md' },
  regions: [
    { id: 'toolbar', slot: 'toolbar', component: 'ModuleToolbar', colSpan: 12 },
    { id: 'board', slot: 'board', component: 'KanbanBoard', colSpan: 9, rowSpan: 3 },
    { id: 'metrics', slot: 'metrics', component: 'MetricCardGrid', colSpan: 3, rowSpan: 3 },
  ],
});

export const IMMERSIVE_WORKFLOW_COMPOSITION = createFixture({
  recipe: 'ImmersiveWorkflow',
  grid: { columns: 12, gap: 'lg' },
  regions: [
    { id: 'workflow', slot: 'workflow', component: 'WorkflowPanel', colSpan: 9, rowSpan: 3 },
    { id: 'actions', slot: 'actions', component: 'ActionBar', colSpan: 3 },
    { id: 'status', slot: 'status', component: 'StatusCard', colSpan: 3 },
  ],
});

export const CREATIVE_EDITOR_COMPOSITION = createFixture({
  recipe: 'CreativeEditor',
  grid: { columns: 12, gap: 'md' },
  regions: [
    { id: 'toolbar', slot: 'header', component: 'EditorToolbar', colSpan: 12 },
    { id: 'assets', slot: 'asset-sidebar', component: 'AssetBrowser', colSpan: 2, rowSpan: 3 },
    { id: 'stage', slot: 'stage', component: 'VideoStage', colSpan: 10, rowSpan: 2 },
    { id: 'transport', slot: 'transport', component: 'TransportControls', colSpan: 10 },
    { id: 'timeline', slot: 'timeline', component: 'Timeline', colSpan: 10, rowSpan: 2 },
    {
      id: 'inspector',
      slot: 'inspector',
      component: 'InspectorPanel',
      colSpan: 2,
      responsive: { mobile: 'hidden' },
    },
  ],
});
