import { useMemo } from 'react';

export interface BreadcrumbItemData {
  label: string;
  href?: string;
  active?: boolean;
}

export const useBreadcrumbs = (items: BreadcrumbItemData[]) => {
  const processedItems = useMemo(() => {
    // Future logic: Add truncation logic here if items.length > maxItems
    // Future logic: Add auto-generation from useLocation() if items not provided
    return items;
  }, [items]);

  return {
    items: processedItems
  };
};