
import { useState, useCallback } from 'react';

export const useNestedTabs = (initialTabId?: string, tabs?: { id: string }[]) => {
  // Default to first tab if no initial ID provided
  const defaultId = initialTabId || (tabs && tabs.length > 0 ? tabs[0].id : '');
  
  const [activeTabId, setActiveTabId] = useState<string>(defaultId);

  const handleTabClick = useCallback((id: string) => {
    setActiveTabId(id);
  }, []);

  return {
    activeTabId,
    handleTabClick
  };
};
