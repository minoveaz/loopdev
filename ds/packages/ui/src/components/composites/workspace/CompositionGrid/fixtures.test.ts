import { describe, expect, it } from 'vitest';
import {
  BOARD_WORKSPACE_COMPOSITION,
  DATA_WORKSPACE_COMPOSITION,
  RECORD_WORKSPACE_COMPOSITION,
  SUITE_OVERVIEW_COMPOSITION,
} from './fixtures';

describe('composition reference fixtures', () => {
  it('keeps SuiteOverview regions aligned with the declarative grid', () => {
    expect(SUITE_OVERVIEW_COMPOSITION.recipe).toBe('SuiteOverview');
    expect(SUITE_OVERVIEW_COMPOSITION.grid.columns).toBe(12);
    expect(SUITE_OVERVIEW_COMPOSITION.regions.map(({ id }) => id)).toEqual([
      'summary',
      'visual-canvas',
      'metrics',
      'activity',
    ]);
    expect(SUITE_OVERVIEW_COMPOSITION.regions.map(({ colSpan }) => colSpan)).toEqual([7, 5, 12, 12]);
  });

  it('keeps DataWorkspace filters, table and pagination declarative', () => {
    expect(DATA_WORKSPACE_COMPOSITION.regions.map(({ slot, component }) => ({ slot, component }))).toEqual([
      { slot: 'filters', component: 'FilterBar' },
      { slot: 'content', component: 'DataTable' },
      { slot: 'pagination', component: 'Pagination' },
    ]);
  });

  it('keeps RecordWorkspace record, inspector and activity regions declarative', () => {
    expect(RECORD_WORKSPACE_COMPOSITION.regions.map(({ slot, component }) => ({ slot, component }))).toEqual([
      { slot: 'record', component: 'RecordPanel' },
      { slot: 'inspector', component: 'InspectorPanel' },
      { slot: 'activity', component: 'ActivityFeed' },
    ]);
  });

  it('keeps BoardWorkspace toolbar, board and metrics regions declarative', () => {
    expect(BOARD_WORKSPACE_COMPOSITION.regions.map(({ slot, component }) => ({ slot, component }))).toEqual([
      { slot: 'toolbar', component: 'ModuleToolbar' },
      { slot: 'board', component: 'KanbanBoard' },
      { slot: 'metrics', component: 'MetricCardGrid' },
    ]);
  });
});