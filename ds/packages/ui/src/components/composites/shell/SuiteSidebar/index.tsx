import React from 'react';
import {
  TechnicalSurface,
  BrandLogo,
  LpdText,
  Heading,
  Divider,
  ExitHatch,
  IdentityBar,
  TechnicalLabel,
  ScrollArea
} from '../../../atoms';
import { SidebarFooter } from '../SidebarFooter';
import { SidebarIdentity } from '../SidebarIdentity';
import { PanelLeftClose, PanelLeftOpen, Settings, User } from 'lucide-react';
import { SuiteSidebarProps } from './types';
import { useSuiteSidebar } from './useSuiteSidebar';
import {
  NavSidebarGroup
} from './components';

/**
 * @component SuiteSidebar (Context Controller v1.0)
 * @description Controlador de contexto de nivel Suite.
 * Implementa la arquitectura de 5 niveles y los principios visuales v3.8.
 * @category Composites
 */
export const SuiteSidebar: React.FC<SuiteSidebarProps> = (props) => {
  const {
    onExitToOS,
    onToggleNavMode,
    onNavigate,
    onAction,
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

  // Extraer datos del perfil para el footer oficial
  const user = (profileSlot as any)?.props?.user || { email: 'User' };

  return (
    <TechnicalSurface
      variant="canvas"
      depth="flat"
      overflow="visible"
      className={`${containerClasses} h-full border-r border-border-technical bg-shell-canvas`}
    >
      <div className="flex flex-col h-full">

        {/* A. Suite Identity Header (Fijo) */}
        <SidebarIdentity
          logo={<BrandLogo variant={isRail ? 'isotype' : 'full'} size="sm" />}
          name={suite.suiteName}
          accentColor={suite.accentColor}
          isRail={isRail}
          onClick={() => onNavigate({ routeId: '/marketing-studio' })}
        />

        {/* Separador Técnico 0.5px */}
        <div className="mx-4 h-[0.5px] bg-black/5 dark:bg-white/10 shrink-0" />

        {/* B. Exit Hatch (Fijo) */}
        <section className="shrink-0">
          <ExitHatch
            isRail={isRail}
            label={exitHatch.label}
            icon={exitHatch.icon}
            onClick={onExitToOS}
          />
        </section>

        {/* Separador Técnico 0.5px */}
        <div className="mx-4 h-[0.5px] bg-black/5 dark:bg-white/10 shrink-0" />

        {/* C. Navigation Groups (Scrollable) */}
        <ScrollArea visibility={isRail ? 'hidden' : 'auto'} className="flex-1">
          <nav className="p-4 space-y-8">
            {visibleGroups.map((group) => (
              <NavSidebarGroup
                key={group.id}
                group={group}
                isRail={isRail}
                activeModuleId={activeModuleId}
                accessMap={accessMap}
                telemetry={telemetry}
                onNavigate={onNavigate}
                accentColor={suite.accentColor}
              />
            ))}
          </nav>
        </ScrollArea>

        {/* E. Sidebar Footer (Fijo - Consola de Control) */}
        <SidebarFooter
          isRail={isRail}
          userName={user.email}
          userRole="Tenant_Admin"
          onToggleRail={onToggleNavMode}
          onSettingsClick={() => onAction?.('openSettings')}
        />

      </div>
    </TechnicalSurface>
  );
};
