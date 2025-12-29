import React, { useState } from 'react';
import { useTenant } from '../../providers/tenant-provider';
import { TENANT_DATA } from '../../data/tenants';
import { cn } from '../../helpers/cn';
import { Stack, Box, Inline } from '../../components/layout';
import { ChevronRight } from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  flyoutContent?: React.ReactNode;
  active?: boolean;
}

import { useLayout } from '../../providers/layout-provider';

export interface LeftSidebarProps {
  items: SidebarItem[];
  onItemClick?: (id: string) => void;
  className?: string;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ 
  items, 
  onItemClick,
  className 
}) => {
  const { tenant } = useTenant();
  const { sidebarVariant } = useLayout();
  const data = TENANT_DATA[tenant];
  const [activeFlyout, setActiveFlyout] = useState<string | null>(null);
  const isCollapsed = sidebarVariant === 'collapsed';
  const isBrandStyle = (data.settings.layout as any).sidebarStyle === 'brand';

  const handleItemClick = (item: SidebarItem) => {
    if (item.flyoutContent) {
      setActiveFlyout(activeFlyout === item.id ? null : item.id);
    } else {
      setActiveFlyout(null);
    }
    onItemClick?.(item.id);
  };

  return (
    <div className={cn("flex h-full relative", className)}>
      {/* RAIL / SIDEBAR BODY */}
      <aside className={cn(
        "flex flex-col py-6 z-30 transition-all duration-300",
        isBrandStyle 
          ? "bg-[var(--lpd-color-brand-secondary)] border-white/5 text-white" 
          : "bg-[var(--lpd-color-bg-base)] border-r border-[var(--lpd-color-border-subtle)] text-[var(--lpd-color-text-base)]",
        isCollapsed ? "w-20 items-center" : "w-64"
      )}>
        <Stack gap={2} className="w-full px-3">
          {items.map((item) => {
            const Icon = item.icon;
            const isFlyoutOpen = activeFlyout === item.id;
            const isActive = item.active || isFlyoutOpen;
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={cn(
                  "w-full flex items-center rounded-xl transition-all group relative",
                  isCollapsed ? "aspect-square justify-center" : "px-4 py-3 gap-3",
                  isActive
                    ? (isBrandStyle ? "bg-white/10 text-white shadow-none" : "bg-[var(--lpd-color-primary)] text-white shadow-lg shadow-[var(--lpd-color-primary)]/10")
                    : (isBrandStyle ? "text-white/60 hover:bg-white/5 hover:text-white" : "text-[var(--lpd-color-text-muted)] hover:bg-[var(--lpd-color-bg-subtle)] hover:text-[var(--lpd-color-text-base)]")
                )}
                title={isCollapsed ? item.label : undefined}
              >
                {isActive && isBrandStyle && (
                  <div className="absolute left-0 w-1 h-6 bg-[var(--lpd-color-brand-primary)] rounded-r-full" />
                )}

                <Icon size={isCollapsed ? 24 : 20} className={cn(
                  "transition-transform shrink-0",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )} />
                
                {!isCollapsed && (
                  <span className="text-sm font-medium truncate animate-in fade-in slide-in-from-left-2 duration-300">
                    {item.label}
                  </span>
                )}

                {item.flyoutContent && (
                  <div className={cn(
                    "absolute rounded-full transition-all",
                    isCollapsed 
                      ? "right-1 bottom-1 w-1.5 h-1.5" 
                      : "right-3 top-1/2 -translate-y-1/2 w-1 h-1",
                    isActive ? "bg-white" : (isBrandStyle ? "bg-white/20" : "bg-[var(--lpd-color-primary)] opacity-40")
                  )} />
                )}
              </button>
            );
          })}
        </Stack>
      </aside>

      {/* FLYOUT: The contextual panel */}
      {items.map((item) => {
        if (!item.flyoutContent) return null;
        const isOpen = activeFlyout === item.id;
        
        return (
          <div
            key={`flyout-${item.id}`}
            className={cn(
              "absolute top-0 h-full w-64 bg-[var(--lpd-color-bg-base)] border-r border-[var(--lpd-color-border-subtle)] shadow-2xl transition-all duration-300 ease-in-out z-20",
              isCollapsed ? "left-20" : "left-64",
              isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
            )}
          >
            <Box padding={6} className="h-full overflow-y-auto custom-scrollbar">
              <Stack gap={6}>
                <h3 className="font-bold text-xs uppercase tracking-widest text-[var(--lpd-color-text-muted)]">
                  {item.label}
                </h3>
                {item.flyoutContent}
              </Stack>
            </Box>
          </div>
        );
      })}
    </div>
  );
};