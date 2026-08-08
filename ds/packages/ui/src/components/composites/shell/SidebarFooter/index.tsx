'use client';

import React from 'react';
import { Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { UserAvatar, TechnicalLabel, Divider } from '../../../atoms';
import { SidebarFooterProps } from './types';
import { useSidebarFooter } from './useSidebarFooter';

/**
 * @component SidebarFooter
 * @description Bloque compuesto de cierre semántico para sidebars. 
 * Integra identidad de usuario y controles de sistema.
 * @category Composites
 * @phase 1
 */
export const SidebarFooter: React.FC<SidebarFooterProps> = (props) => {
  const { userName, userRole, userSrc, onToggleRail, onSettingsClick, extraActionsSlot } = props;
  const { isRail, containerClasses, consoleClasses, technicalButtonClasses } = useSidebarFooter(props);

  return (
    <footer className={containerClasses}>
      {/* 1. Bloque de Identidad de Usuario */}
      <div className={`flex items-center ${isRail ? 'justify-center' : 'gap-3 px-1'}`}>
        <UserAvatar 
          name={userName} 
          src={userSrc} 
          size={isRail ? "md" : "sm"} 
          withStatus 
          status="online" 
        />
        
        {!isRail && (
          <div className="flex-1 min-w-0 flex flex-col">
            <TechnicalLabel variant="white" size="xs" isWide={false} className="truncate">
              {userName.split('@')[0]}
            </TechnicalLabel>
            <TechnicalLabel variant="muted" size="nano" className="truncate mt-0.5">
              {userRole || 'Tenant_User'}
            </TechnicalLabel>
          </div>
        )}
      </div>

      {/* 2. Slot de Acciones Extra (Opcional) */}
      {extraActionsSlot && (
        <div className={`flex ${isRail ? 'flex-col items-center' : 'px-1'} gap-2`}>
          {extraActionsSlot}
        </div>
      )}

      {/* 3. Consola de Control Técnica */}
      <div className={consoleClasses}>
        <button 
          onClick={onSettingsClick}
          className={technicalButtonClasses}
          title="Ajustes de cuenta"
        >
          <Settings size={18} />
        </button>

        {!isRail && (
          <div className="h-4 w-[0.5px] bg-black/10 dark:bg-white/10 mx-1" />
        )}

        <button 
          onClick={onToggleRail}
          className={technicalButtonClasses}
          title={isRail ? 'Expandir' : 'Contraer'}
        >
          {isRail ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>
    </footer>
  );
};
