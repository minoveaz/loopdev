'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppShell,
  BlueprintBackground,
  Button,
  LayoutProvider,
  ModuleHeader,
  ModuleWorkspace,
  SuiteSidebar,
  ThemeToggle,
  SystemStatus,
  UserAvatar,
  SuiteHeader,
  CommandBarTrigger,
  SuiteSwitcher,
  ContextPath,
  AVAILABLE_SUITES_FIXTURES,
  UserMenu,
  NotificationCenter,
  Divider,
  TenantProvider,
  ToastViewport,
  MobileSuiteNav,
} from '@loopdev/ui';
import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/hooks/useOrganization';
import { NotificationItem } from '@/hooks/useNotifications';
import {
  AccessMap,
  LayoutContext,
  NavigationSchema,
  NavMode,
  SuiteIdentity,
} from '@loopdev/contracts';
import { SalesCrmProvider, useSalesCrm } from './context';
import { AiBudgetGenerator } from './components/AiBudgetGenerator';
import { MasterDetailModal } from './components/MasterDetailModal';
import { daysSinceContact, isLeadStale } from './utils/leadActivity';
import { SuitePermissionGuard } from '@/components/layout/SuitePermissionGuard';
import { getSuiteNavMode } from '@/components/layout/suiteNavMode';

const SALES_CRM_SCHEMA: NavigationSchema = {
  version: '1.0',
  suite: {
    suiteId: 'salesCRM',
    suiteName: 'Sales & CRM',
    suiteIcon: 'Users',
    accentColor: 'var(--lpd-color-brand-primary)',
    surfaceVariant: 'canvas' as const,
    route: { routeId: '/sales-crm' },
  },
  exitHatch: {
    label: 'Back to OS',
    icon: 'ArrowLeft',
    route: { routeId: '/launchpad' },
  },
  groups: [
    {
      id: 'core',
      label: 'Operaciones Comerciales',
      priority: 10,
      collapsible: true,
      items: [
        {
          id: 'overview',
          kind: 'module',
          label: 'Dashboard CRM',
          priority: 10,
          icon: 'LayoutDashboard',
          moduleId: 'overview',
          route: { routeId: '/sales-crm' },
        },
        {
          id: 'pipeline',
          kind: 'module',
          label: 'Deals & Pipeline',
          priority: 20,
          icon: 'TrendingUp',
          moduleId: 'pipeline',
          route: { routeId: '/sales-crm/pipeline' },
        },
        {
          id: 'customers',
          kind: 'module',
          label: 'Directorio Clientes',
          priority: 30,
          icon: 'Users',
          moduleId: 'customers',
          route: { routeId: '/sales-crm/customers' },
        },
      ],
    },
    {
      id: 'ai-features',
      label: 'Inteligencia Predictiva',
      priority: 20,
      collapsible: true,
      items: [
        {
          id: 'ai-insights',
          kind: 'module',
          priority: 40,
          label: 'Modelos de Puntuación',
          icon: 'Sparkles',
          moduleId: 'ai-insights',
          route: { routeId: '/sales-crm/ai-insights' },
        },
      ],
    },
  ],
};

function SalesCrmLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { activeOrganization } = useOrganization();
  const { leads, openLeadInspector, isInspectorOpen, closeInspector, selectedLead } = useSalesCrm();

  const [isMounted, setIsMounted] = useState(false);
  const [syncedNotifications, setSyncedNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Generate stale lead alerts notifications in real-time
    const staleAlerts = leads
      .filter((lead) => isLeadStale(lead))
      .map((lead) => {
        const diffDays = daysSinceContact(lead.lastContactDate);
        return {
          id: `stale-${lead.id}`,
          title: `Lead Estancado: ${lead.name}`,
          description: `El lead de ${lead.company} lleva ${diffDays} días sin contacto.`,
          timestamp: `${diffDays}d ago`,
          type: 'warning' as const,
          read: false,
        };
      });

    queueMicrotask(() => setSyncedNotifications(staleAlerts));
  }, [leads]);

  const handleMarkAsRead = (id: string) => {
    setSyncedNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    if (id.startsWith('stale-')) {
      const leadId = id.substring(6);
      openLeadInspector(leadId);
    }
  };

  const handleMarkAllRead = () => {
    setSyncedNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleRemoveNotification = (id: string) => {
    setSyncedNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setSyncedNotifications([]);
  };

  const [navMode, setNavMode] = useState<NavMode>('expanded');
  const [context] = useState<LayoutContext>('normal');
  const [activeOverlay, setActiveOverlay] = useState<'nav' | 'context' | null>(null);

  useEffect(() => {
    queueMicrotask(() =>
      setNavMode(
        getSuiteNavMode(pathname, {
          railPrefixes: ['/sales-crm/pipeline', '/sales-crm/customers', '/sales-crm/ai-insights'],
        }),
      ),
    );
  }, [pathname]);

  const currentSuite: SuiteIdentity = SALES_CRM_SCHEMA.suite;

  const getActiveModule = () => {
    const parts = pathname.split('/');
    if (parts.length <= 2) return 'overview';
    return parts[2];
  };

  const activeModuleId = getActiveModule();

  const accessMap: AccessMap = {
    overview: 'enabled',
    pipeline: 'enabled',
    customers: 'enabled',
    'ai-insights': 'enabled',
  };

  return (
    <SuitePermissionGuard permission="crm.read">
      <AppShell
        config={{
          isLeftSidebarOpen: navMode === 'expanded',
          isRightSidebarOpen: false,
          navBehavior: 'auto',
          context: context,
          activeOverlay: activeOverlay,
        }}
        onToggleLeftSidebar={() =>
          setNavMode((prev) => (prev === 'expanded' ? 'rail' : 'expanded'))
        }
        navSlot={
          <SuiteSidebar
            schema={SALES_CRM_SCHEMA}
            navMode={navMode}
            context={context}
            activeModuleId={activeModuleId}
            accessMap={accessMap}
            onExitToOS={() => router.push('/launchpad')}
            onNavigate={(route) => router.push(route.routeId)}
            onToggleNavMode={() =>
              setNavMode((prev) => (prev === 'expanded' ? 'rail' : 'expanded'))
            }
            profileSlot={
              <UserAvatar
                name={isMounted ? user?.email || 'Sales Manager' : 'Sales Manager'}
                size={navMode === 'rail' ? 'md' : 'sm'}
                withStatus
                status="online"
              />
            }
          />
        }
        headerSlot={
          <SuiteHeader
            isInert={activeOverlay !== null}
            leftSlot={
              <div className="flex items-center gap-4">
                <SuiteSwitcher
                  currentSuite={currentSuite}
                  availableSuites={AVAILABLE_SUITES_FIXTURES}
                  onOpenChange={(open) => setActiveOverlay(open ? 'nav' : null)}
                  onSuiteChange={(id) =>
                    id === 'os.home' ? router.push('/launchpad') : router.push(`/${id}`)
                  }
                />
                <Divider orientation="vertical" thickness="technical" className="h-4" />
                <ContextPath
                  segments={[
                    {
                      id: 'workspace',
                      label: isMounted ? activeOrganization?.name ?? 'Workspace' : 'Workspace',
                      isActive: true,
                    },
                  ]}
                />
              </div>
            }
            centerSlot={<CommandBarTrigger onOpen={() => {}} />}
            rightSlot={
              <div className="flex items-center gap-4">
                <NotificationCenter
                  notifications={syncedNotifications}
                  unreadCount={syncedNotifications.filter((n) => !n.read).length}
                  onOpenChange={(open) => setActiveOverlay(open ? 'context' : null)}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllRead={handleMarkAllRead}
                  onRemove={handleRemoveNotification}
                  onClear={handleClearAll}
                  onViewAll={() => console.log('Open Notifications')}
                />

                <ThemeToggle variant="technical" size="md" />
                <UserMenu
                  userName={isMounted ? user?.email || 'Sales Manager' : 'Sales Manager'}
                  userEmail={isMounted ? user?.email : undefined}
                  userRole="Sales_Executive"
                  onOpenChange={(open) => setActiveOverlay(open ? 'context' : null)}
                  onLogout={() => signOut()}
                />
              </div>
            }
          />
        }
        mobileBottomSlot={(openMobileNav) => (
          <MobileSuiteNav
            items={[
              {
                label: 'CRM',
                icon: 'dashboard',
                path: '/sales-crm',
                active: pathname === '/sales-crm',
              },
              {
                label: 'Pipeline',
                icon: 'trending_up',
                path: '/sales-crm/pipeline',
                active: pathname.startsWith('/sales-crm/pipeline'),
              },
              {
                label: 'Clientes',
                icon: 'group',
                path: '/sales-crm/customers',
                active: pathname.startsWith('/sales-crm/customers'),
              },
              { label: 'Más', icon: 'more_horiz' },
            ]}
            onNavigate={(item) => (item.path ? router.push(item.path) : openMobileNav())}
          />
        )}
      >
        <BlueprintBackground
          variant="monochrome"
          intensity="low"
          className="fixed inset-0 pointer-events-none opacity-40"
        />
        <TenantProvider tenant="loopdev">
          <LayoutProvider>
            <ToastViewport activeTenantId="loopdev" />
            <ModuleWorkspace
              moduleId="sales-crm"
              config={{ inspectorWidth: '0px' }}
              overlay={{ force: false, closeOnBackdrop: false }}
              headerSlot={
                <ModuleHeader
                  segments={[
                    { id: 'suite', label: 'Sales & CRM', href: '/sales-crm', isActive: true },
                  ]}
                />
              }
            >
              <AiBudgetGenerator />
              <MasterDetailModal
                isOpen={isInspectorOpen}
                lead={selectedLead}
                onClose={closeInspector}
              />
              {children}
            </ModuleWorkspace>
          </LayoutProvider>
        </TenantProvider>
      </AppShell>
    </SuitePermissionGuard>
  );
}

export default function SalesCrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <SalesCrmProvider>
      <SalesCrmLayoutInner>{children}</SalesCrmLayoutInner>
    </SalesCrmProvider>
  );
}
