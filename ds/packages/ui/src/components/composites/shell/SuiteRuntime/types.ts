import type { ReactNode } from 'react';
import type { ModuleConfig, SuiteConfig } from '@loopdev/contracts';
import type { NavMode, NavRouteRef } from '@loopdev/contracts';
import type { SuiteShellProps } from '../SuiteShell/types';
import type { ModuleContextSidebarWidth } from '../ModuleContextSidebar';
import type { ModuleContextPanelWidth } from '../ModuleContextPanel';
import type { SuiteCanvasProps } from '../../workspace/SuiteCanvas';

export type SuiteModuleRenderer = (module: ModuleConfig) => ReactNode;
export type SuiteModuleContextRenderer = (module: ModuleConfig) => ReactNode;
export type SuiteModuleContextFooterRenderer = (module: ModuleConfig) => ReactNode;
export type SuiteModuleContextPanelRenderer = (module: ModuleConfig) => ReactNode;
export type SuiteModuleContextPanelFooterRenderer = (module: ModuleConfig) => ReactNode;

export interface SuiteRuntimeProps {
  config: SuiteConfig;
  activeModuleId?: string;
  moduleRenderers?: Record<string, SuiteModuleRenderer>;
  moduleContextRenderers?: Record<string, SuiteModuleContextRenderer>;
  moduleContextFooterRenderers?: Record<string, SuiteModuleContextFooterRenderer>;
  moduleContextLabels?: Partial<Record<string, string>>;
  moduleContextWidths?: Partial<Record<string, ModuleContextSidebarWidth>>;
  moduleContextPanelRenderers?: Record<string, SuiteModuleContextPanelRenderer>;
  moduleContextPanelFooterRenderers?: Record<string, SuiteModuleContextPanelFooterRenderer>;
  moduleContextPanelLabels?: Partial<Record<string, string>>;
  moduleContextPanelWidths?: Partial<Record<string, ModuleContextPanelWidth>>;
  moduleContextPanelOnClose?: () => void;
  moduleContextSidebarCollapsed?: boolean;
  moduleContextSidebarShowCollapsedTrigger?: boolean;
  moduleContextSidebarOnCollapsedChange?: (collapsed: boolean) => void;
  children?: ReactNode;
  leftSlot: ReactNode;
  centerSlot: ReactNode;
  rightSlot: ReactNode;
  profileSlot?: ReactNode;
  platformHeaderProps?: SuiteShellProps['platformHeaderProps'];
  onNavigate: (route: NavRouteRef) => void;
  contextualSidebarAction?: ReactNode | ((isRail: boolean) => ReactNode);
  onNavModeChange?: (mode: Exclude<NavMode, 'hidden'>) => void;
  appShellProps?: SuiteShellProps['appShellProps'];
  canvasProps?: Omit<SuiteCanvasProps, 'children'>;
}
