import { useState, useCallback } from 'react';

export const useMultiLevelSidebar = (initialActiveId?: string) => {
  const [activeId, setActiveId] = useState<string | undefined>(initialActiveId);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const isExpanded = useCallback((id: string) => expandedIds.has(id), [expandedIds]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleItemClick = useCallback((id: string, hasChildren: boolean) => {
    if (hasChildren) {
      toggleExpand(id);
    } else {
      setActiveId(id);
    }
  }, [toggleExpand]);

  return {
    activeId,
    expandedIds,
    isExpanded,
    handleItemClick,
    setActiveId
  };
};
