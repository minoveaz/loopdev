
import React from 'react';
import { useMultiLevelSidebar } from '@blueprints/components/functional/MultiLevelSidebar/useMultiLevelSidebar';
import { SidebarContainer, SidebarHeader, NavList, NavItem, NestedContainer } from '@blueprints/components/functional/MultiLevelSidebar/components';
import { type SidebarItem, hasChildren } from '@blueprints/components/functional/MultiLevelSidebar/utils';

export interface MultiLevelSidebarProps {
  items: SidebarItem[];
  className?: string;
}

const SidebarItemRenderer: React.FC<{ 
  item: SidebarItem; 
  depth: number;
  activeId: string | undefined;
  isExpanded: (id: string) => boolean;
  onItemClick: (id: string, hasChildren: boolean) => void;
}> = ({ item, depth, activeId, isExpanded, onItemClick }) => {
  const expanded = isExpanded(item.id);
  const hasKids = hasChildren(item);

  // Special rendering for expanded parent to match the specific "Card" design in NavigationStructure.tsx
  // The design shows the children INSIDE the parent container div when expanded.
  
  if (hasKids && expanded) {
    return (
      <div className="h-auto w-full rounded bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/20 flex flex-col gap-1 p-1 mb-1">
        <div 
          className="flex items-center px-1 h-5 justify-between cursor-pointer"
          onClick={() => onItemClick(item.id, true)}
        >
          <span className="text-xs font-bold text-primary dark:text-primary-light truncate">{item.label}</span>
          <span className="material-symbols-outlined text-[16px] text-primary/70">expand_less</span>
        </div>
        <NestedContainer>
          {item.children!.map(child => (
            <SidebarItemRenderer 
              key={child.id} 
              item={child} 
              depth={depth + 1}
              activeId={activeId}
              isExpanded={isExpanded}
              onItemClick={onItemClick}
            />
          ))}
        </NestedContainer>
      </div>
    );
  }

  return (
    <NavItem
      label={item.label}
      isActive={activeId === item.id}
      isExpanded={expanded}
      hasChildren={hasKids}
      onClick={() => onItemClick(item.id, hasKids)}
      depth={depth}
    />
  );
};

const DEFAULT_ITEMS: SidebarItem[] = [
  { id: '1', label: 'Dashboard', icon: 'dashboard' },
  { id: '2', label: 'Systems', icon: 'settings', children: [
    { id: '2-1', label: 'Architect' },
    { id: '2-2', label: 'Designer' }
  ]},
  { id: '3', label: 'Library', icon: 'science' }
];

export const MultiLevelSidebar: React.FC<MultiLevelSidebarProps> = ({ 
  items = DEFAULT_ITEMS, 
  className 
}) => {
  const { activeId, isExpanded, handleItemClick } = useMultiLevelSidebar();

  return (
    <SidebarContainer className={className}>
      <SidebarHeader />
      <NavList>
        {items.map(item => (
          <SidebarItemRenderer
            key={item.id}
            item={item}
            depth={0}
            activeId={activeId}
            isExpanded={isExpanded}
            onItemClick={handleItemClick}
          />
        ))}
      </NavList>
    </SidebarContainer>
  );
};
