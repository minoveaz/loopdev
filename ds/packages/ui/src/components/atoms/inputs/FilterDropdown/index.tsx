'use client';

import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '../../../../helpers/cn';
import { Icon } from '../../surfaces/Icon';
import { FilterDropdownProps } from './types';

/** Collision-aware, portalized multi-select filter control. */
export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  icon,
  label,
  options,
  selected,
  multiple = true,
  onToggle,
  onClear,
  className,
  disabled = false,
  readOnly = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSelection = selected.length > 0;

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-disabled={disabled || readOnly}
          aria-label={label}
          className={cn(
            'relative flex h-8 w-full cursor-pointer items-center rounded-lg border text-xs text-text-muted outline-none transition-all duration-200 focus:outline-none',
            'bg-surface-light dark:bg-surface-dark',
            'focus-visible:ring-2 focus-visible:ring-primary/20',
            hasSelection
              ? 'border-primary ring-1 ring-primary/10'
              : 'border-border-subtle hover:border-primary/40',
            className,
          )}
        >
          <span className="flex w-full items-center gap-2 overflow-hidden px-3 pr-8">
            <Icon name={icon} size="sm" className="shrink-0 opacity-60" />
            <span className="truncate">{label}</span>
            {hasSelection && (
              <span className="ml-auto mr-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                {selected.length}
              </span>
            )}
          </span>
          <Icon
            name={isOpen ? 'expand_less' : 'expand_more'}
            size="sm"
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted opacity-60"
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          side="bottom"
          sideOffset={6}
          avoidCollisions
          className="z-[1000] w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px] overflow-hidden rounded-xl border border-border-subtle bg-surface-light shadow-xl dark:bg-surface-dark"
        >
          <div className="flex max-h-[240px] flex-col gap-0.5 overflow-y-auto p-1.5">
            {options.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <DropdownMenu.CheckboxItem
                  key={option}
                  checked={isSelected}
                  disabled={readOnly}
                  onSelect={(event) => {
                    if (multiple) event.preventDefault();
                  }}
                  onCheckedChange={() => {
                    if (readOnly) return;
                    onToggle(option);
                    if (!multiple) setIsOpen(false);
                  }}
                  className={cn(
                    'flex min-h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs outline-none transition-all duration-150',
                    'data-[highlighted]:bg-surface-light dark:data-[highlighted]:bg-surface-dark',
                    isSelected
                      ? 'bg-primary/10 font-semibold text-primary'
                      : 'text-text-muted',
                    readOnly && 'cursor-not-allowed opacity-50',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded border-2',
                      isSelected ? 'border-primary bg-primary' : 'border-border-subtle',
                    )}
                  >
                    {isSelected && <Icon name="check" size="sm" className="text-white" />}
                  </span>
                  <span>{option}</span>
                </DropdownMenu.CheckboxItem>
              );
            })}
            {multiple && hasSelection && (
              <DropdownMenu.Item
                disabled={readOnly || !onClear}
                onSelect={(event) => {
                  event.preventDefault();
                  if (!readOnly) onClear?.();
                }}
                className="mt-1 flex min-h-9 w-full cursor-pointer items-center rounded-lg border-t border-border-subtle px-3 pt-2 text-left text-xs text-text-muted outline-none transition-colors data-[highlighted]:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear selection
              </DropdownMenu.Item>
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
