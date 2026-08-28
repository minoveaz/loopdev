import type {
  SuiteCanvasGeometryPreset,
  SuiteCanvasMode,
} from '../../workspace/SuiteCanvas';
import type { ModuleContextPanelPresentation, ModuleContextPanelWidth } from '../ModuleContextPanel';
import type { ModuleContextSidebarWidth } from '../ModuleContextSidebar';

export interface SuiteShellModePreset {
  canvasGeometry: SuiteCanvasGeometryPreset;
  contextSidebarWidth: ModuleContextSidebarWidth;
  contextPanelWidth: ModuleContextPanelWidth;
  contextPanelPresentation: ModuleContextPanelPresentation;
  contextHeaderRows: 1 | 2 | 3;
  contextFooterRows: 1 | 2 | 3;
  contextContentScrollable: boolean;
  contextSidebarHasCollapseControl: true;
}

export const SUITE_SHELL_MODE_PRESETS: Record<SuiteCanvasMode, SuiteShellModePreset> = {
  overview: {
    canvasGeometry: {
      mode: 'overview',
      geometry: 'bounded',
      columns: 12,
      mobileColumns: 4,
      maxWidth: 'bounded',
      padding: 'comfortable',
      gap: 'md',
      overflowX: 'hidden',
      overflowY: 'canvas',
    },
    contextSidebarWidth: 'standard',
    contextPanelWidth: 'standard',
    contextPanelPresentation: 'inline',
    contextHeaderRows: 1,
    contextFooterRows: 1,
    contextContentScrollable: true,
    contextSidebarHasCollapseControl: true,
  },
  data: {
    canvasGeometry: {
      mode: 'data',
      geometry: 'bounded',
      columns: 12,
      mobileColumns: 4,
      maxWidth: 'bounded',
      padding: 'comfortable',
      gap: 'md',
      overflowX: 'hidden',
      overflowY: 'canvas',
    },
    contextSidebarWidth: 'standard',
    contextPanelWidth: 'standard',
    contextPanelPresentation: 'inline',
    contextHeaderRows: 1,
    contextFooterRows: 1,
    contextContentScrollable: true,
    contextSidebarHasCollapseControl: true,
  },
  workspace: {
    canvasGeometry: {
      mode: 'workspace',
      geometry: 'bounded',
      columns: 12,
      mobileColumns: 4,
      maxWidth: 'bounded',
      padding: 'comfortable',
      gap: 'md',
      overflowX: 'hidden',
      overflowY: 'canvas',
    },
    contextSidebarWidth: 'standard',
    contextPanelWidth: 'standard',
    contextPanelPresentation: 'inline',
    contextHeaderRows: 1,
    contextFooterRows: 1,
    contextContentScrollable: true,
    contextSidebarHasCollapseControl: true,
  },
  split: {
    canvasGeometry: {
      mode: 'split',
      geometry: 'split',
      columns: 8,
      mobileColumns: 4,
      maxWidth: 'full',
      padding: 'none',
      gap: 'md',
      overflowX: 'hidden',
      overflowY: 'canvas',
    },
    contextSidebarWidth: 'standard',
    contextPanelWidth: 'standard',
    contextPanelPresentation: 'inline',
    contextHeaderRows: 1,
    contextFooterRows: 1,
    contextContentScrollable: true,
    contextSidebarHasCollapseControl: true,
  },
  board: {
    canvasGeometry: {
      mode: 'board',
      geometry: 'wide',
      columns: 12,
      mobileColumns: 4,
      maxWidth: 'wide',
      padding: 'comfortable',
      gap: 'lg',
      overflowX: 'zone-only',
      overflowY: 'canvas',
    },
    contextSidebarWidth: 'standard',
    contextPanelWidth: 'standard',
    contextPanelPresentation: 'inline',
    contextHeaderRows: 1,
    contextFooterRows: 1,
    contextContentScrollable: true,
    contextSidebarHasCollapseControl: true,
  },
  'full-bleed': {
    canvasGeometry: {
      mode: 'full-bleed',
      geometry: 'full-bleed',
      columns: 12,
      mobileColumns: 4,
      maxWidth: 'full',
      padding: 'none',
      gap: 'sm',
      overflowX: 'hidden',
      overflowY: 'canvas',
    },
    contextSidebarWidth: 'standard',
    contextPanelWidth: 'standard',
    contextPanelPresentation: 'inline',
    contextHeaderRows: 1,
    contextFooterRows: 1,
    contextContentScrollable: true,
    contextSidebarHasCollapseControl: true,
  },
};
