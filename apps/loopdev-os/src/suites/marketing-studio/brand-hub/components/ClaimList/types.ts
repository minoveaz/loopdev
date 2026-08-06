import { RegulatedClaim } from "../../types";

export interface ClaimListProps {
  title: string;
  items: string[] | RegulatedClaim[];
  type: 'forbidden' | 'regulated';
  onItemClick?: (id: string) => void;
  className?: string;
}
