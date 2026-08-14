'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import type { ModuleContextSidebarProps } from './types';

const widthClasses = {
  narrow: 'w-48',
  standard: 'w-64',
  wide: 'w-72',
  'extra-wide': 'w-80',
} as const;

export const ModuleContextSidebar: React.FC<ModuleContextSidebarProps> = ({
  children,
  footer,
  label,
  width = 'standard',
  collapsible = false,
  collapsed: controlledCollapsed,
  showCollapsedTrigger = true,
  defaultCollapsed = false,
  collapsedPresentation = 'rail',
  onCollapsedChange,
  collapseIcon,
  expandIcon,
  className = '',
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const collapsed = controlledCollapsed ?? internalCollapsed;
  const toggleCollapsed = () => {
    const nextCollapsed = !collapsed;
    setInternalCollapsed(nextCollapsed);
    onCollapsedChange?.(nextCollapsed);
  };

  return (
    <aside
      aria-label={label}
      data-testid="module-context-sidebar"
      data-collapsed={collapsed}
      className={`${collapsed && !showCollapsedTrigger ? 'hidden' : collapsed && collapsedPresentation === 'trigger' ? 'contents' : `border-border-technical bg-shell-canvas flex min-h-0 shrink-0 flex-col overflow-hidden border-r max-lg:max-h-64 max-lg:w-full max-lg:border-b max-lg:border-r-0 ${collapsed ? 'w-14' : widthClasses[width]}`} ${className}`}
    >
      {!collapsed || collapsedPresentation !== 'trigger' ? (
        <div className="border-border-technical flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
          {!collapsed ? <h2 className="text-primary text-lpd-lg font-semibold leading-tight">{label}</h2> : null}
          {collapsible ? (
            <button
              type="button"
              aria-label={collapsed ? `Expand ${label}` : `Collapse ${label}`}
              aria-expanded={!collapsed}
              onClick={toggleCollapsed}
              className="text-text-muted hover:text-text-main ml-auto rounded p-1 text-sm"
            >
              {collapsed ? (expandIcon ?? <Menu aria-hidden="true" size={16} />) : (collapseIcon ?? <Menu aria-hidden="true" size={16} />)}
            </button>
          ) : null}
        </div>
      ) : null}
      {!collapsed ? <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">{children}</div> : null}
      {!collapsed && footer ? <div className="border-border-technical shrink-0 border-t p-3">{footer}</div> : null}
    </aside>
  );
};

export const ContextPanel = ModuleContextSidebar;

export * from './types';
