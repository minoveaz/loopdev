import { RegulatedClaim } from "../../types";

export interface ClaimsGovernanceBlockProps {
  forbidden: string[];
  regulated: RegulatedClaim[];
  isLoading?: boolean;
  isEditable?: boolean;
  onClaimClick?: (claim: RegulatedClaim) => void;
  onForbiddenClick?: (term: string) => void;
}
