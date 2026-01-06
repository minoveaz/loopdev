'use client';

import React from 'react';
import { Search, Command } from 'lucide-react';
import { CommandBarTriggerProps } from './types';
import { useCommandBarTrigger } from './useCommandBarTrigger';

/**
 * @component CommandBarTrigger
 * @description Átomo que actúa como disparador de la paleta de comandos de LoopDev OS.
 * @category Foundations
 * @phase 1
 */
export const CommandBarTrigger: React.FC<CommandBarTriggerProps> = (props) => {
  const { placeholder = 'Search or type a command...', shortcut = '⌘K', onOpen } = props;
  const { 
    isIconMode,
    containerClasses,
    placeholderClasses,
    shortcutClasses 
  } = useCommandBarTrigger(props);

  return (
    <button 
      onClick={onOpen}
      className={containerClasses}
      aria-label="Abrir paleta de comandos"
    >
      <Search size={16} className="text-text-muted/80 group-hover:text-primary transition-colors" />

      {!isIconMode && (
        <>
          <span className={placeholderClasses}>{placeholder}</span>
          <div className={shortcutClasses}>
            {shortcut}
          </div>
        </>
      )}
    </button>
  );
};
