'use client';

import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../../../lib/utils';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({ label, id, className, disabled, checked, defaultChecked, ...props }, ref) => {
  const generatedId = useId();
  const switchId = id ?? `switch-${generatedId}`;

  return (
    <label htmlFor={switchId} className={cn('inline-flex min-h-11 items-center gap-3', disabled && 'cursor-not-allowed opacity-50', className)}>
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input
          {...props}
          ref={ref}
          id={switchId}
          type="checkbox"
          role="switch"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          className="peer sr-only"
        />
        <span aria-hidden="true" className="absolute inset-0 rounded-full border border-border-subtle bg-surface-light transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 dark:bg-surface-dark" />
        <span aria-hidden="true" className="pointer-events-none absolute left-1 h-4 w-4 rounded-full bg-text-muted transition-transform peer-checked:translate-x-5 peer-checked:bg-white" />
      </span>
      {label && <span className="text-sm text-text-main dark:text-white">{label}</span>}
    </label>
  );
});

Switch.displayName = 'Switch';
