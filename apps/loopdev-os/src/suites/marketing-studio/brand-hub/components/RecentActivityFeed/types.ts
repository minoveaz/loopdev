import { BrandEvent } from "../../types";

export interface RecentActivityFeedProps {
  events: BrandEvent[];
  isLoading?: boolean;
  onEventClick?: (event: BrandEvent) => void;
}
