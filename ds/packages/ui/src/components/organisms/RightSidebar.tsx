import React, { useState } from 'react';
import { cn } from '@/helpers/cn';
import { Box, Stack, Inline } from '@/components/layout';
import { X } from 'lucide-react';

export interface RightSidebarTab {
  id: string;
  icon: React.ElementType;
  label: string;
}

export interface RightSidebarProps {
  children: React.ReactNode;
  title?: string;
  isOpen: boolean;
  onClose?: () => void;
  width?: 'sm' | 'md' | 'lg';
  tabs?: RightSidebarTab[];
  activeTabId?: string;
  onTabChange?: (id: string) => void;
  className?: string;
}

const widthMap = {
  sm: 'w-64',
  md: 'w-80',
  lg: 'w-96',
};

export const RightSidebar: React.FC<RightSidebarProps> = ({
  children,
  title,
  isOpen,
  onClose,
  width = 'md',
  tabs = [],
  activeTabId,
  onTabChange,
  className,
}) => {
  const hasTabs = tabs.length > 0;

  return (
    <aside
      className={cn(
        "h-full bg-[var(--lpd-color-bg-base)] border-l border-[var(--lpd-color-border-subtle)] transition-all duration-300 ease-in-out overflow-hidden flex shrink-0",
        isOpen ? (hasTabs ? 'w-[calc(theme(spacing.80)+theme(spacing.12))]' : widthMap[width]) : "w-0 border-l-0 opacity-0",
        className
      )}
    >
      {/* INTERNAL RAIL (Optional) */}
      {hasTabs && (
        <nav className="w-12 border-r border-[var(--lpd-color-border-subtle)] flex flex-col items-center py-6 bg-[var(--lpd-color-bg-subtle)]/30 shrink-0">
          <Stack gap={5}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTabId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                    isActive 
                      ? "bg-[var(--lpd-color-primary)] text-white shadow-sm" 
                      : "text-[var(--lpd-color-text-muted)] hover:text-[var(--lpd-color-text-base)]"
                  )}
                  title={tab.label}
                >
                  <Icon size={18} />
                </button>
              );
            })}
          </Stack>
        </nav>
      )}

      {/* CONTENT AREA */}
      <Box className="flex-1 min-w-0 h-full flex flex-col">
        {/* Header */}
        <Box padding={4} className="border-b border-[var(--lpd-color-border-subtle)] bg-[var(--lpd-color-bg-subtle)]/50">
          <Inline justify="between" align="center">
            <h3 className="font-bold text-sm tracking-tight">{title || 'Details'}</h3>
            {onClose && (
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-[var(--lpd-color-bg-subtle)] rounded-lg transition-colors"
              >
                <X size={16} className="text-[var(--lpd-color-text-muted)]" />
              </button>
            )}
          </Inline>
        </Box>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {children}
        </div>
      </Box>
    </aside>
  );
};
