import React from 'react';

/**
 * @types ActionMenu
 * Official contract for ActionMenu items across the Architect module.
 */

export type ActionMenuVariant = 'neutral' | 'primary' | 'danger' | 'success';

export interface ActionMenuItem {
  id: string;
  label: string;
  icon?: string;
  onClick: () => void;
  variant?: ActionMenuVariant;
  disabled?: boolean;
}

export interface ActionMenuProps {
  /** Items to render in the menu (Data-driven approach) */
  items?: ActionMenuItem[];
  /** Custom content (Composition approach) */
  children?: React.ReactNode;
  /** Alignment of the dropdown */
  align?: 'left' | 'right';
  /** Optional external control of the open state */
  isOpen?: boolean;
  /** Optional custom trigger button */
  trigger?: React.ReactNode;
}
