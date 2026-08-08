'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppShell,
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
} from '@loopdev/ui';
import { SuiteContentFrame } from '@/components/layout/SuiteContentFrame';
import { useAuth } from '@/hooks/useAuth';
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
  const { leads, openLeadInspector, isInspectorOpen, closeInspector, selectedLead } = useSalesCrm();

  const [syncedNotifications, setSyncedNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    // Generate stale lead alerts notifications in real-time
    const staleAlerts = leads.filter((lead) => isLeadStale(lead)).map((lead) => {
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
    if (pathname.split('/').length > 2) {
      queueMicrotask(() => setNavMode('rail'));
    } else {
      queueMicrotask(() => setNavMode('expanded'));
    }
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
      onToggleLeftSidebar={() => setNavMode((prev) => (prev === 'expanded' ? 'rail' : 'expanded'))}
      navSlot={
        <SuiteSidebar
          schema={SALES_CRM_SCHEMA}
          navMode={navMode}
          context={context}
          activeModuleId={activeModuleId}
          accessMap={accessMap}
          onExitToOS={() => router.push('/launchpad')}
          onNavigate={(route) => router.push(route.routeId)}
          onToggleNavMode={() => setNavMode((prev) => (prev === 'expanded' ? 'rail' : 'expanded'))}
          profileSlot={
            <UserAvatar
              name={user?.email || 'Sales Manager'}
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
                  { id: 'suite', label: 'Sales & CRM', href: '/sales-crm', isActive: true },
                ]}
              />
            </div>
          }
          centerSlot={<CommandBarTrigger onOpen={() => {}} />}
          rightSlot={
            <div className="flex items-center gap-4">
              <SystemStatus state="operational" id={user?.id} label="CRM" />
              <Divider orientation="vertical" thickness="technical" className="h-4" />

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
                userName={user?.email || 'Sales Manager'}
                userEmail={user?.email}
                userRole="Sales_Executive"
                onOpenChange={(open) => setActiveOverlay(open ? 'context' : null)}
                onLogout={() => signOut()}
              />
            </div>
          }
        />
      }
    >
      <SuiteContentFrame
        moduleId="sales-crm"
        tenant="loopdev"
        activeTenantId="loopdev"
        inspectorWidth="0px"
        forceOverlay={false}
      >
        <AiBudgetGenerator />
        <MasterDetailModal isOpen={isInspectorOpen} lead={selectedLead} onClose={closeInspector} />
        {children}
      </SuiteContentFrame>
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
