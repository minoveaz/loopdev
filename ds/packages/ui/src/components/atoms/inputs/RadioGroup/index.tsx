'use client';

import { useId } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { cn } from '../../../../lib/utils';

export interface RadioGroupOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label?: string;
  name?: string;
  options: RadioGroupOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function RadioGroup({
  label,
  name,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  orientation = 'vertical',
  className,
}: RadioGroupProps) {
  const generatedName = useId();
  const groupName = name ?? `radio-group-${generatedName}`;

  return (
    <fieldset className={cn('space-y-2', className)} disabled={disabled}>
      {label && (
        <legend className="text-sm font-black uppercase tracking-widest text-text-muted">
          {label}
        </legend>
      )}
      <div
        className={cn('flex gap-3', orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap')}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 text-sm text-text-main dark:text-white',
              option.disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <input
              type="radio"
              name={groupName}
              value={option.value}
              checked={value !== undefined ? value === option.value : undefined}
              defaultChecked={value === undefined ? defaultValue === option.value : undefined}
              disabled={disabled || option.disabled}
              onChange={(event) => onValueChange?.(event.target.value, event)}
              className="h-4 w-4 accent-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
