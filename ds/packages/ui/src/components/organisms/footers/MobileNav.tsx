import React from 'react';
import { Box, Inline, SafeArea, Stack } from '../../../components/layout';
import { cn } from '../../../helpers/cn';

export interface MobileNavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  active?: boolean;
}

export interface MobileNavProps {
  items: MobileNavItem[];
  onItemClick?: (id: string) => void;
  className?: string;
}

export const MobileNav: React.FC<MobileNavProps> = ({ 
  items, 
  onItemClick,
  className 
}) => {
  return (
    <Box 
      as="nav" 
      background="base" 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--lpd-color-border-subtle)] md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.05)]",
        className
      )}
    >
      <SafeArea bottom>
        <div className="h-16 px-2">
          <Inline justify="around" align="center" className="h-full" gap={0} wrap={false}>
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onItemClick?.(item.id)}
                  className={cn(
                    "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all",
                    item.active 
                      ? "text-[var(--lpd-color-brand-primary)]" 
                      : "text-[var(--lpd-color-text-muted)]"
                  )}
                >
                  <Icon size={20} strokeWidth={item.active ? 2.5 : 2} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">
                    {item.label}
                  </span>
                  {item.active && (
                    <div className="w-1 h-1 rounded-full bg-current absolute bottom-2" />
                  )}
                </button>
              );
            })}
          </Inline>
        </div>
      </SafeArea>
    </Box>
  );
};
