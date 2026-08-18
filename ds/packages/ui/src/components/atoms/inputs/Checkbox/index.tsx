'use client';

import React, { forwardRef, useId } from 'react';
import { cn } from '../../../../lib/utils';
import { Icon } from '../../surfaces/Icon';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ label, id, className, disabled, indeterminate = false, checked, defaultChecked, ...props }, ref) => {
  const generatedId = useId();
  const checkboxId = id ?? `checkbox-${generatedId}`;

  return (
    <label htmlFor={checkboxId} className={cn('inline-flex items-center gap-2', disabled && 'cursor-not-allowed opacity-50', className)}>
      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        <input
          {...props}
          checked={checked}
          defaultChecked={defaultChecked}
          ref={(input) => {
            if (input) input.indeterminate = indeterminate;
            if (typeof ref === 'function') ref(input);
            else if (ref) ref.current = input;
          }}
          id={checkboxId}
          type="checkbox"
          disabled={disabled}
          className="peer absolute inset-0 z-10 m-0 h-full w-full cursor-pointer opacity-0"
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[4px] border-2 border-text-muted bg-surface-light transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 peer-disabled:opacity-50 dark:bg-surface-dark" />
        {(checked === true || (checked === undefined && defaultChecked === true)) && <Icon name="check" size="sm" aria-hidden="true" className="pointer-events-none absolute text-white" />}
        {indeterminate && <span aria-hidden="true" className="pointer-events-none absolute h-0.5 w-2 bg-white" />}
      </span>
      {label && <span className="text-sm text-text-main dark:text-white">{label}</span>}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
