
import React from 'react';

export interface ActionMenuItem {
  id: string;
  label: string;
  icon?: string;
  onClick: () => void;
  variant?: 'neutral' | 'danger' | 'primary';
  disabled?: boolean;
}

// Helper to determine item styles based on variant
export const getItemStyles = (variant: string = 'neutral') => {
  switch (variant) {
    case 'danger':
      return 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20';
    case 'primary':
      return 'text-primary hover:bg-primary/5';
    default:
      return 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800';
  }
};
