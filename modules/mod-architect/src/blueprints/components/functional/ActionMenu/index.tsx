
import React from 'react';
import { useActionMenu } from '@blueprints/components/functional/ActionMenu/useActionMenu';
import { MenuContainer, MenuTrigger, MenuDropdown, MenuItem, MenuDivider } from '@blueprints/components/functional/ActionMenu/components';
import type { ActionMenuItem } from '@blueprints/components/functional/ActionMenu/utils';

// We export the sub-components to allow Composition Pattern
// <ActionMenu.Item ... />
export { MenuItem, MenuDivider };

interface ActionMenuProps {
  // Option A: Data-Driven
  items?: ActionMenuItem[];
  // Option B: Composition
  children?: React.ReactNode;
  align?: 'left' | 'right';
}

const ActionMenuMain: React.FC<ActionMenuProps> = ({ items, children, align = 'right' }) => {
  const { isOpen, toggle, close, containerRef } = useActionMenu();

  return (
    <MenuContainer innerRef={containerRef}>
      <MenuTrigger onClick={toggle} isOpen={isOpen} />
      
      <MenuDropdown isOpen={isOpen} align={align}>
        {/* Priority: Children (Composition) -> Items (Data Driven) */}
        {children ? (
          // Close menu when a child item is clicked (simplified assumption for now, can be improved with context)
          <div onClick={() => setTimeout(close, 50)}>{children}</div>
        ) : (
          items?.map((item) => (
            <MenuItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              variant={item.variant}
              disabled={item.disabled}
              onClick={() => {
                item.onClick();
                close();
              }}
            />
          ))
        )}
      </MenuDropdown>
    </MenuContainer>
  );
};

// Compound Component Export
export const ActionMenu = Object.assign(ActionMenuMain, {
  Item: MenuItem,
  Divider: MenuDivider
});
