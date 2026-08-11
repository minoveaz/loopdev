import React, { useRef, useState } from 'react';
import { TechnicalSurface, ScrollArea } from '../../../atoms';
import { SidebarFooter } from '../SidebarFooter';
import { SuiteSidebarProps } from './types';
import { useSuiteSidebar } from './useSuiteSidebar';
import { NavSidebarGroup } from './components';
import { NavSidebarItem } from '../../../atoms';

/**
 * @component SuiteSidebar (Context Controller v1.0)
 * @description Controlador de contexto de nivel Suite.
 * Implementa la arquitectura de 5 niveles y los principios visuales v3.8.
 * @category Composites
 */
export const SuiteSidebar: React.FC<SuiteSidebarProps> = (props) => {
  const [isHoverExpanded, setIsHoverExpanded] = useState(false);
  const [isControlMenuOpen, setIsControlMenuOpen] = useState(false);
  const [isFooterHovered, setIsFooterHovered] = useState(false);
  const isSidebarHovered = useRef(false);
  const hoverCollapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { onNavModeChange, onNavigate, accessMap, telemetry = {} } = props;

  const { isRail, visibleGroups, containerClasses, suite, activeModuleId } = useSuiteSidebar(props);
  const shouldExpandOnHover = props.navMode === 'hover' && !props.mobileMode;
  const renderAsRail = isRail && !(shouldExpandOnHover && (isHoverExpanded || isControlMenuOpen));
  const clearHoverCollapse = () => {
    if (hoverCollapseTimer.current) {
      clearTimeout(hoverCollapseTimer.current);
      hoverCollapseTimer.current = null;
    }
  };
  const scheduleHoverCollapse = () => {
    clearHoverCollapse();
    hoverCollapseTimer.current = setTimeout(() => {
      hoverCollapseTimer.current = null;
      if (!isControlMenuOpen && !isFooterHovered && !isSidebarHovered.current) {
        setIsHoverExpanded(false);
      }
    }, 150);
  };

  return (
    <TechnicalSurface
      variant="canvas"
      depth="flat"
      overflow="visible"
      onMouseEnter={
        shouldExpandOnHover
          ? () => {
              clearHoverCollapse();
              isSidebarHovered.current = true;
              setIsHoverExpanded(true);
            }
          : undefined
      }
      onMouseLeave={
        shouldExpandOnHover
          ? () => {
              isSidebarHovered.current = false;
              if (!isControlMenuOpen && !isFooterHovered) scheduleHoverCollapse();
            }
          : undefined
      }
      className={`${containerClasses} ${shouldExpandOnHover ? `sidebar-hover-surface ${isHoverExpanded || isControlMenuOpen ? '!w-64' : '!w-16'}` : ''} h-full border-r border-border-technical bg-shell-canvas`}
    >
      <div className="flex flex-col h-full">
        {/* Suite dashboard */}
        <div className="shrink-0 px-4 py-3" role="menu" aria-label="Suite home">
          <NavSidebarItem
            icon="LayoutDashboard"
            label="Suite Dashboard"
            isRail={renderAsRail}
            revealOnHover={shouldExpandOnHover}
            isActive
            onNavigate={onNavigate}
            route={suite.route || { routeId: '/' }}
            accentColor={suite.accentColor}
          />
        </div>

        <div className="mx-4 h-[0.5px] shrink-0 bg-black/5 dark:bg-white/10" />

        {/* Navigation groups (scrollable) */}
        <ScrollArea visibility={renderAsRail ? 'hidden' : 'auto'} className="flex-1">
          <nav className="space-y-8 p-4 pb-8">
            {visibleGroups.map((group) => (
              <NavSidebarGroup
                key={group.id}
                group={group}
                isRail={renderAsRail}
                revealOnHover={shouldExpandOnHover}
                activeModuleId={activeModuleId}
                accessMap={accessMap}
                telemetry={telemetry}
                onNavigate={onNavigate}
                accentColor={suite.accentColor}
              />
            ))}
          </nav>
        </ScrollArea>

        {/* Sidebar behavior selector */}
        <SidebarFooter
          isRail={renderAsRail}
          navMode={props.navMode === 'hover' ? 'hover' : isRail ? 'rail' : 'expanded'}
          onMenuTrigger={() => {
            if (shouldExpandOnHover) setIsHoverExpanded(true);
          }}
          onFooterHoverChange={(hovered) => {
            setIsFooterHovered(hovered);
            if (shouldExpandOnHover && hovered) {
              clearHoverCollapse();
              setIsHoverExpanded(true);
            }
          }}
          onMenuOpenChange={(open) => {
            setIsControlMenuOpen(open);
            if (open) {
              clearHoverCollapse();
              setIsHoverExpanded(true);
            } else if (!isSidebarHovered.current && !isFooterHovered) {
              scheduleHoverCollapse();
            }
          }}
          onNavModeChange={onNavModeChange}
        />
      </div>
    </TechnicalSurface>
  );
};
