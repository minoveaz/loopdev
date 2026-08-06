import { BrandHealth, HealthMetric } from "../../types";

export interface BrandHealthPanelProps {
  health: BrandHealth;
  isLoading?: boolean;
  onMetricClick?: (metricId: string) => void;
}
