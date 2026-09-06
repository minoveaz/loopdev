import { describe, expect, it } from 'vitest';
import {
  resolveSalesCrmActiveModuleId,
  resolveSalesCrmCanvasMode,
  shouldShowLeadContextPanel,
} from '@/suites/sales-crm/shellRouting';

const modules = [
  { moduleId: 'contacts', route: '/sales-crm/contacts' },
  { moduleId: 'leads', route: '/sales-crm/leads' },
  { moduleId: 'pipeline', route: '/sales-crm/pipeline' },
];

describe('resolveSalesCrmActiveModuleId', () => {
  it('matches the exact module route', () => {
    expect(resolveSalesCrmActiveModuleId(modules, '/sales-crm/leads')).toBe('leads');
  });

  it('keeps the Leads module active for the capture sub-route', () => {
    expect(resolveSalesCrmActiveModuleId(modules, '/sales-crm/leads/new')).toBe('leads');
  });

  it('returns undefined for a route outside any module', () => {
    expect(resolveSalesCrmActiveModuleId(modules, '/sales-crm')).toBeUndefined();
  });

  it('keeps Pipeline active for opportunity workspace and create routes', () => {
    expect(resolveSalesCrmActiveModuleId(modules, '/sales-crm/opportunities/new')).toBe('pipeline');
    expect(resolveSalesCrmActiveModuleId(modules, '/sales-crm/opportunities/00000000-0000-4000-9000-000000000002')).toBe('pipeline');
  });
});

describe('resolveSalesCrmCanvasMode', () => {
  it('uses split for the Leads list', () => {
    expect(resolveSalesCrmCanvasMode('/sales-crm/leads')).toBe('split');
  });

  it('uses full-bleed for the Lead capture workflow', () => {
    expect(resolveSalesCrmCanvasMode('/sales-crm/leads/new')).toBe('full-bleed');
  });

  it('uses workspace for a direct Lead record', () => {
    expect(resolveSalesCrmCanvasMode('/sales-crm/leads/00000000-0000-4000-9000-000000000002')).toBe(
      'workspace',
    );
  });

  it('uses the split task inbox while keeping unrelated routes on data', () => {
    expect(resolveSalesCrmCanvasMode('/sales-crm/contacts')).toBe('data');
    expect(resolveSalesCrmCanvasMode('/sales-crm/tasks')).toBe('split');
  });

  it('uses board for Pipeline and overview for My day', () => {
    expect(resolveSalesCrmCanvasMode('/sales-crm/pipeline')).toBe('board');
    expect(resolveSalesCrmCanvasMode('/sales-crm/tasks/today')).toBe('overview');
  });

  it('resolves the remaining approved CRM canvas recipes', () => {
    expect(resolveSalesCrmCanvasMode('/sales-crm/pipeline/list')).toBe('data');
    expect(resolveSalesCrmCanvasMode('/sales-crm/opportunities/00000000-0000-4000-9000-000000000002')).toBe('workspace');
    expect(resolveSalesCrmCanvasMode('/sales-crm/opportunities/new')).toBe('full-bleed');
    expect(resolveSalesCrmCanvasMode('/sales-crm/tasks/00000000-0000-4000-9000-000000000002')).toBe('workspace');
    expect(resolveSalesCrmCanvasMode('/sales-crm/tasks/new')).toBe('full-bleed');
  });
});

describe('shouldShowLeadContextPanel', () => {
  it('only shows the Lead context panel on the list route', () => {
    expect(shouldShowLeadContextPanel('/sales-crm/leads')).toBe(true);
    expect(shouldShowLeadContextPanel('/sales-crm/leads/new')).toBe(false);
  });
});
