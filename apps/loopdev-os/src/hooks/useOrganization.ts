import { useContext } from 'react';
import { OrganizationContext, type OrganizationContextType } from '@/providers/OrganizationProvider';

export const useOrganization = (): OrganizationContextType => {
  const context = useContext(OrganizationContext);

  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }

  return context;
};
