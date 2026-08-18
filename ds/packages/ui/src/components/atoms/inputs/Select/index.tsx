'use client';

import React, { forwardRef, useId, useMemo, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
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
    "relative flex w-full items-center justify-between bg-surface-light dark:bg-surface-dark border border-border-subtle hover:border-primary/40 rounded-lg outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/20",
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

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button type="button" disabled={disabled} aria-label={rest['aria-label']} aria-haspopup="menu" aria-controls={`${selectId}-menu`} className={triggerClasses}>
            <span className={selectedOption ? 'text-text-main dark:text-white' : 'text-text-muted'}>{(selectedOption?.props as { children?: React.ReactNode } | undefined)?.children ?? 'Select an option'}</span>
            <Icon name="expand_more" size={size === 'sm' ? 'sm' : 'md'} className="text-text-muted opacity-60" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content id={`${selectId}-menu`} align="start" sideOffset={6} avoidCollisions className="z-[5100] w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px] overflow-hidden rounded-xl border border-border-subtle bg-surface-light p-1.5 shadow-xl dark:bg-surface-dark">
            {options.map((option) => {
              const optionValue = String((option.props as { value?: string }).value ?? '');
              const isSelected = optionValue === currentValue;
              return <DropdownMenu.Item key={optionValue} onSelect={() => {
                if (value === undefined) setSelectedValue(optionValue);
                const nextEvent = { target: { value: optionValue }, currentTarget: { value: optionValue } } as React.ChangeEvent<HTMLSelectElement>;
                handleChange(nextEvent);
              }} className={cn('flex min-h-9 w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left text-sm outline-none data-[highlighted]:bg-primary/10', isSelected && 'font-semibold text-primary')}>
                {(option.props as { children?: React.ReactNode }).children}
                {isSelected && <Icon name="check" size="sm" className="ml-auto" />}
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
