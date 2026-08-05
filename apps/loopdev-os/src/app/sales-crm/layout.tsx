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
  LayoutProvider,
  TenantProvider,
  BlueprintBackground,
  ToastViewport,
  ModuleWorkspace,
} from '@loopdev/ui';
import { useAuth } from '@/hooks/useAuth';
import { NotificationItem } from '@/hooks/useNotifications';
import { AccessMap, LayoutContext, NavigationSchema, NavMode, SuiteIdentity } from '@loopdev/contracts';
import { SalesCrmProvider, useSalesCrm } from './context';
import { AiBudgetGenerator } from './components/AiBudgetGenerator';
import { MasterDetailModal } from './components/MasterDetailModal';

const SALES_CRM_SCHEMA: NavigationSchema = {
  version: '1.0',
  suite: {
    suiteId: 'salesCRM',
    suiteName: 'Sales & CRM',
    suiteIcon: 'Users',
    accentColor: '#3B82F6', // Royal Blue
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
    const staleAlerts = leads.filter(lead => {
      if (lead.stage !== 'contacted') return false;
      const lastActivityDate = new Date(lead.lastContactDate);
      const now = new Date();
      const diffDays = Math.ceil(Math.abs(now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays > 5;
    }).map(lead => {
      const diffDays = Math.ceil(Math.abs(new Date().getTime() - new Date(lead.lastContactDate).getTime()) / (1000 * 60 * 60 * 24));
      return {
        id: `stale-${lead.id}`,
        title: `Lead Estancado: ${lead.name}`,
        description: `El lead de ${lead.company} lleva ${diffDays} días sin contacto.`,
        timestamp: `${diffDays}d ago`,
        type: 'warning' as const,
        read: false
      };
    });

    queueMicrotask(() => setSyncedNotifications(staleAlerts));
  }, [leads]);

  const handleMarkAsRead = (id: string) => {
    setSyncedNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (id.startsWith('stale-')) {
      const leadId = id.substring(6);
      openLeadInspector(leadId);
    }
  };

  const handleMarkAllRead = () => {
    setSyncedNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleRemoveNotification = (id: string) => {
    setSyncedNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setSyncedNotifications([]);
  };
  
  const [navMode, setNavMode] = useState<NavMode>('expanded');
  const [context] = useState<LayoutContext>('normal');
  const [activeOverlay, setActiveOverlay] = useState<'nav' | 'context' | null>(null);

  // --- FORCE PREMIUM DARK MODE & BLUE ACCENTS ---
  useEffect(() => {
    const root = document.documentElement;
    const hadLight = root.classList.contains('light');
    root.classList.remove('light');
    root.classList.add('dark');
    
    root.style.setProperty('--lpd-color-brand-primary', '#3B82F6');
    root.style.setProperty('--lpd-color-brand-primary-rgb', '59 130 246');
    root.style.setProperty('--lpd-color-bg-primary-subtle', '#3B82F626');
    root.style.setProperty('--lpd-color-status-info', '#3B82F6');

    return () => {
      root.classList.remove('dark');
      if (hadLight) {
        root.classList.add('light');
      } else {
        root.classList.add('dark');
      }
      
      root.style.setProperty('--lpd-color-brand-primary', '#135bec');
      root.style.setProperty('--lpd-color-brand-primary-rgb', '19 91 236');
      root.style.setProperty('--lpd-color-bg-primary-subtle', '#135bec26');
      root.style.setProperty('--lpd-color-status-info', '#135bec');
    };
  }, []);

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
    'overview': 'enabled',
    'pipeline': 'enabled',
    'customers': 'enabled',
    'ai-insights': 'enabled'
  };

  return (
    <AppShell
      config={{
        isLeftSidebarOpen: navMode === 'expanded',
        isRightSidebarOpen: false, 
        navBehavior: 'auto',
        context: context,
        activeOverlay: activeOverlay,
      }}
      onToggleLeftSidebar={() => setNavMode(prev => prev === 'expanded' ? 'rail' : 'expanded')}
      navSlot={
        <SuiteSidebar 
          schema={SALES_CRM_SCHEMA}
          navMode={navMode}
          context={context}
          activeModuleId={activeModuleId}
          accessMap={accessMap}
          onExitToOS={() => router.push('/launchpad')}
          onNavigate={(route) => router.push(route.routeId)}
          onToggleNavMode={() => setNavMode(prev => prev === 'expanded' ? 'rail' : 'expanded')}
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
                onSuiteChange={(id) => id === 'os.home' ? router.push('/launchpad') : router.push(`/${id}`)}
              />
              <Divider orientation="vertical" thickness="technical" className="h-4" />
              <ContextPath 
                segments={[
                  { id: 'suite', label: 'Sales & CRM', href: '/sales-crm', isActive: true }
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
                unreadCount={syncedNotifications.filter(n => !n.read).length}
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
      <BlueprintBackground variant="monochrome" intensity="low" className="fixed inset-0 pointer-events-none opacity-40 animate-pulse duration-10000" />
      <TenantProvider tenant="loopdev">
        <LayoutProvider>
          <ToastViewport activeTenantId="loopdev" />
          
          <AiBudgetGenerator />
          
          <MasterDetailModal 
            isOpen={isInspectorOpen}
            lead={selectedLead}
            onClose={closeInspector}
          />
          
          <ModuleWorkspace
            moduleId="sales-crm"
            inspectorOpen={false}
            onInspectorChange={() => {}}
            config={{
              inspectorWidth: '0px'
            }}
            overlay={{
              force: false,
              closeOnBackdrop: false
            }}
            inspectorSlot={null}
          >
            {children}
          </ModuleWorkspace>
        </LayoutProvider>
      </TenantProvider>
    </AppShell>
  );
}

export default function SalesCrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <SalesCrmProvider>
      <SalesCrmLayoutInner>{children}</SalesCrmLayoutInner>
    </SalesCrmProvider>
  );
}
