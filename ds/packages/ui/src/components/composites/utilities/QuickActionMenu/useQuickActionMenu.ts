import { useState } from 'react';
import { QuickActionMenuProps } from './types';

/**
 * @hook useQuickActionMenu
 * @description Lógica para gestionar el estado de apertura y animaciones del menú de creación.
 */
export const useQuickActionMenu = (props: QuickActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // 1. Clases para el disparador (IconButton técnico)
  const triggerClasses = `
    p-2 rounded-lg transition-all duration-300 flex items-center justify-center
    bg-primary/10 text-primary hover:bg-primary hover:text-white shadow-lg shadow-primary/10
    ${isOpen ? 'rotate-45 bg-primary text-white' : 'rotate-0'}
  `.replace(/\s+/g, ' ').trim();

  return {
    isOpen,
    setIsOpen,
    triggerClasses
  };
};
