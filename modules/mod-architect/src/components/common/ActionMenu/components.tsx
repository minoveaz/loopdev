import React from 'react';
import { getItemStyles } from './utils';
import { cn } from '@loopdev/ui';

export const MenuContainer: React.FC<{ children: React.ReactNode; innerRef: React.RefObject<HTMLDivElement | null> }> = ({ children, innerRef }) => (
  <div className="relative inline-block text-left" ref={innerRef}>
    {children}
  </div>
);

export const MenuTrigger: React.FC<{ onClick: () => void; isOpen: boolean }> = ({ onClick, isOpen }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--lpd-color-brand-primary)]/20",
      isOpen 
        ? "bg-[var(--lpd-color-bg-subtle)] text-[var(--lpd-color-brand-primary)] shadow-inner" 
        : "text-[var(--lpd-color-text-muted)] hover:bg-[var(--lpd-color-bg-subtle)] hover:text-[var(--lpd-color-text-base)]"
    )}
    aria-label="More actions"
  >
    <span className="material-symbols-outlined text-[20px]">more_vert</span>
  </button>
);

export const MenuDropdown: React.FC<{ children: React.ReactNode; isOpen: boolean; align?: 'left' | 'right' }> = ({ 
  children, 
  isOpen, 
  align = 'right' 
}) => {
  if (!isOpen) return null;

  const alignmentClass = align === 'right' ? 'right-0' : 'left-0';

  return (
    <div 
      className={cn(
        "absolute mt-2 w-48 rounded-xl border shadow-xl z-50 origin-top-right transform transition-all duration-200 animate-in fade-in zoom-in-95",
        "bg-[var(--lpd-color-bg-base)] border-[var(--lpd-color-border-subtle)]",
        alignmentClass
      )}
      role="menu"
    >
      <div className="py-1">
        {children}
      </div>
    </div>
  );
};

interface MenuItemProps {
  label: React.ReactNode;
  icon?: string;
  onClick: () => void;
  variant?: 'neutral' | 'danger' | 'primary';
  disabled?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({ label, icon, onClick, variant = 'neutral', disabled }) => {
  const styles = getItemStyles(variant);
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed",
        styles
      )}
      role="menuitem"
    >
      {icon && (
        <span className="material-symbols-outlined text-[18px] opacity-70 group-hover:opacity-100 transition-opacity">
          {icon}
        </span>
      )}
      <span className="font-medium">{label}</span>
    </button>
  );
};

export const MenuDivider: React.FC = () => (
  <div className="h-px my-1 bg-[var(--lpd-color-border-subtle)] opacity-50" />
);