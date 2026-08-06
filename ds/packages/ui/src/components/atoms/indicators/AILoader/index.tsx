'use client';

import React from 'react';
import { useAILoader } from './useAILoader';
import { AILoaderProps } from './types';

/**
 * @component AILoader (Smart Terminal)
 * @description Indicador de carga textual con estética de terminal.
 * Comunica procesos lógicos complejos mediante una metáfora de escritura de código.
 * @category Feedback
 * @phase 2
 */
export const AILoader: React.FC<AILoaderProps> = (props) => {
  const { displayedText, className } = useAILoader(props);
  const { showCursor = true } = props;

  return (
    <div 
      className={`inline-flex items-center gap-2 font-mono text-sm md:text-base ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Left Bracket */}
      <span className="text-innovation-purple font-bold select-none text-lg">{"{"}</span>
      
      {/* Dynamic Content */}
      <span className="text-text-main dark:text-white min-w-[2ch]">
        {displayedText}
      </span>

      {/* Cursor */}
      {showCursor && (
        <span className="w-2 h-4 bg-energy animate-pulse inline-block align-middle ml-0.5" />
      )}

      {/* Right Bracket */}
      <span className="text-innovation-purple font-bold select-none text-lg">{"}"}</span>
    </div>
  );
};