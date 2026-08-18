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
  footerSlot,
  label,
  visible = true,
  headerRows = 1,
  showFooter,
  footerRows = 1,
  contentScrollable = true,
  width = 'standard',
  collapsible = false,
  collapsed: controlledCollapsed,
  showCollapsedTrigger = true,
  defaultCollapsed = false,
  collapsedPresentation = 'rail',
  onCollapsedChange,
  collapseIcon,
  expandIcon,
  headerSlot,
  className = '',
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const collapsed = controlledCollapsed ?? internalCollapsed;
  const footerContent = footerSlot ?? footer;
  const shouldRenderFooter = showFooter ?? Boolean(footerContent);
  const toggleCollapsed = () => {
    const nextCollapsed = !collapsed;
    setInternalCollapsed(nextCollapsed);
    onCollapsedChange?.(nextCollapsed);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label={label}
      id="module-context-sidebar"
      data-testid="module-context-sidebar"
      data-collapsed={collapsed}
      data-width={collapsed ? 'rail' : width}
      data-content-scrollable={!collapsed && contentScrollable}
      className={`${collapsed && !showCollapsedTrigger ? 'hidden' : collapsed && collapsedPresentation === 'trigger' ? 'contents' : `border-border-technical bg-shell-canvas flex min-h-0 shrink-0 flex-col overflow-hidden border-r max-lg:absolute max-lg:inset-0 max-lg:z-40 max-lg:h-full max-lg:w-full max-lg:border-b max-lg:border-r-0 ${collapsed ? 'w-14' : widthClasses[width]}`} ${className}`}
    >
      {!collapsed || collapsedPresentation !== 'trigger' ? (
        <div className={`border-border-technical flex min-h-14 min-w-0 shrink-0 items-center justify-between gap-2 overflow-hidden border-b px-4 ${headerRows > 1 ? 'flex-wrap py-2' : ''}`}>
          {!collapsed ? <h2 className="text-primary min-w-0 truncate text-lpd-lg font-semibold leading-tight">{label}</h2> : null}
          {headerSlot ? <div className="flex min-w-0 shrink-0 items-center">{headerSlot}</div> : null}
          {
            <button
              type="button"
              aria-label={collapsed ? `Expand ${label}` : `Collapse ${label}`}
              aria-expanded={!collapsed}
              onClick={toggleCollapsed}
              className="text-text-muted hover:text-text-main ml-auto hidden rounded p-1 text-sm max-lg:hidden lg:block"
            >
              {collapsed ? (expandIcon ?? <Menu aria-hidden="true" size={16} />) : (collapseIcon ?? <Menu aria-hidden="true" size={16} />)}
            </button>
          }
        </div>
      ) : null}
      {!collapsed ? <div className={`custom-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden ${contentScrollable ? 'overflow-y-auto' : 'overflow-y-hidden'}`}>{children}</div> : null}
      {!collapsed && shouldRenderFooter && footerContent ? <div className={`border-border-technical min-w-0 shrink-0 border-t p-3 ${footerRows > 1 ? 'flex flex-wrap gap-2' : ''}`}>{footerContent}</div> : null}
    </aside>
  );
};

export const ContextPanel = ModuleContextSidebar;

export * from './types';
