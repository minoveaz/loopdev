'use client';

import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TechnicalDropdownProps, TechnicalDropdownItemProps } from './types';
import { useTechnicalDropdown } from './useTechnicalDropdown';

/**
 * @component TechnicalDropdown
 * @description Átomo oficial que envuelve Radix Dropdown con la estética LoopDev OS.
 */
export const TechnicalDropdown: React.FC<TechnicalDropdownProps> = (props) => {
  const { trigger, children, align = 'start', side = 'bottom', sideOffset = 8, open, onOpenChange, className } = props;
  const { getContentClasses } = useTechnicalDropdown();

  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>
        {trigger}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content 
          align={align} 
          side={side} 
          sideOffset={sideOffset} 
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
  const { children, onClick, disabled } = props;
  const { getItemClasses } = useTechnicalDropdown();

  return (
    <DropdownMenu.Item 
      onClick={onClick}
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
export const TechnicalDropdownGroup: React.FC<{ children: React.ReactNode, label?: string }> = ({ children, label }) => (
  <DropdownMenu.Group>
    {label && (
      <div className="px-3 py-2 mb-1">
        <span className="text-text-muted/40 uppercase tracking-[0.3em] text-[8px] font-black">
          {label}
        </span>
      </div>
    )}
    {children}
  </DropdownMenu.Group>
);
