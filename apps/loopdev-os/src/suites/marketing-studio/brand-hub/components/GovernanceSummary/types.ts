import { GovernanceDomain } from "../../types";

export interface GovernanceSummaryProps {
  domains: GovernanceDomain[];
  isLoading?: boolean;
  onDomainClick?: (domainId: string) => void;
}
