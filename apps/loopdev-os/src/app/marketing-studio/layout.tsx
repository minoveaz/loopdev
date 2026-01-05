'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  AppShell, 
  SuiteSidebar, 
  MARKETING_STUDIO_SCHEMA,
  ThemeToggle,
  SystemStatus,
  Text,
  Icon
} from '@loopdev/ui';
import { useAuth } from '@/hooks/useAuth';
import { NavMode } from '@loopdev/contracts';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  
  // Estado de Navegación del Shell
  const [navMode, setNavMode] = useState<NavMode>('expanded');

  // Determinar el módulo activo basado en la ruta
  const activeModuleId = pathname.split('/').pop() || 'overview';

  // Configuración de permisos simulada (Multitenant Ready)
  const accessMap = {
    'overview': 'enabled',
    'brand-hub': 'enabled',
    'content-engine': 'enabled',
    'dam': 'enabled',
    'settings': 'enabled'
  };

  return (
    <AppShell
      navMode={navMode}
      onToggleLeftSidebar={() => setNavMode(prev => prev === 'expanded' ? 'rail' : 'expanded')}
      navSlot={
        <SuiteSidebar 
          schema={MARKETING_STUDIO_SCHEMA}
          navMode={navMode}
          activeModuleId={activeModuleId}
          accessMap={accessMap}
          onExitToOS={() => router.push('/launchpad')}
          onNavigate={(route) => router.push(route.routeId)}
          onToggleNavMode={() => setNavMode(prev => prev === 'expanded' ? 'rail' : 'expanded')}
          profileSlot={
            <div className="flex items-center gap-3 px-2 py-1 mb-2">
               <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                 {user?.email?.charAt(0).toUpperCase()}
               </div>
               {navMode === 'expanded' && (
                 <div className="flex-1 min-w-0">
                   <Text size="nano" weight="bold" className="truncate block dark:text-white text-slate-900">
                     {user?.email?.split('@')[0]}
                   </Text>
                 </div>
               )}
            </div>
          }
        />
      }
      headerSlot={
        <div className="flex items-center justify-between w-full h-full">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="hub" size="sm" />
            </div>
            <div>
              <Text size="nano" weight="black" className="text-primary uppercase tracking-[0.2em] leading-none mb-1">Marketing Studio</Text>
              <Text size="xs" weight="bold" className="dark:text-white text-slate-900 leading-none">Workspace_Active</Text>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <SystemStatus state="operational" id={user?.id} label="ID" />
            <ThemeToggle variant="technical" size="md" />
            <button 
              onClick={() => signOut()}
              className="p-2 text-text-muted hover:text-danger transition-colors rounded-lg hover:bg-danger/10"
              title="Sign Out"
            >
              <Icon name="logout" size="sm" />
            </button>
          </div>
        </div>
      }
    >
      {children}
    </AppShell>
  );
}