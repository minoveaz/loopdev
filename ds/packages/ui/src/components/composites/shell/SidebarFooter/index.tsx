'use client';

import React from 'react';
import { PanelLeft } from 'lucide-react';
import { TechnicalDropdown, TechnicalDropdownGroup, TechnicalDropdownItem } from '../../../atoms';
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
  const { onNavModeChange } = props;
  const { isRail, containerClasses, consoleClasses } = useSidebarFooter(props);
  const navMode = props.navMode ?? (isRail ? 'rail' : 'expanded');
  const menuIsRail = isRail || navMode === 'hover';
  const modeLabels = {
    expanded: 'Expanded',
    rail: 'Collapsed',
    hover: 'Expand on hover',
  } as const;

  return (
    <footer
      className={containerClasses}
      onMouseEnter={() => props.onFooterHoverChange?.(true)}
      onMouseLeave={() => props.onFooterHoverChange?.(false)}
    >
      <div className={consoleClasses}>
        {onNavModeChange && (
          <TechnicalDropdown
            side={menuIsRail ? 'right' : 'top'}
            align="end"
            sideOffset={8}
            onOpenChange={props.onMenuOpenChange}
            trigger={
              <button
                type="button"
                aria-label="Sidebar control"
                onPointerDown={props.onMenuTrigger}
                className="text-text-muted hover:bg-accent/10 hover:text-accent dark:hover:bg-accent/15 dark:hover:text-accent focus-visible:ring-primary flex size-10 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2"
              >
                <PanelLeft size={18} aria-hidden="true" />
              </button>
            }
          >
            <TechnicalDropdownGroup label="Sidebar control">
              {(Object.entries(modeLabels) as Array<[typeof navMode, string]>).map(
                ([mode, label]) => (
                  <TechnicalDropdownItem
                    key={mode}
                    isActive={navMode === mode}
                    onSelect={() => onNavModeChange(mode)}
                  >
                    <span
                      className={`size-2 rounded-full ${navMode === mode ? 'bg-primary' : 'border border-text-muted'}`}
                    />
                    {label}
                  </TechnicalDropdownItem>
                ),
              )}
            </TechnicalDropdownGroup>
          </TechnicalDropdown>
        )}
      </div>
    </footer>
  );
};
