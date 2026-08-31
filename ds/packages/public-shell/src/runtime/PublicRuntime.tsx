'use client';

import React, { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import type { PublicShellStructuralState } from '@loopdev/contracts';
import { BrandThemeProvider } from '../theme/BrandThemeProvider';
import { PublicAnalyticsProvider } from '../analytics/PublicAnalyticsProvider';
import { PublicSeoHead } from '../seo/PublicSeoHead';
import { PublicCanvas } from '../canvas/PublicCanvas';
import { PublicCanvasRegion } from '../canvas/PublicCanvasRegion';
import { PublicTopBar } from '../navigation/PublicTopBar';
import { PublicBottomNav } from '../navigation/PublicBottomNav';
import { PublicDrawer } from '../navigation/PublicDrawer';
import { usePublicBreakpoint } from '../hooks/usePublicBreakpoint';
import { PublicRuntimeContext } from './PublicRuntimeContext';
import type { PublicRuntimeContextValue, PublicRuntimeProps, SlotRenderer } from './types';

const resolveSlot = (renderer: SlotRenderer | undefined, context: PublicRuntimeContextValue) => {
  if (!renderer) return null;
  if (typeof renderer === 'function') {
    return renderer(context);
  }
  return renderer;
};

export const PublicRuntime: React.FC<PublicRuntimeProps> = ({
  brandTheme,
  navigation,
  composition,
  seo,
  analytics = { consentModeEnabled: true },
  renderers,
  activeRouteId: controlledRouteId,
  onNavigate,
  state = 'ready',
  isAuthenticated = false,
  currentUser,
  onRequestAuth,
  className,
  children,
}) => {
  const breakpoint = usePublicBreakpoint();
  const [internalRouteId, setInternalRouteId] = useState(
    controlledRouteId ?? navigation.defaultRouteId,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const activeRouteId = controlledRouteId ?? internalRouteId;

  const handleNavigate = (routeId: string) => {
    setIsDrawerOpen(false);
    if (onNavigate) {
      onNavigate(routeId);
    } else {
      setInternalRouteId(routeId);
    }
  };

  const contextValue = useMemo<PublicRuntimeContextValue>(
    () => ({
      mode: breakpoint.mode,
      isMobile: breakpoint.isMobile,
      isTablet: breakpoint.isTablet,
      isDesktop: breakpoint.isDesktop,
      activeRouteId,
      navigate: handleNavigate,
      theme: brandTheme,
      state,
      isAuthenticated,
      currentUser,
      isDrawerOpen,
      openDrawer: () => setIsDrawerOpen(true),
      closeDrawer: () => setIsDrawerOpen(false),
      isAuthModalOpen,
      openAuthModal: () => {
        onRequestAuth?.();
        setIsAuthModalOpen(true);
      },
      closeAuthModal: () => setIsAuthModalOpen(false),
    }),
    [
      breakpoint,
      activeRouteId,
      brandTheme,
      state,
      isAuthenticated,
      currentUser,
      isDrawerOpen,
      isAuthModalOpen,
      onRequestAuth,
    ],
  );

  const mobilePrimaryRoutes = useMemo(() => {
    return navigation.routes.filter((r) =>
      navigation.mobilePrimaryRouteIds.includes(r.id),
    );
  }, [navigation]);

  return (
    <BrandThemeProvider theme={brandTheme}>
      <PublicAnalyticsProvider config={analytics}>
        {seo && <PublicSeoHead seo={seo} brand={brandTheme} />}

        <PublicRuntimeContext.Provider value={contextValue}>
          <div
            className={clsx(
              'min-h-screen bg-[var(--lpd-brand-background)] text-[var(--lpd-brand-text-main)] font-[family-name:var(--lpd-brand-font-family)]',
              'flex flex-col antialiased selection:bg-[var(--lpd-brand-primary)] selection:text-white',
              breakpoint.isMobile && 'pb-20', // Margen inferior para que BottomNav no tape el contenido
              className,
            )}
          >
            {/* 1. Header / TopBar */}
            {renderers.topBar ? (
              resolveSlot(renderers.topBar, contextValue)
            ) : (
              <PublicTopBar
                navigation={navigation}
                activeRouteId={activeRouteId}
                onNavigate={handleNavigate}
                onOpenDrawer={() => setIsDrawerOpen(true)}
              />
            )}

            {/* 2. Main Content Canvas */}
            {children ? (
              children
            ) : (
              <PublicCanvas composition={composition}>
                {/* Region: Sidebar Filters */}
                {renderers.sidebarFilters && (
                  <PublicCanvasRegion id="cimo-filters-col">
                    {resolveSlot(renderers.sidebarFilters, contextValue)}
                  </PublicCanvasRegion>
                )}

                {/* Region: Main Feed */}
                <PublicCanvasRegion id="cimo-feed-col">
                  {resolveSlot(renderers.mainFeed, contextValue)}
                </PublicCanvasRegion>

                {/* Region: Context Inspector */}
                {renderers.contextInspector && (
                  <PublicCanvasRegion id="cimo-inspector-col">
                    {resolveSlot(renderers.contextInspector, contextValue)}
                  </PublicCanvasRegion>
                )}
              </PublicCanvas>
            )}

            {/* 3. Mobile Fixed BottomNav */}
            {breakpoint.isMobile &&
              (renderers.bottomNav ? (
                resolveSlot(renderers.bottomNav, contextValue)
              ) : (
                <PublicBottomNav
                  routes={mobilePrimaryRoutes}
                  activeRouteId={activeRouteId}
                  onNavigate={handleNavigate}
                />
              ))}

            {/* 4. Overlays: Drawer, AuthModal, CookieBanner */}
            {renderers.drawer && (
              <PublicDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
              >
                {resolveSlot(renderers.drawer, contextValue)}
              </PublicDrawer>
            )}

            {renderers.authModal && resolveSlot(renderers.authModal, contextValue)}
            {renderers.cookieBanner && resolveSlot(renderers.cookieBanner, contextValue)}
          </div>
        </PublicRuntimeContext.Provider>
      </PublicAnalyticsProvider>
    </BrandThemeProvider>
  );
};
