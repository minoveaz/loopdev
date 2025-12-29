import React from 'react';
import { useLayout } from '../../providers/layout-provider';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '../../helpers/cn';

export interface SidebarToggleProps {
  className?: string;
}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({ className }) => {
  const { sidebarVariant, toggleSidebar } = useLayout();
  const isCollapsed = sidebarVariant === 'collapsed';

  return (
    <button
      onClick={toggleSidebar}
      className={cn(
        "p-2 hover:bg-black/5 rounded-lg transition-colors text-[var(--lpd-color-text-muted)] hover:text-[var(--lpd-color-text-base)]",
        className
      )}
      title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
    </button>
  );
};
