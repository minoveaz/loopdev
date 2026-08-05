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
import { useNotifications } from '@/hooks/useNotifications';
import { NavMode, LayoutContext } from '@loopdev/contracts';

// Local Navigation Schema for Health OS
const HEALTH_OS_SCHEMA = {
  version: '0.1.0',
  suite: {
    suiteId: 'health-os',
    suiteName: 'Health OS',
    suiteIcon: 'Activity',
    accentColor: '#10B981', // Emerald Green standard for Health
    surfaceVariant: 'canvas' as const,
    route: { routeId: '/health-os' },
  },
  exitHatch: {
    label: 'Back to OS',
    icon: 'ArrowLeft',
    route: { routeId: '/launchpad' },
  },
  groups: [
    {
      id: 'clinical',
      label: 'Clinical Desk',
      priority: 10,
      collapsible: true,
      items: [
        {
          id: 'overview',
          label: 'Overview',
          icon: 'LayoutDashboard',
          moduleId: 'overview',
          route: { routeId: '/health-os' },
        },
        {
          id: 'agenda',
          label: 'Agenda',
          icon: 'Calendar',
          moduleId: 'agenda',
          route: { routeId: '/health-os/agenda' },
        },
        {
          id: 'triage',
          label: 'Triage',
          icon: 'Activity',
          moduleId: 'triage',
          route: { routeId: '/health-os/triage' },
        },
        {
          id: 'consultations',
          label: 'Consultations',
          icon: 'UserCheck',
          moduleId: 'consultations',
          route: { routeId: '/health-os/consultations' },
        },
      ],
    },
    {
      id: 'billing',
      label: 'Billing & Admin',
      priority: 20,
      collapsible: true,
      items: [
        {
          id: 'contracts',
          label: 'Contracts',
          icon: 'FileText',
          moduleId: 'contracts',
          route: { routeId: '/health-os/contracts' },
        },
        {
          id: 'billing',
          label: 'RIPS & Billing',
          icon: 'CreditCard',
          moduleId: 'billing',
          route: { routeId: '/health-os/billing' },
        },
      ],
    },
  ],
};

export default function HealthOpsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification,
    clearAll 
  } = useNotifications([]);
  
  const [navMode, setNavMode] = useState<NavMode>('expanded');
  const [context] = useState<LayoutContext>('normal');
  const [activeOverlay, setActiveOverlay] = useState<'nav' | 'context' | null>(null);

  // --- FORCE LIGHT MODE & EMERALD GREEN THEME ---
  useEffect(() => {
    const root = document.documentElement;
    
    // 1. Guardar estado del tema oscuro actual y forzar Tema Claro
    const hadDark = root.classList.contains('dark');
    root.classList.remove('dark');
    root.classList.add('light');
    
    // 2. Sobrescribir variables CSS con el Verde Esmeralda asistencial
    root.style.setProperty('--lpd-color-brand-primary', '#10B981');
    root.style.setProperty('--lpd-color-brand-primary-rgb', '16 185 129');
    root.style.setProperty('--lpd-color-bg-primary-subtle', '#10B98126'); // Opaco
    root.style.setProperty('--lpd-color-status-info', '#10B981');

    return () => {
      // Limpieza: Restaurar el tema oscuro original si existía
      root.classList.remove('light');
      if (hadDark) {
        root.classList.add('dark');
      }
      
      // Restaurar el color azul corporativo predeterminado
      root.style.setProperty('--lpd-color-brand-primary', '#135bec');
      root.style.setProperty('--lpd-color-brand-primary-rgb', '19 91 236');
      root.style.setProperty('--lpd-color-bg-primary-subtle', '#135bec26');
      root.style.setProperty('--lpd-color-status-info', '#135bec');
    };
  }, []);

  useEffect(() => {
    if (pathname.split('/').length > 2) {
      setNavMode('rail');
    }
  }, [pathname]);

  const currentSuite = HEALTH_OS_SCHEMA.suite;

  const getActiveModule = () => {
    const parts = pathname.split('/');
    if (parts.length <= 2) return 'overview';
    return parts[2];
  };

  const activeModuleId = getActiveModule();

  const accessMap: Record<string, 'enabled' | 'disabled' | 'coming-soon'> = {
    'overview': 'enabled',
    'agenda': 'enabled',
    'triage': 'enabled',
    'consultations': 'enabled',
    'contracts': 'enabled',
    'billing': 'enabled'
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
          schema={HEALTH_OS_SCHEMA as any}
          navMode={navMode}
          context={context}
          activeModuleId={activeModuleId}
          accessMap={accessMap}
          onExitToOS={() => router.push('/launchpad')}
          onNavigate={(route) => router.push(route.routeId)}
          onToggleNavMode={() => setNavMode(prev => prev === 'expanded' ? 'rail' : 'expanded')}
          profileSlot={
            <UserAvatar 
              name={user?.email || 'Medical User'} 
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
                currentSuite={currentSuite as any}
                availableSuites={AVAILABLE_SUITES_FIXTURES}
                onOpenChange={(open) => setActiveOverlay(open ? 'nav' : null)}
                onSuiteChange={(id) => id === 'os.home' ? router.push('/launchpad') : router.push(`/${id}`)}
              />
              <Divider orientation="vertical" thickness="technical" className="h-4" />
              <ContextPath 
                segments={[
                  { id: 'suite', label: 'Health OS', href: '/health-os', isActive: true }
                ]} 
              />
            </div>
          }
          centerSlot={<CommandBarTrigger onOpen={() => {}} />}
          rightSlot={
            <div className="flex items-center gap-4">
              <SystemStatus state="operational" id={user?.id} label="IPS" />
              <Divider orientation="vertical" thickness="technical" className="h-4" />
              
              <NotificationCenter 
                notifications={notifications}
                unreadCount={unreadCount}
                onOpenChange={(open) => setActiveOverlay(open ? 'context' : null)}
                onMarkAsRead={markAsRead}
                onMarkAllRead={markAllAsRead}
                onRemove={removeNotification}
                onClear={clearAll}
                onViewAll={() => console.log('Open Notifications')}
              />

              <ThemeToggle variant="technical" size="md" />
              <UserMenu 
                userName={user?.email || 'Medical User'}
                userEmail={user?.email}
                userRole="IPS_Clinician"
                onOpenChange={(open) => setActiveOverlay(open ? 'context' : null)}
                onLogout={() => signOut()}
              />
            </div>
          }
        />
      }
    >
      <BlueprintBackground variant="monochrome" intensity="low" className="fixed inset-0 pointer-events-none opacity-40" />
      <TenantProvider tenant="estar-protegidos">
        <LayoutProvider>
          <ToastViewport activeTenantId="zonamedica" />
          
          <ModuleWorkspace
            moduleId="health-os"
            inspectorOpen={false}
            onInspectorChange={() => {}}
            config={{
              inspectorWidth: '360px'
            }}
            overlay={{
              force: true,
              closeOnBackdrop: true
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
