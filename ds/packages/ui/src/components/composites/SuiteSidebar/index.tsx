'use client';

import React from 'react';
import { 
  TechnicalSurface, 
  BrandLogo, 
  Text, 
  Heading, 
  Divider 
} from '../../../atoms';
import { SuiteSidebarProps } from './types';
import { useSuiteSidebar } from './useSuiteSidebar';
import { SidebarItem, SidebarGroup, ExitHatch } from './components';

/**
 * @component SuiteSidebar
 * @description Controlador de contexto de nivel Suite. 
 * Orquesta la navegación modular y la identidad de la suite activa.
 * @category Composites
 * @phase 1
 */
export const SuiteSidebar: React.FC<SuiteSidebarProps> = (props) => {
  const { 
    onExitToOS, 
    onToggleNavMode, 
    onNavigate, 
    accessMap,
    telemetry = {},
    profileSlot 
  } = props;

  const {
    isRail,
    visibleGroups,
    containerClasses,
    scrollAreaClasses,
    suite,
    exitHatch,
    activeModuleId
  } = useSuiteSidebar(props);

  return (
    <TechnicalSurface 
      variant="canvas" 
      depth="flat" 
      className={containerClasses}
    >
      {/* 1. Header: Suite Identity */}
      <div className="p-6 shrink-0 flex flex-col gap-4">
        <BrandLogo variant={isRail ? 'isotype' : 'full'} size="sm" />
        
        {!isRail && (
          <div className="mt-2 flex items-center gap-3">
            <div 
              className="w-1 h-6 rounded-full bg-primary shadow-[0_0_8px_rgba(19,91,236,0.4)]" 
              style={{ backgroundColor: suite.accentColor }} 
            />
            <Heading size="sm" weight="black" className="uppercase tracking-widest text-slate-900 dark:text-white">
              {suite.suiteName}
            </Heading>
          </div>
        )}
      </div>

      {/* 2. Exit Hatch: Back to OS (Separador técnico 0.5px) */}
      <div className="px-4 shrink-0">
        <Divider className="mb-4 opacity-50" />
        <ExitHatch 
          isRail={isRail} 
          label={exitHatch.label} 
          icon={exitHatch.icon} 
          onClick={onExitToOS} 
        />
        <Divider className="mt-4 opacity-50" />
      </div>

      {/* 3. Main Navigation: Grupos e Items (Scrollable) */}
      <nav className={scrollAreaClasses}>
        <div className="p-4 space-y-8">
          {visibleGroups.map((group) => (
            <SidebarGroup 
              key={group.id} 
              group={group} 
              isRail={isRail}
              activeModuleId={activeModuleId}
              accessMap={accessMap}
              telemetry={telemetry}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>

      {/* 4. Footer: Perfil y Control de Densidad */}
      <div className="p-4 border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-black/20 shrink-0">
        {profileSlot}
        
        <button 
          onClick={onToggleNavMode}
          className="w-full mt-2 p-2 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-all flex items-center justify-center"
          title={isRail ? 'Expandir' : 'Contraer'}
        >
          <div className={`transition-transform duration-500 ${isRail ? 'rotate-180' : 'rotate-0'}`}>
            <span className="material-symbols-outlined text-[20px]">side_navigation</span>
          </div>
        </button>
      </div>
    </TechnicalSurface>
  );
};
