'use client';

import React, { forwardRef, useId, useMemo, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { MultiSelectProps } from './types';
import { Label } from '../../surfaces/Label';

/**
 * @component MultiSelect
 * @category Primitives
 * @version 1.0.0
 * @description Multi-value dropdown selector with interactive tags aligned with Untitled UI design specifications.
 */
export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>((props, ref) => {
  const {
    label,
    size = 'md',
    fullWidth = true,
    className,
    triggerClassName,
    options = [],
    disabled = false,
    id,
    value,
    defaultValue,
    onChange,
    placeholder = 'Seleccionar opciones...',
    searchable = false,
    clearable = true,
    maxTags = 3,
    error,
    hint,
    required = false,
    ...rest
  } = props;

  const generatedId = useId();
  const selectId = id || `multiselect-${generatedId}`;
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [internalValues, setInternalValues] = useState<string[]>(defaultValue ?? []);
  const currentValues = value !== undefined ? value : internalValues;

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.description && opt.description.toLowerCase().includes(q)),
    );
  }, [options, searchable, searchQuery]);

  const toggleOption = (optionValue: string) => {
    const next = currentValues.includes(optionValue)
      ? currentValues.filter((v) => v !== optionValue)
      : [...currentValues, optionValue];

    if (value === undefined) setInternalValues(next);
    onChange?.(next);
  };

  const removeValue = (valToRemove: string) => {
    const next = currentValues.filter((v) => v !== valToRemove);
    if (value === undefined) setInternalValues(next);
    onChange?.(next);
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value === undefined) setInternalValues([]);
    onChange?.([]);
  };

  const selectAll = () => {
    const allVals = options.filter((o) => !o.disabled).map((o) => o.value);
    if (value === undefined) setInternalValues(allVals);
    onChange?.(allVals);
  };

  const selectedOptionsMap = useMemo(() => {
    const map = new Map<string, string>();
    options.forEach((opt) => map.set(opt.value, opt.label));
    return map;
  }, [options]);

  const visibleTags = currentValues.slice(0, maxTags);
  const hiddenCount = currentValues.length - maxTags;

  const containerClasses = cn(
    'flex flex-col gap-1.5',
    fullWidth ? 'w-full' : 'w-fit',
    disabled && 'opacity-60 cursor-not-allowed',
    className,
  );

  const triggerClasses = cn(
    'group relative flex w-full min-h-10 items-center justify-between gap-2 bg-surface-light dark:bg-surface-dark border rounded-lg text-text-main dark:text-neutral-100 shadow-xs outline-none transition-all duration-150',
    error
      ? 'border-status-error focus-visible:ring-4 focus-visible:ring-status-error/10'
      : 'border-border-subtle hover:border-primary/50 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10',
    size === 'sm' && 'min-h-9 px-2.5 py-1 text-xs',
    size === 'md' && 'min-h-10 px-3 py-1.5 text-sm',
    size === 'lg' && 'min-h-11 px-3.5 py-2 text-base',
    disabled && 'cursor-not-allowed bg-secondary/40',
    triggerClassName,
  );

  return (
    <div ref={ref} className={containerClasses}>
      {label && (
        <Label
          as="label"
          htmlFor={`${selectId}-trigger`}
          textSize="sm"
          textWeight="medium"
          className="text-text-main dark:text-neutral-200 normal-case tracking-normal"
        >
          {label}
          {required && <span className="text-status-error ml-0.5">*</span>}
        </Label>
      )}

      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger asChild>
          <div
            role="combobox"
            id={`${selectId}-trigger`}
            aria-label={rest['aria-label'] || label}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            className={cn(triggerClasses, 'cursor-pointer select-none')}
            onKeyDown={(e) => {
              if (disabled) return;
              if (e.key === 'Enter' || e.key === ' ') {
                if (e.target === e.currentTarget) {
                  e.preventDefault();
                  setIsOpen(!isOpen);
                }
              }
            }}
          >
            <div className="flex flex-wrap items-center gap-1.5 min-w-0 flex-1 text-left">
              {currentValues.length === 0 ? (
                <span className="text-text-muted text-sm select-none">{placeholder}</span>
              ) : (
                <>
                  {visibleTags.map((val) => (
                    <span
                      key={val}
                      className="inline-flex items-center gap-1 rounded-md bg-secondary/80 text-text-main px-2 py-0.5 text-xs font-medium border border-border-subtle/50"
                    >
                      <span className="truncate max-w-[140px]">
                        {selectedOptionsMap.get(val) || val}
                      </span>
                      {!disabled && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeValue(val);
                          }}
                          aria-label={`Remove ${selectedOptionsMap.get(val) || val}`}
                          className="rounded-full p-0.5 text-text-muted hover:text-text-main hover:bg-secondary transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {hiddenCount > 0 ? (
                    <span className="rounded-md bg-secondary/60 px-1.5 py-0.5 text-xs font-medium text-text-muted">
                      +{hiddenCount} más
                    </span>
                  ) : null}
                </>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-1">
              {clearable && currentValues.length > 0 && !disabled ? (
                <button
                  type="button"
                  onClick={clearAll}
                  aria-label="Limpiar selección"
                  className="rounded p-0.5 text-text-muted hover:text-text-main hover:bg-secondary transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
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
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            id={`${selectId}-menu`}
            align="start"
            sideOffset={6}
            avoidCollisions
            className="z-[9999] w-[var(--radix-dropdown-menu-trigger-width)] min-w-[240px] max-h-72 overflow-y-auto rounded-xl border border-border-subtle bg-surface-light p-1 shadow-lg dark:bg-surface-dark dark:border-neutral-800 animate-in fade-in-80 duration-150"
          >
            {searchable || options.length > 5 ? (
              <div className="sticky top-0 z-10 bg-surface-light dark:bg-surface-dark p-1.5 pb-2 border-b border-border-subtle/60">
                <div className="relative flex items-center">
                  <Search className="absolute left-2.5 size-3.5 text-text-muted pointer-events-none" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar opciones..."
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="w-full rounded-md border border-border-subtle bg-background py-1.5 pl-8 pr-3 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-primary"
                  />
                </div>
              </div>
            ) : null}

            {options.length > 2 ? (
              <div className="flex items-center justify-between px-2 py-1.5 text-xs border-b border-border-subtle/40 text-text-muted">
                <button
                  type="button"
                  onClick={selectAll}
                  className="hover:text-primary transition-colors font-medium"
                >
                  Seleccionar todo
                </button>
                {currentValues.length > 0 ? (
                  <button
                    type="button"
                    onClick={(e) => clearAll(e as any)}
                    className="hover:text-status-error transition-colors"
                  >
                    Desmarcar
                  </button>
                ) : null}
              </div>
            ) : null}

            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-4 text-center text-xs text-text-muted">
                  No se encontraron opciones
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = currentValues.includes(option.value);
                  return (
                    <DropdownMenu.Item
                      key={option.value}
                      disabled={option.disabled}
                      onSelect={(e) => {
                        e.preventDefault(); // Keep dropdown open on multi-select
                        toggleOption(option.value);
                      }}
                      className={cn(
                        'flex min-h-9 w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-text-main dark:text-neutral-200 outline-none transition-colors data-[highlighted]:bg-secondary/80 data-[highlighted]:text-text-main',
                        isSelected && 'font-medium text-primary bg-primary/5 dark:bg-primary/10',
                        option.disabled && 'opacity-40 cursor-not-allowed',
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {/* Checkbox indicator */}
                        <div
                          className={cn(
                            'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                            isSelected
                              ? 'bg-primary border-primary text-white'
                              : 'border-border-subtle bg-background',
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>

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
                    </DropdownMenu.Item>
                  );
                })
              )}
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {error ? (
        <p className="text-status-error text-xs mt-0.5">{error}</p>
      ) : hint ? (
        <p className="text-text-muted text-xs mt-0.5">{hint}</p>
      ) : null}
    </div>
  );
});

MultiSelect.displayName = 'MultiSelect';
