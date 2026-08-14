import type { ReactNode } from 'react';
import type { AppShellProps } from '../AppShell/types';
import type { PlatformHeaderProps } from '../PlatformHeader/types';
import type {
  AccessMap,
  LayoutContext,
  NavMode,
  NavRouteRef,
  NavigationSchema,
  TelemetryMap,
} from '@loopdev/contracts';
import type { MobileSuiteNavItem } from '../../navigation/MobileSuiteNav';
import type { ModuleContextSidebarWidth } from '../ModuleContextSidebar';
import type { ModuleContextPanelWidth } from '../ModuleContextPanel';

export interface SuiteShellProps {
  schema: NavigationSchema;
  navMode: NavMode;
  activeModuleId?: string;
  accessMap: AccessMap;
  telemetry?: TelemetryMap;
  context?: LayoutContext;
  leftSlot: ReactNode;
  centerSlot: ReactNode;
  rightSlot: ReactNode;
  profileSlot?: ReactNode;
  moduleContextSlot?: ReactNode;
  moduleContextFooterSlot?: ReactNode;
  moduleContextLabel?: string;
  moduleContextWidth?: ModuleContextSidebarWidth;
  moduleContextPanelSlot?: ReactNode;
  moduleContextPanelFooterSlot?: ReactNode;
  moduleContextPanelLabel?: string;
  moduleContextPanelWidth?: ModuleContextPanelWidth;
  /** Extensiones del header persistente sin romper los slots legacy de la suite. */
  platformHeaderProps?: Omit<PlatformHeaderProps, 'identitySlot' | 'isInert'>;
  mobileNavigation?: {
    items: MobileSuiteNavItem[];
    onNavigate: (item: MobileSuiteNavItem) => void;
    onOpenNavigation?: () => void;
  };
  onNavigate: (route: NavRouteRef) => void;
  contextualSidebarAction?: ReactNode;
  onNavModeChange?: (mode: Exclude<NavMode, 'hidden'>) => void;
  isHeaderInert?: boolean;
  appShellProps?: Pick<
    AppShellProps,
    | 'config'
    | 'overlaySlot'
    | 'bannerSlot'
    | 'footerSlot'
    | 'onToggleLeftSidebar'
    | 'onToggleRightSidebar'
    | 'onRequestCloseNav'
    | 'onRequestCloseContext'
  >;
  children: ReactNode;
}
