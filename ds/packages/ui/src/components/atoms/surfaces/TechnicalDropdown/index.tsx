'use client';

import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronRight } from 'lucide-react';
import { TechnicalDropdownProps, TechnicalDropdownItemProps } from './types';
import { useTechnicalDropdown } from './useTechnicalDropdown';

/**
 * @component TechnicalDropdown
 * @description Átomo oficial que envuelve Radix Dropdown con la estética LoopDev OS.
 */
export const TechnicalDropdown: React.FC<TechnicalDropdownProps> = (props) => {
  const {
    trigger,
    children,
    align = 'start',
    side = 'bottom',
    sideOffset = 8,
    avoidCollisions = true,
    open,
    onOpenChange,
    className,
  } = props;
  const { getContentClasses } = useTechnicalDropdown();

  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          side={side}
          sideOffset={sideOffset}
          avoidCollisions={avoidCollisions}
          className={getContentClasses(className)}
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

/**
 * @component TechnicalDropdownItem
 */
export const TechnicalDropdownItem: React.FC<TechnicalDropdownItemProps> = (props) => {
  const { children, onClick, onSelect, disabled } = props;
  const { getItemClasses } = useTechnicalDropdown();

  return (
    <DropdownMenu.Item
      onClick={onClick}
      onSelect={onSelect}
      disabled={disabled}
      className={getItemClasses(props)}
    >
      {children}
    </DropdownMenu.Item>
  );
};

/**
 * @component TechnicalDropdownSeparator
 */
export const TechnicalDropdownSeparator: React.FC = () => {
  const { separatorClasses } = useTechnicalDropdown();
  return <DropdownMenu.Separator className={separatorClasses} />;
};

/**
 * @component TechnicalDropdownGroup
 */
export const TechnicalDropdownGroup: React.FC<{ children: React.ReactNode; label?: string }> = ({
  children,
  label,
}) => (
  <DropdownMenu.Group>
    {label && (
      <div className="px-3 py-2">
        <span className="text-text-muted text-xs font-medium">{label}</span>
      </div>
    )}
    {children}
  </DropdownMenu.Group>
);

interface TechnicalDropdownSubmenuProps {
  label: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}

/** Menú secundario para opciones como preferencias, timezone o navegación contextual. */
export const TechnicalDropdownSubmenu: React.FC<TechnicalDropdownSubmenuProps> = ({
  label,
  children,
  disabled = false,
}) => {
  const { getContentClasses } = useTechnicalDropdown();

  return (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger
        disabled={disabled}
        className="dark:text-text-muted hover:bg-accent/10 dark:hover:bg-accent/15 hover:!text-accent dark:hover:!text-accent flex min-h-9 items-center gap-2.5 rounded-sm px-3 py-2 text-[13px] font-normal text-slate-600 outline-none transition-colors duration-150 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40"
      >
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <ChevronRight size={14} className="shrink-0" aria-hidden="true" />
      </DropdownMenu.SubTrigger>
      <DropdownMenu.Portal>
        <DropdownMenu.SubContent sideOffset={4} className={getContentClasses()}>
          {children}
        </DropdownMenu.SubContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Sub>
  );
};
