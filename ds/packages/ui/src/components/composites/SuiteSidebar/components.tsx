'use client';

import React from 'react';

import { NavGroup, NavItem, AccessMap, TelemetryMap, NavRouteRef } from '@loopdev/contracts';

import { Icon, Text as LpdText, Badge, StatusPulse, IdentityBar, NavSidebarItem, ExitHatch, TechnicalLabel, NavGroup as NavGroupAtom } from '../../atoms';

import * as LucideIcons from 'lucide-react';



/**

 * @component MomentumDot

 * @description Indicador de Contexto Vivo. El héroe visual del estado activo.

 */

export const MomentumDot: React.FC = () => (

  <div className="flex items-center justify-center shrink-0 w-4 h-4">

    <StatusPulse variant="energy" size="sm" />

  </div>

);



// 2. Componente: SidebarGroup (Contenedor de Módulos)

export const NavSidebarGroup: React.FC<{

  group: NavGroup;

  isRail: boolean;

  activeModuleId?: string;

  accessMap: AccessMap;

  telemetry: TelemetryMap;

  onNavigate: (route: NavRouteRef) => void;

  accentColor?: string;

}> = ({ group, isRail, activeModuleId, accessMap, telemetry, onNavigate, accentColor }) => (

  <NavGroupAtom label={group.label} isRail={isRail}>

    <div className="space-y-0.5">

      {group.items.map((item) => (

        <NavSidebarItem 

          key={item.id} 

          icon={item.icon}

          label={item.label}

          isActive={item.kind === 'module' && item.moduleId === activeModuleId}

          isRail={isRail}

          status={item.kind === 'module' ? (accessMap[item.moduleId] as any || 'enabled') : 'enabled'}

          telemetry={telemetry[item.id]}

          onNavigate={onNavigate}

          route={(item as any).route}

          actionId={(item as any).actionId}

          accentColor={accentColor}

        />

      ))}

    </div>

  </NavGroupAtom>

);