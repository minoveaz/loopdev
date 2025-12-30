
import React from 'react';
import { useNestedTabs } from '@blueprints/components/functional/NestedTabs/useNestedTabs';
import { TabContainer, TabList, TabTrigger, TabContentContainer } from '@blueprints/components/functional/NestedTabs/components';
import type { TabItem } from '@blueprints/components/functional/NestedTabs/utils';

export interface NestedTabsProps {
  items: TabItem[];
  defaultActiveId?: string;
  className?: string;
}

export const NestedTabs: React.FC<NestedTabsProps> = ({ items, defaultActiveId, className }) => {
  const { activeTabId, handleTabClick } = useNestedTabs(defaultActiveId, items);

  const activeContent = items.find(item => item.id === activeTabId)?.content;

  return (
    <TabContainer className={className}>
      <TabList>
        {items.map((item) => (
          <TabTrigger
            key={item.id}
            label={item.label}
            isActive={activeTabId === item.id}
            onClick={() => handleTabClick(item.id)}
          />
        ))}
      </TabList>
      <TabContentContainer>
        {activeContent}
      </TabContentContainer>
    </TabContainer>
  );
};
