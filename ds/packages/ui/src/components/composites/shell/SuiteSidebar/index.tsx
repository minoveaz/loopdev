import React, { useRef, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { TechnicalSurface, ScrollArea } from '../../../atoms';
import { SidebarFooter } from '../SidebarFooter';
import { SuiteSidebarContextualAction, SuiteSidebarProps } from './types';
import { useSuiteSidebar } from './useSuiteSidebar';
import { NavSidebarGroup } from './components';
import { NavSidebarItem } from '../../../atoms';

const isSuiteSidebarContextualAction = (
  action: SuiteSidebarProps['contextualAction'],
): action is SuiteSidebarContextualAction =>
  typeof action === 'object' && action !== null && 'type' in action && action.type === 'contextual-action';

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
  const ContextualActionIcon = isSuiteSidebarContextualAction(props.contextualAction)
    ? (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>>)[
        props.contextualAction.icon
      ] ?? LucideIcons.HelpCircle
    : null;
  const contextualAction =
    typeof props.contextualAction === 'function'
      ? props.contextualAction(renderAsRail)
      : isSuiteSidebarContextualAction(props.contextualAction)
        ? (
            <button
              type="button"
              aria-label={props.contextualAction.label}
              onClick={props.contextualAction.onAction}
              className="text-primary border-primary/30 bg-primary/10 hover:bg-primary flex min-w-0 items-center gap-3 rounded-md border p-2 text-left text-xs font-semibold transition-colors hover:text-white"
            >
              {ContextualActionIcon ? <ContextualActionIcon aria-hidden={true} size={18} className="shrink-0" /> : null}
              {!renderAsRail ? <span className="truncate">{props.contextualAction.label}</span> : null}
            </button>
          )
        : props.contextualAction;
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
      border="none"
      className={`${containerClasses} ${shouldExpandOnHover ? `sidebar-hover-surface ${isHoverExpanded || isControlMenuOpen ? '!w-56' : '!w-16'}` : ''} border-border-technical bg-shell-canvas h-full !rounded-none border-r`}
    >
      <div className="flex h-full flex-col">
        {props.headerSlot && !renderAsRail ? (
          <div className="border-border-technical shrink-0 border-b px-4 py-3">
            {props.headerSlot}
          </div>
        ) : null}

        {props.showSuiteHome !== false ? (
          <div className="shrink-0 px-4 py-3" role="menu" aria-label="Suite home">
            <NavSidebarItem
              icon="LayoutDashboard"
              label="Suite Dashboard"
              isRail={renderAsRail}
              revealOnHover={shouldExpandOnHover}
              isActive={!activeModuleId}
              onNavigate={onNavigate}
              route={suite.route || { routeId: '/' }}
              accentColor={suite.accentColor}
            />
          </div>
        ) : null}

        {contextualAction ? (
          <div
            className={`shrink-0 pb-3 ${
              renderAsRail ? 'flex w-full items-center justify-center overflow-visible px-0' : 'px-4'
            }`}
          >
            {contextualAction}
          </div>
        ) : null}

        <div className="mx-4 h-[0.5px] shrink-0 bg-black/5 dark:bg-white/10" />

        {/* Navigation groups (scrollable) */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ScrollArea visibility={renderAsRail ? 'hidden' : 'auto'} className="h-full">
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
        </div>

        {props.mobileMode && props.mobileActions ? (
          <div className="border-border-technical border-t px-4 py-3">
            {props.mobileActions}
          </div>
        ) : null}

        {/* Sidebar behavior selector */}
        <SidebarFooter
          className="hidden lg:block"
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
