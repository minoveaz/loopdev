'use client';

import React from 'react';
import { Terminal } from 'lucide-react';
import { StatusPulse } from '../StatusPulse';
import { CommandBarTriggerProps } from './types';
import { useCommandBarTrigger } from './useCommandBarTrigger';

/**
 * @component CommandBarTrigger
 * @description Átomo que actúa como disparador de la paleta de comandos de LoopDev OS.
 * @category Foundations
 * @phase 1
 */
export const CommandBarTrigger: React.FC<CommandBarTriggerProps> = (props) => {
  const { placeholder = 'Run a command...', shortcut = '⌘K', onOpen } = props;
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
      <div className="flex items-center gap-2">
        <Terminal size={14} className="text-text-muted/80 group-hover:text-primary transition-colors" />
        <StatusPulse variant="innovation" size="md" className="opacity-100" />
      </div>

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