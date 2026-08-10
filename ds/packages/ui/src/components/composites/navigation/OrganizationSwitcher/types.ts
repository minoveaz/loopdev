import type { ReactNode } from 'react';

export interface OrganizationSwitcherOption {
  id: string;
  name: string;
  planLabel?: string;
  icon?: ReactNode;
}

export interface OrganizationSwitcherProps {
  organizations: OrganizationSwitcherOption[];
  activeOrganizationId?: string | null;
  isLoading?: boolean;
  onOrganizationNavigate?: () => void;
  onOrganizationChange: (organizationId: string) => void;
  onAllOrganizations?: () => void;
  onCreateOrganization?: () => void;
  className?: string;
}
