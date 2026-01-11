import { HealthStatus } from "../../types";

export interface MetricTileProps {
  label: string;
  value: string | number;
  status: HealthStatus;
  meta?: string;
  onClick?: () => void;
  isLoading?: boolean;
}
