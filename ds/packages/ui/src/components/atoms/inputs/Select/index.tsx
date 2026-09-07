'use client';

import React, { forwardRef, useId, useMemo, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { SelectProps } from './types';
import { Label } from '../../surfaces/Label';

/**
 * @component Select
 * @category Primitives
 * @version 2.0.0
 * @description Modernized dropdown selector with Untitled UI SaaS aesthetics.
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
    value,
    defaultValue,
    onChange,
    ...rest
  } = props;

  const generatedId = useId();
  const selectId = id || `select-${generatedId}`;
  const options = useMemo(() => React.Children.toArray(children).filter(React.isValidElement), [children]);
  const initialValue = String(value ?? defaultValue ?? (options[0]?.props as { value?: string } | undefined)?.value ?? '');
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const currentValue = value !== undefined ? String(value) : selectedValue;
  const selectedOption = options.find((option) => String((option.props as { value?: string }).value ?? '') === currentValue);
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (value === undefined) setSelectedValue(event.target.value);
    onChange?.(event);
  };

  const containerClasses = cn(
    "flex flex-col gap-1.5",
    fullWidth ? "w-full" : "w-fit",
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  const triggerClasses = cn(
    "relative flex w-full items-center justify-between gap-2 bg-surface-light dark:bg-surface-dark border border-border-subtle hover:border-primary/50 rounded-lg text-text-main dark:text-neutral-100 shadow-xs outline-none transition-all duration-150 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10",
    size === 'sm' && "px-3 py-1.5 text-xs font-medium",
    size === 'md' && "px-3.5 py-2.5 text-sm font-normal",
    size === 'lg' && "px-4 py-3 text-base font-normal"
  );

  return (
    <div className={containerClasses}>
      {label && (
        <Label 
          as="label"
          htmlFor={selectId} 
          textSize="sm"
          textWeight="medium"
          className="mb-1 text-text-main dark:text-neutral-200 normal-case tracking-normal"
        >
          {label}
        </Label>
      )}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button type="button" disabled={disabled} aria-label={rest['aria-label']} aria-haspopup="menu" aria-controls={`${selectId}-menu`} className={triggerClasses}>
            <span className={cn("truncate", selectedOption ? 'text-text-main dark:text-white' : 'text-text-muted')}>
              {(selectedOption?.props as { children?: React.ReactNode } | undefined)?.children ?? 'Select an option'}
            </span>
            <ChevronDown className={cn("text-text-muted shrink-0 opacity-70 transition-transform duration-200", size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4')} aria-hidden="true" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content id={`${selectId}-menu`} align="start" sideOffset={6} avoidCollisions className="z-[5100] w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px] overflow-hidden rounded-xl border border-border-subtle bg-surface-light p-1 shadow-lg dark:bg-surface-dark dark:border-neutral-800">
            {options.map((option) => {
              const optionValue = String((option.props as { value?: string }).value ?? '');
              const isSelected = optionValue === currentValue;
              return <DropdownMenu.Item key={optionValue} onSelect={() => {
                if (value === undefined) setSelectedValue(optionValue);
                const nextEvent = { target: { value: optionValue }, currentTarget: { value: optionValue } } as React.ChangeEvent<HTMLSelectElement>;
                handleChange(nextEvent);
              }} className={cn('flex min-h-9 w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-text-main dark:text-neutral-200 outline-none transition-colors data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary', isSelected && 'font-medium text-primary bg-primary/5')}>
                <span>{(option.props as { children?: React.ReactNode }).children}</span>
                {isSelected && <Check className="h-4 w-4 text-primary shrink-0 ml-2" aria-hidden="true" />}
              </DropdownMenu.Item>;
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <select {...rest} ref={ref} id={selectId} value={currentValue} onChange={handleChange} disabled={disabled} tabIndex={-1} aria-hidden="true" className="sr-only">
        {children}
      </select>
    </div>
  );
});

Select.displayName = 'Select';
