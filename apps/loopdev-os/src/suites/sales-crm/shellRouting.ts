import type { SuiteCanvasMode } from '@loopdev/ui';

/**
 * Route-driven canvas/module resolution for the Sales & CRM suite.
 *
 * The Leads module spans three canvas recipes on the same `leads` sidebar
 * entry: the list (`SplitWorkspace`), the capture workflow
 * (`ImmersiveWorkflow`) and the record detail (`RecordWorkspace`).
 * `ModuleConfig.shell.canvasMode` is a single value per
 * `moduleId`, so it cannot express a different canvas per sub-route while
 * keeping `leads` as the active sidebar module. These helpers centralize
 * that per-pathname resolution instead of forking `moduleId` per sub-route,
 * which would drop the `Leads` sidebar highlight while creating a Lead.
 */

export const LEADS_LIST_ROUTE = '/sales-crm/leads';
export const LEADS_CAPTURE_ROUTE = '/sales-crm/leads/new';
export const LEADS_DETAIL_ROUTE = '/sales-crm/leads/';

export type SalesCrmModuleRoute = { moduleId: string; route: string };

/**
 * Resolves the active `moduleId` used for sidebar highlighting and module
 * zone renderers, matching a route or any of its sub-routes.
 */
export function resolveSalesCrmActiveModuleId(
  modules: readonly SalesCrmModuleRoute[],
  pathname: string,
): string | undefined {
  return modules.find(
    (module) => module.route === pathname || pathname.startsWith(`${module.route}/`),
  )?.moduleId;
}

/**
 * Resolves the Leads canvas mode for a given pathname. Falls back to `data`,
 * the suite-wide default, for every other Sales & CRM route.
 */
export function resolveSalesCrmCanvasMode(pathname: string): SuiteCanvasMode {
  if (pathname === LEADS_CAPTURE_ROUTE) return 'full-bleed';
  if (pathname.startsWith(LEADS_DETAIL_ROUTE) && pathname !== LEADS_CAPTURE_ROUTE)
    return 'workspace';
  if (pathname === LEADS_LIST_ROUTE) return 'split';
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
