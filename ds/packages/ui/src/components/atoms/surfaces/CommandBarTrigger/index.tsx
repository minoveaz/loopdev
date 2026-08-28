'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { StatusPulse } from '../..';
import { CommandBarTriggerProps } from './types';
import { useCommandBarTrigger } from './useCommandBarTrigger';

/**
 * @component CommandBarTrigger
 * @description Átomo que actúa como disparador de la paleta de comandos de LoopDev OS.
 * @category Foundations
 * @phase 1
 */
export const CommandBarTrigger: React.FC<CommandBarTriggerProps> = (props) => {
  const { placeholder, shortcut = '⌘K', onOpen } = props;
  const { 
    isIconMode,
    containerClasses,
    placeholderClasses,
    shortcutClasses 
  } = useCommandBarTrigger(props);

  const { className: _className, onOpen: _onOpen, ...buttonProps } = props;

  return (
    <button
      type="button"
      onClick={onOpen}
      {...buttonProps}
      className={containerClasses}
      aria-label="Abrir paleta de comandos"
    >
      <div className="flex items-center gap-2">
        <Search size={14} className="text-text-muted/80 group-hover:text-accent transition-colors" />
        <StatusPulse variant="innovation" size="md" className="opacity-100" />
      </div>

      {!isIconMode && (
        <>
          {placeholder && <span className={placeholderClasses}>{placeholder}</span>}
          <div className={shortcutClasses}>
            {shortcut}
          </div>
        </>
      )}
    </button>
  );
};
