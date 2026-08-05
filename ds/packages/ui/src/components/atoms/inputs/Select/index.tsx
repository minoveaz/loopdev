'use client';

import React, { forwardRef } from 'react';
import { cn } from '../../../../lib/utils';
import { SelectProps } from './types';
import { Label } from '../../surfaces/Label';
import { Icon } from '../../surfaces/Icon';

/**
 * @component Select
 * @category Primitives
 * @version 1.0.0
 * @description Selector desplegable industrial homologado.
 * Cumple con VISUAL_COMPOSITION_SYSTEM v3.8 para formularios SaaS.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const {
    label,
    size = 'md',
    fullWidth = true,
    className,
    children,
    disabled,
    id,
    ...rest
  } = props;

  const selectId = id || `select-${React.useId()}`;

  const containerClasses = cn(
    "flex flex-col gap-1.5",
    fullWidth ? "w-full" : "w-fit",
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  const wrapperClasses = cn(
    "relative flex items-center bg-surface-light dark:bg-surface-dark border border-border-subtle hover:border-primary/40 rounded-lg overflow-hidden transition-all duration-200"
  );

  const selectClasses = cn(
    "w-full bg-transparent border-none outline-none appearance-none cursor-pointer",
    (props.value === 'all' || props.value === '') ? "text-text-muted" : "text-text-main dark:text-white",
    size === 'sm' && "px-3 py-1.5 pr-8 text-xs",
    size === 'md' && "px-4 py-2.5 pr-10 text-sm",
    size === 'lg' && "px-5 py-3.5 pr-12 text-base"
  );

  return (
    <div className={containerClasses}>
      {label && (
        <Label 
          as="label"
          htmlFor={selectId} 
          textSize="sm"
          textWeight="black"
          className="uppercase tracking-widest mb-1 text-text-muted"
        >
          {label}
        </Label>
      )}

      <div className={wrapperClasses}>
        <select
          {...rest}
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={selectClasses}
        >
          {children}
        </select>
        <Icon 
          name="expand_more" 
          size={size === 'sm' ? 'sm' : 'md'} 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none opacity-60" 
        />
      </div>
    </div>
  );
});

Select.displayName = 'Select';
