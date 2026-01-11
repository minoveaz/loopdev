import { BrandStatus, OperatingMode } from "../../types";

export interface ActionLauncherProps {
  brandStatus: BrandStatus;
  mode: OperatingMode;
  onAction?: (actionId: string) => void;
  isLoading?: boolean;
}
