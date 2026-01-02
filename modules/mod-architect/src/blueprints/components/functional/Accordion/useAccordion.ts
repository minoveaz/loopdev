import { useState, useCallback } from 'react';

export const useAccordion = (allowMultiple: boolean = false) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(allowMultiple ? prev : []);
      if (prev.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, [allowMultiple]);

  const isExpanded = useCallback((id: string) => expandedIds.has(id), [expandedIds]);

  return {
    expandedIds,
    toggle,
    isExpanded
  };
};
