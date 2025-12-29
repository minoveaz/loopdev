import React from 'react';
import { useBreadcrumbs, BreadcrumbItemData } from './useBreadcrumbs';
import { BreadcrumbContainer, BreadcrumbItem, BreadcrumbActiveItem, BreadcrumbSeparator } from './components';

export interface BreadcrumbsProps {
  items: BreadcrumbItemData[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  const { items: displayItems } = useBreadcrumbs(items);

  if (!displayItems || displayItems.length === 0) return null;

  return (
    <BreadcrumbContainer className={className}>
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        const isActive = item.active || isLast; // Default last item to active style if not specified

        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 && <BreadcrumbSeparator />}
            
            {isActive ? (
              <BreadcrumbActiveItem label={item.label} />
            ) : (
              <BreadcrumbItem label={item.label} href={item.href} />
            )}
          </React.Fragment>
        );
      })}
    </BreadcrumbContainer>
  );
};