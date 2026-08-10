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
  /** Extensiones del header persistente sin romper los slots legacy de la suite. */
  platformHeaderProps?: Omit<PlatformHeaderProps, 'identitySlot' | 'isInert'>;
  mobileNavigation?: {
    items: MobileSuiteNavItem[];
    onNavigate: (item: MobileSuiteNavItem) => void;
    onOpenNavigation?: () => void;
  };
  onExitToOS: () => void;
  onNavigate: (route: NavRouteRef) => void;
  onToggleNavMode: () => void;
  onAction?: (actionId: string) => void;
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
