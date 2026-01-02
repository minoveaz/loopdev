
import React from 'react';
import { useNestedTabs } from '@blueprints/components/functional/NestedTabs/useNestedTabs';
import { TabContainer, TabList, TabTrigger, TabContentContainer } from '@blueprints/components/functional/NestedTabs/components';
import type { TabItem } from '@blueprints/components/functional/NestedTabs/utils';

export interface NestedTabsProps {
  items: TabItem[];
  defaultActiveId?: string;
  className?: string;
}

const DEFAULT_TABS: TabItem[] = [
  { id: '1', label: 'General', content: <div className="p-4">General settings content.</div> },
  { id: '2', label: 'Security', content: <div className="p-4">Security configuration area.</div> },
  { id: '3', label: 'Advanced', content: <div className="p-4">Advanced developer tools.</div> }
];

export const NestedTabs: React.FC<NestedTabsProps> = ({ 
  items = DEFAULT_TABS, 
  defaultActiveId, 
  className 
}) => {
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
