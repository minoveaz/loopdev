import type {
  PublicAnalyticsConfig,
  PublicBrandTheme,
  PublicNavigation,
  PublicNavRoute,
  PublicPageSpec,
  PublicSeoMetadata,
  PublicShellStructuralState,
  PublicViewComposition,
  PublicViewportMode,
} from '@loopdev/contracts';
import type { ReactNode } from 'react';

export interface PublicRuntimeContextValue {
  mode: PublicViewportMode;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  activeRouteId: string;
  navigate: (routeId: string) => void;
  theme: PublicBrandTheme;
  state: PublicShellStructuralState;
  isAuthenticated: boolean;
  currentUser?: { name: string; avatarUrl?: string };
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export type SlotRenderer = ReactNode | ((context: PublicRuntimeContextValue) => ReactNode);

export interface PublicRuntimeRenderers {
  topBar?: SlotRenderer;
  sidebarFilters?: SlotRenderer;
  mainFeed: SlotRenderer;
  contextInspector?: SlotRenderer;
  bottomNav?: SlotRenderer;
  drawer?: SlotRenderer;
  authModal?: SlotRenderer;
  cookieBanner?: SlotRenderer;
}

export interface PublicRuntimeProps {
  brandTheme: PublicBrandTheme;
  navigation: PublicNavigation;
  composition: PublicViewComposition;
  seo?: PublicSeoMetadata;
  analytics?: PublicAnalyticsConfig;
  renderers: PublicRuntimeRenderers;
  activeRouteId?: string;
  onNavigate?: (routeId: string) => void;
  state?: PublicShellStructuralState;
  isAuthenticated?: boolean;
  currentUser?: { name: string; avatarUrl?: string };
  onRequestAuth?: (reason?: string) => void;
  className?: string;
  children?: ReactNode;
}
