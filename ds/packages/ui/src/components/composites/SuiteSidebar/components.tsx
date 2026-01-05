import React from 'react';
import { NavGroup, NavItem, AccessMap, TelemetryMap, NavRouteRef } from '@loopdev/contracts';
import { Icon, Text, Badge } from '../../../atoms';
import * as LucideIcons from 'lucide-react';

// 1. Átomo Interno: NavItem (El motor del Sidebar)
export const SidebarItem: React.FC<{
  item: NavItem;
  isActive: boolean;
  isRail: boolean;
  access: string;
  telemetryBadge?: any;
  onNavigate: (route: NavRouteRef) => void;
}> = ({ item, isActive, isRail, access, telemetryBadge, onNavigate }) => {
  
  const isDisabled = access === 'disabled';
  
  // Resolver icono de Lucide dinámicamente
  const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.HelpCircle;

  const content = (
    <div 
      onClick={() => !isDisabled && item.kind === 'module' && onNavigate(item.route)}
      className={`
        flex items-center transition-all duration-300 rounded-xl border relative group
        ${isRail ? 'justify-center w-10 h-10 mx-auto' : 'px-4 py-3 gap-3 w-full'}
        ${isActive 
          ? 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(19,91,236,0.1)]' 
          : isDisabled
            ? 'grayscale opacity-40 cursor-not-allowed border-transparent'
            : 'text-text-muted hover:bg-primary/5 hover:text-primary border-transparent hover:border-primary/10'
        }
      `}
      title={isRail ? item.label : undefined}
    >
      <IconComponent size={isRail ? 20 : 18} className={isActive ? 'text-primary' : ''} />
      
      {!isRail && (
        <span className="font-medium text-sm truncate flex-1">{item.label}</span>
      )}

      {/* Indicador de Contexto Vivo (Bloque 0: Pulso Amarillo) */}
      {isActive && !isRail && (
        <div className="w-1.5 h-1.5 rounded-full bg-energy-yellow animate-pulse shadow-[0_0_8px_rgba(255,208,37,0.6)]" />
      )}

      {/* Badge de Telemetría */}
      {telemetryBadge && !isRail && (
        <Badge variant="primary" size="sm">{telemetryBadge.value}</Badge>
      )}

      {/* Icono de Bloqueo */}
      {isDisabled && !isRail && (
        <LucideIcons.Lock size={12} className="text-text-muted" />
      )}
    </div>
  );

  return content;
};

// 2. Componente: SidebarGroup (Contenedor de Módulos)
export const SidebarGroup: React.FC<{
  group: NavGroup;
  isRail: boolean;
  activeModuleId?: string;
  accessMap: AccessMap;
  telemetry: TelemetryMap;
  onNavigate: (route: NavRouteRef) => void;
}> = ({ group, isRail, activeModuleId, accessMap, telemetry, onNavigate }) => {
  return (
    <div className="space-y-2">
      {!isRail && (
        <div className="px-4 mb-2">
          <Text size="nano" weight="black" className="text-text-muted/60 uppercase tracking-[0.25em] text-[9px]">
            {group.label}
          </Text>
        </div>
      )}
      
      <div className="space-y-1">
        {group.items.map((item) => (
          <SidebarItem 
            key={item.id} 
            item={item} 
            isActive={item.kind === 'module' && item.moduleId === activeModuleId}
            isRail={isRail}
            access={item.kind === 'module' ? (accessMap[item.moduleId] || 'enabled') : 'enabled'}
            telemetryBadge={telemetry[item.id]}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
};

// 3. Componente: ExitHatch (The Exit Port)
export const ExitHatch: React.FC<{
  isRail: boolean;
  label: string;
  icon: string;
  onClick: () => void;
}> = ({ isRail, label, icon, onClick }) => {
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.ArrowLeft;

  return (
    <button 
      onClick={onClick}
      className={`
        flex items-center gap-3 transition-all duration-300 text-text-muted hover:text-primary group
        ${isRail ? 'justify-center w-full' : 'px-4 py-2 w-full'}
      `}
    >
      <IconComponent size={isRail ? 20 : 16} className="group-hover:-translate-x-1 transition-transform" />
      {!isRail && (
        <Text size="nano" weight="black" className="uppercase tracking-widest text-[9px]">
          {label}
        </Text>
      )}
    </button>
  );
};
