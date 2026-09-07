'use client';

import React, { forwardRef, useId, useMemo, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { SelectOption, SelectProps } from './types';
import { Label } from '../../surfaces/Label';

/**
 * @component Select
 * @category Primitives
 * @version 2.1.0
 * @description Dropdown selector aligned with Untitled UI design language and accessibility standards.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const {
    label,
    size = 'md',
    fullWidth = true,
    className,
    triggerClassName,
    children,
    options: optionsProp,
    disabled,
    id,
    value,
    defaultValue,
    onChange,
    onValueChange,
    placeholder,
    searchable = false,
    searchPlaceholder,
    emptyMessage,
    clearLabel,
    clearable = false,
    leadingIcon,
    error,
    hint,
    ...rest
  } = props;

  const generatedId = useId();
  const selectId = id || `select-${generatedId}`;
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract options from either options prop or children <option> elements
  const normalizedOptions: SelectOption[] = useMemo(() => {
    if (optionsProp && optionsProp.length > 0) {
      return optionsProp;
    }

    const childElements = React.Children.toArray(children).filter(React.isValidElement);
    return childElements.map((child) => {
      const p = child.props as { value?: unknown; children?: React.ReactNode; disabled?: boolean };
      const val = String(p.value ?? '');
      let labelText = val;
      if (typeof p.children === 'string') {
        labelText = p.children;
      } else if (typeof p.children === 'number') {
        labelText = String(p.children);
      } else if (Array.isArray(p.children)) {
        labelText = p.children
          .map((c) => (typeof c === 'string' || typeof c === 'number' ? String(c) : ''))
          .join('');
      }
      return {
        value: val,
        label: labelText || val,
        disabled: p.disabled,
      };
    });
  }, [children, optionsProp]);

  const initialValue = String(
    value ??
      defaultValue ??
      (normalizedOptions[0]?.value && !placeholder ? normalizedOptions[0].value : ''),
  );
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const currentValue = value !== undefined ? String(value) : selectedValue;

  const selectedOption = normalizedOptions.find((opt) => opt.value === currentValue);

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return normalizedOptions;
    const q = searchQuery.toLowerCase().trim();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.description && opt.description.toLowerCase().includes(q)),
    );
  }, [normalizedOptions, searchable, searchQuery]);

  const handleSelect = (optionValue: string) => {
    if (value === undefined) setSelectedValue(optionValue);
    onValueChange?.(optionValue);

    if (onChange) {
      const syntheticEvent = {
        target: { value: optionValue, name: rest.name },
        currentTarget: { value: optionValue, name: rest.name },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleSelect('');
  };

  const containerClasses = cn(
    'flex flex-col gap-1.5',
    fullWidth ? 'w-full' : 'w-fit',
    disabled && 'opacity-60 cursor-not-allowed',
    className,
  );

  const triggerClasses = cn(
    'group relative flex w-full items-center justify-between gap-2 bg-surface-light dark:bg-surface-dark border rounded-lg text-text-main shadow-xs outline-none transition-all duration-150',
    error
      ? 'border-status-error focus-visible:ring-4 focus-visible:ring-status-error/10'
      : 'border-border-subtle hover:border-primary/50 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10',
    size === 'sm' && 'h-9 px-3 text-xs font-medium',
    size === 'md' && 'h-10 px-3.5 text-sm font-normal',
    size === 'lg' && 'h-11 px-4 text-base font-normal',
    disabled && 'cursor-not-allowed bg-secondary/40',
    triggerClassName,
  );

  return (
    <div className={containerClasses}>
      {label && (
        <Label
          as="label"
          htmlFor={selectId}
          textSize="sm"
          textWeight="medium"
          className="text-text-main normal-case tracking-normal"
        >
          {label}
          {rest.required && <span className="text-status-error ml-0.5">*</span>}
        </Label>
      )}

      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            id={`${selectId}-trigger`}
            disabled={disabled}
            aria-label={rest['aria-label'] || label}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={`${selectId}-menu`}
            className={triggerClasses}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1 truncate text-left">
              {leadingIcon ? (
                <span className="shrink-0 text-text-muted opacity-80">{leadingIcon}</span>
              ) : selectedOption?.icon ? (
                <span className="shrink-0">{selectedOption.icon}</span>
              ) : null}
              <span
                className={cn(
                  'truncate',
                  selectedOption && selectedOption.value !== ''
                    ? 'text-text-main'
                    : 'text-text-muted',
                )}
              >
                {selectedOption && selectedOption.value !== '' ? selectedOption.label : placeholder}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {clearable && selectedOption && selectedOption.value !== '' && !disabled ? (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleClear(e as any);
                  }}
                  className="rounded p-0.5 text-text-muted hover:text-text-main hover:bg-secondary transition-colors"
                  aria-label={clearLabel || 'Clear'}
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              ) : null}
              <ChevronDown
                className={cn(
                  'text-text-muted shrink-0 opacity-70 transition-transform duration-200',
                  isOpen && 'rotate-180',
                  size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4',
                )}
                aria-hidden="true"
              />
            </div>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            id={`${selectId}-menu`}
            align="start"
            sideOffset={6}
            avoidCollisions
            className="z-[9999] w-[var(--radix-dropdown-menu-trigger-width)] min-w-[220px] max-h-72 overflow-y-auto rounded-xl border border-border-subtle bg-surface-light p-1 shadow-lg dark:bg-surface-dark animate-in fade-in-80 duration-150"
          >
            {searchable ? (
              <div className="sticky top-0 z-10 bg-surface-light dark:bg-surface-dark p-1.5 pb-2 border-b border-border-subtle/60">
                <div className="relative flex items-center">
                  <Search className="absolute left-2.5 size-3.5 text-text-muted pointer-events-none" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="w-full rounded-md border border-border-subtle bg-background py-1.5 pl-8 pr-3 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-primary"
                  />
                </div>
              </div>
            ) : null}

            <div className="py-1">
              {filteredOptions.length === 0 ? (
                emptyMessage ? (
                  <div className="px-3 py-4 text-center text-xs text-text-muted">
                    {emptyMessage}
                  </div>
                ) : null
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = option.value === currentValue;
                  return (
                    <DropdownMenu.Item
                      key={option.value}
                      disabled={option.disabled}
                      onSelect={() => handleSelect(option.value)}
                      className={cn(
                        'flex min-h-9 w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-text-main outline-none transition-colors data-[highlighted]:bg-secondary/80 data-[highlighted]:text-text-main',
                        isSelected && 'font-medium text-primary bg-primary/5 dark:bg-primary/10',
                        option.disabled && 'opacity-40 cursor-not-allowed',
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {option.icon ? <span className="shrink-0">{option.icon}</span> : null}
                        <div className="min-w-0 flex-1">
                          <p className="truncate">{option.label}</p>
                          {option.description ? (
                            <p className="truncate text-xs text-text-muted font-normal">
                              {option.description}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      {isSelected ? (
                        <Check className="h-4 w-4 text-primary shrink-0 ml-2" aria-hidden="true" />
                      ) : null}
                    </DropdownMenu.Item>
                  );
                })
              )}
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Hidden native select to preserve form library and accessibility tree integration */}
      <select
        {...rest}
        ref={ref}
        id={selectId}
        value={currentValue}
        onChange={(e) => handleSelect(e.target.value)}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      >
        {children ||
          normalizedOptions.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
      </select>

      {error ? (
        <p className="text-status-error text-xs mt-0.5">{error}</p>
      ) : hint ? (
        <p className="text-text-muted text-xs mt-0.5">{hint}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
