'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { 
  TechnicalDropdown, 
  TechnicalMenuItem, 
  TechnicalDropdownGroup,
  TechnicalDropdownSeparator,
  TechnicalLabel,
  LpdText
} from '../../../atoms';
import { QuickActionMenuProps } from './types';
import { useQuickActionMenu } from './useQuickActionMenu';

/**
 * @component QuickActionMenu
 * @description Botón de creación universal que abre un menú de acciones rápidas.
 * @category Composites
 * @phase 1
 */
export const QuickActionMenu: React.FC<QuickActionMenuProps> = (props) => {
  const { groups, onOpenChange } = props;
  const { isOpen, setIsOpen, triggerClasses } = useQuickActionMenu(props);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  return (
    <TechnicalDropdown 
      align="end"
      open={isOpen}
      onOpenChange={handleOpenChange}
      trigger={
        <button className={triggerClasses} title="Acciones Rápidas">
          <Plus size={18} />
        </button>
      }
    >
      <div className="flex flex-col w-[220px] bg-white dark:bg-surface-elevated">
        {groups.map((group, groupIdx) => (
          <div key={group.label || groupIdx} className="flex flex-col">
            {group.label && (
              <div className="p-4 pb-2 border-b border-border-technical bg-white dark:bg-surface-elevated">
                <LpdText size="sm" weight="bold" className="text-text-main dark:text-white">
                  {group.label}
                </LpdText>
              </div>
            )}
            <div className="flex flex-col py-1">
              {group.actions.map((action) => (
                <TechnicalMenuItem 
                  key={action.id}
                  icon={action.icon}
                  label={action.label}
                  shortcut={action.shortcut}
                  variant={action.isCritical ? 'danger' : 'default'}
                  isDisabled={action.isDisabled}
                  onClick={() => {
                    action.onAction?.();
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
            {groupIdx < groups.length - 1 && <div className="h-[0.5px] bg-border-technical" />}
          </div>
        ))}
      </div>
    </TechnicalDropdown>
  );
};
