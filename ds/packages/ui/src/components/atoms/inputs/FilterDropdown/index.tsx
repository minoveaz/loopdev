'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../../../helpers/cn';
import { Icon } from '../../surfaces/Icon';
import { FilterDropdownProps } from './types';

/**
 * @component FilterDropdown
 * @description Componente de filtrado multi-selección estandarizado de LoopDev OS.
 * Diseñado para barras de herramientas técnicas de baja densidad.
 */
export const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
  icon, 
  label, 
  options, 
  selected, 
  onToggle,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasSelection = selected.length > 0;

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      {/* Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative flex items-center rounded-lg transition-all duration-200 cursor-pointer",
          "bg-surface-light dark:bg-surface-dark border",
          hasSelection 
            ? 'border-primary/40 ring-1 ring-primary/10' 
            : 'border-border-subtle hover:border-primary/40',
          "px-3 h-[30px] text-xs text-text-muted"
        )}
      >
        <div className="flex items-center gap-2 w-full pr-4 overflow-hidden">
          <Icon name={icon as any} size="sm" className="opacity-60 flex-shrink-0" />
          <span className="truncate">{label}</span>
          {hasSelection && (
            <span className="bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold ml-auto flex-shrink-0 animate-in zoom-in duration-200">
              {selected.length}
            </span>
          )}
        </div>
        <Icon 
          name={isOpen ? "expand_less" : "expand_more"} 
          size="sm" 
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none opacity-60" 
        />
      </div>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 z-[100] w-full min-w-[200px] bg-surface-light dark:bg-surface-dark border border-border-subtle rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="p-1.5 flex flex-col gap-0.5 max-h-[240px] overflow-y-auto">
            {options.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <button
                  key={option}
                  onClick={() => onToggle(option)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-150 w-full text-left cursor-pointer",
                    isSelected 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : 'text-text-muted hover:bg-surface-light dark:hover:bg-surface-dark hover:text-text-main'
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
                    isSelected 
                      ? 'bg-primary border-primary' 
                      : 'border-border-subtle'
                  )}>
                    {isSelected && (
                      <Icon name="check" size="sm" className="text-white" />
                    )}
                  </div>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
