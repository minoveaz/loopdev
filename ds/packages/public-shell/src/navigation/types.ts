import type { PublicNavigation, PublicNavRoute } from '@loopdev/contracts';
import type { ReactNode } from 'react';

export interface PublicTopBarProps {
  navigation?: PublicNavigation;
  activeRouteId?: string;
  onNavigate?: (routeId: string) => void;
  logoSlot?: ReactNode;
  centerSlot?: ReactNode;
  rightSlot?: ReactNode;
  onOpenDrawer?: () => void;
  showDrawerTrigger?: boolean;
  className?: string;
}

export interface PublicBottomNavProps {
  routes: PublicNavRoute[];
  activeRouteId: string;
  onNavigate: (routeId: string) => void;
  className?: string;
}

export interface PublicSidebarProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export interface PublicContextPanelProps {
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export interface PublicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}
