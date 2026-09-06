import type { SuiteCanvasMode } from '@loopdev/ui';

/**
 * Route-driven canvas/module resolution for the Sales & CRM suite.
 *
 * CRM modules span multiple canvas recipes while retaining one sidebar entry:
 * Leads use split/full-bleed/workspace, Pipeline uses board/data/workspace/
 * full-bleed, and Tasks use split/overview/workspace/full-bleed.
 * `ModuleConfig.shell.canvasMode` is a single value per
 * `moduleId`, so it cannot express a different canvas per sub-route while
 * keeping `leads` as the active sidebar module. These helpers centralize
 * that per-pathname resolution instead of forking `moduleId` per sub-route,
 * which would drop the module sidebar highlight while opening a record workflow.
 */

export const LEADS_LIST_ROUTE = '/sales-crm/leads';
export const LEADS_CAPTURE_ROUTE = '/sales-crm/leads/new';
export const LEADS_DETAIL_ROUTE = '/sales-crm/leads/';
export const CONTACT_DETAIL_ROUTE = '/sales-crm/contacts/';
export const PIPELINE_ROUTE = '/sales-crm/pipeline';
export const PIPELINE_LIST_ROUTE = '/sales-crm/pipeline/list';
export const OPPORTUNITY_DETAIL_ROUTE = '/sales-crm/opportunities/';
export const OPPORTUNITY_CREATE_ROUTE = '/sales-crm/opportunities/new';
export const TASKS_ROUTE = '/sales-crm/tasks';
export const TASKS_TODAY_ROUTE = '/sales-crm/tasks/today';
export const TASK_DETAIL_ROUTE = '/sales-crm/tasks/';
export const TASK_CREATE_ROUTE = '/sales-crm/tasks/new';

export type SalesCrmModuleRoute = { moduleId: string; route: string };

/**
 * Resolves the active `moduleId` used for sidebar highlighting and module
 * zone renderers, matching a route or any of its sub-routes.
 */
export function resolveSalesCrmActiveModuleId(
  modules: readonly SalesCrmModuleRoute[],
  pathname: string,
): string | undefined {
  if (pathname.startsWith(OPPORTUNITY_DETAIL_ROUTE) || pathname === OPPORTUNITY_CREATE_ROUTE) {
    return modules.find((module) => module.moduleId === 'pipeline')?.moduleId;
  }
  return modules.find(
    (module) => module.route === pathname || pathname.startsWith(`${module.route}/`),
  )?.moduleId;
}

/**
 * Resolves the Sales & CRM canvas mode for a given pathname. Falls back to
 * `data`, the suite-wide default, for every other route.
 */
export function resolveSalesCrmCanvasMode(pathname: string): SuiteCanvasMode {
  if (pathname === LEADS_CAPTURE_ROUTE) return 'full-bleed';
  if (pathname.startsWith(CONTACT_DETAIL_ROUTE)) return 'workspace';
  if (pathname.startsWith(LEADS_DETAIL_ROUTE) && pathname !== LEADS_CAPTURE_ROUTE)
    return 'workspace';
  if (pathname === LEADS_LIST_ROUTE) return 'split';
  if (pathname === PIPELINE_ROUTE) return 'board';
  if (pathname === PIPELINE_LIST_ROUTE) return 'data';
  if (pathname === OPPORTUNITY_CREATE_ROUTE || pathname === TASK_CREATE_ROUTE) return 'full-bleed';
  if (
    pathname.startsWith(OPPORTUNITY_DETAIL_ROUTE) ||
    (pathname.startsWith(TASK_DETAIL_ROUTE) && pathname !== TASKS_TODAY_ROUTE)
  )
    return 'workspace';
  if (pathname === TASKS_TODAY_ROUTE) return 'overview';
  if (pathname === TASKS_ROUTE) return 'split';
  return 'data';
}

/**
 * The Lead context panel (`ModuleContextPanel`) is a `SplitWorkspace` zone
 * only. `ImmersiveWorkflow` (full-bleed) keeps module controls in the canvas
 * and has no context panel by default (PLATFORM_SHELL_ZONE_CONTRACT.md), so
 * it must stay hidden on the capture route even if a lead is still selected
 * from a previous list visit.
 */
export function shouldShowLeadContextPanel(pathname: string): boolean {
  return pathname === LEADS_LIST_ROUTE;
}
