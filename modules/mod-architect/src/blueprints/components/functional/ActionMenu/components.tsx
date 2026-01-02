
import React from 'react';
import { getItemStyles } from '@blueprints/components/functional/ActionMenu/utils';

export const MenuContainer: React.FC<{ children: React.ReactNode; innerRef: React.RefObject<HTMLDivElement | null> }> = ({ children, innerRef }) => (
  <div className="relative inline-block text-left" ref={innerRef}>
    {children}
  </div>
);

export const MenuTrigger: React.FC<{ onClick: () => void; isOpen: boolean }> = ({ onClick, isOpen }) => (
  <button
    onClick={onClick}
    className={`
      w-8 h-8 flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20
      ${isOpen ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300'}
    `}
    aria-label="More actions"
    aria-expanded={isOpen}
    aria-haspopup="true"
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
      className={`
        absolute ${alignmentClass} mt-2 w-48 rounded-xl bg-white dark:bg-[#1e293b] shadow-xl ring-1 ring-black/5 dark:ring-white/10 z-50 origin-top-right transform transition-all duration-200 ease-out animate-in fade-in zoom-in-95
      `}
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
      className={`
        group flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${styles}
      `}
      role="menuitem"
    >
      {icon && (
        <span className={`material-symbols-outlined text-[18px] opacity-70 group-hover:opacity-100 transition-opacity`}>
          {icon}
        </span>
      )}
      <span className="font-medium">{label}</span>
    </button>
  );
};

export const MenuDivider: React.FC = () => (
  <div className="h-px my-1 bg-slate-100 dark:bg-slate-700" />
);
