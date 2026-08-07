'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  AppShell,
  AVAILABLE_SUITES_FIXTURES,
  CommandBarTrigger,
  ContextPath,
  Divider,
  BrandLogo,
  LpdText,
  SuiteHeader,
  SuiteSidebar,
  SuiteSwitcher,
  SystemStatus,
  TechnicalSurface,
  ThemeToggle,
  UserAvatar,
  UserMenu,
} from '@loopdev/ui';
import type { LayoutContext, ModuleAccessState, NavigationSchema, NavMode } from '@loopdev/contracts';
import { SuiteContentFrame } from '@/components/layout/SuiteContentFrame';

const PREVIEW_SCHEMA: NavigationSchema = {
  version: '1.0',
  suite: {
    suiteId: 'frontend-preview',
    suiteName: 'Frontend Preview',
    suiteIcon: 'LayoutDashboard',
    accentColor: '#135bec',
    surfaceVariant: 'canvas',
    route: { routeId: '/frontend-preview' },
  },
  exitHatch: { label: 'Back to OS', icon: 'ArrowLeft', route: { routeId: '/frontend-preview' } },
  groups: [
    {
      id: 'preview',
      label: 'Preview Catalog',
      priority: 10,
      collapsible: false,
      items: [
        { id: 'catalog', kind: 'module', label: 'Suite Catalog', priority: 10, icon: 'LayoutDashboard', moduleId: 'catalog', route: { routeId: '/frontend-preview' } },
        { id: 'sales-crm', kind: 'module', label: 'Sales & CRM', priority: 20, icon: 'Users', moduleId: 'sales-crm', route: { routeId: '/frontend-preview/sales-crm' } },
        { id: 'communications', kind: 'module', label: 'Communications', priority: 30, icon: 'MessageSquare', moduleId: 'communications', route: { routeId: '/frontend-preview/sales-crm/communications' } },
      ],
    },
  ],
};

export default function FrontendPreviewLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [navMode, setNavMode] = useState<NavMode>('expanded');
  const [activeOverlay, setActiveOverlay] = useState<'nav' | 'context' | null>(null);
  const context: LayoutContext = 'normal';

  useEffect(() => {
    queueMicrotask(() => setNavMode(pathname === '/frontend-preview' ? 'expanded' : 'rail'));
  }, [pathname]);

  const activeModuleId = pathname.includes('/communications')
    ? 'communications'
    : pathname.includes('/sales-crm')
      ? 'sales-crm'
      : 'catalog';
  const accessMap: Record<string, ModuleAccessState> = { catalog: 'enabled', 'sales-crm': 'enabled', communications: 'enabled' };

  return (
    <AppShell
      config={{ isLeftSidebarOpen: navMode === 'expanded', isRightSidebarOpen: false, navBehavior: 'auto', context, activeOverlay }}
      onToggleLeftSidebar={() => setNavMode((mode) => (mode === 'expanded' ? 'rail' : 'expanded'))}
      navSlot={pathname === '/frontend-preview' ? undefined : (
        <SuiteSidebar
          schema={PREVIEW_SCHEMA}
          navMode={navMode}
          context={context}
          activeModuleId={activeModuleId}
          accessMap={accessMap}
          onExitToOS={() => router.push('/frontend-preview')}
          onNavigate={(route) => router.push(route.routeId)}
          onToggleNavMode={() => setNavMode((mode) => (mode === 'expanded' ? 'rail' : 'expanded'))}
          profileSlot={<UserAvatar name="Frontend Preview" size={navMode === 'rail' ? 'md' : 'sm'} withStatus status="online" />}
        />
      )}
      headerSlot={
        pathname === '/frontend-preview' ? (
          <TechnicalSurface variant="canvas" depth="flat" className="relative z-10 border-b border-black/5 p-8 backdrop-blur-md dark:border-white/5">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-6">
                <BrandLogo variant="full" size="md" />
                <div className="hidden h-8 w-px bg-black/10 dark:bg-white/10 md:block" />
                <LpdText size="sm" weight="bold" className="text-slate-900 dark:text-white">
                  Frontend <span className="font-black text-primary">Preview</span>
                </LpdText>
              </div>
              <div className="flex items-center gap-4">
                <SystemStatus state="operational" label="PREVIEW" />
                <ThemeToggle variant="technical" size="md" />
              </div>
            </div>
          </TechnicalSurface>
        ) : (
        <SuiteHeader
          isInert={activeOverlay !== null}
          leftSlot={
            <div className="flex items-center gap-4">
              <SuiteSwitcher
                currentSuite={PREVIEW_SCHEMA.suite}
                availableSuites={AVAILABLE_SUITES_FIXTURES}
                onOpenChange={(open) => setActiveOverlay(open ? 'nav' : null)}
                onSuiteChange={(id) => router.push(id === 'os.home' ? '/frontend-preview' : `/${id}`)}
              />
              <Divider orientation="vertical" thickness="technical" className="h-4" />
              <ContextPath segments={[{ id: 'preview', label: 'Frontend Preview', href: '/frontend-preview', isActive: true }]} />
            </div>
          }
          centerSlot={<CommandBarTrigger onOpen={() => {}} />}
          rightSlot={
            <div className="flex items-center gap-4">
              <SystemStatus state="operational" label="PREVIEW" />
              <Divider orientation="vertical" thickness="technical" className="h-4" />
              <ThemeToggle variant="technical" size="md" />
              <UserMenu userName="Frontend Preview" userRole="Preview_User" onOpenChange={(open) => setActiveOverlay(open ? 'context' : null)} onLogout={() => router.push('/frontend-preview')} />
            </div>
          }
        />
        )
      }
    >
      <SuiteContentFrame moduleId={activeModuleId} tenant="loopdev" activeTenantId="loopdev">
        {children}
      </SuiteContentFrame>
    </AppShell>
  );
}