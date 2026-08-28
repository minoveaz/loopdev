export type ControlSize = 'sm' | 'md' | 'lg';

export interface ControlGeometryContract {
  minHeight: number;
  paddingX: number;
  paddingY: number;
  iconSize: number;
  iconGap: number;
  borderRadius: number;
  focusRingOffset: number;
}

export const CONTROL_GEOMETRY: Record<ControlSize, ControlGeometryContract> = {
  sm: { minHeight: 32, paddingX: 12, paddingY: 6, iconSize: 16, iconGap: 6, borderRadius: 6, focusRingOffset: 2 },
  md: { minHeight: 44, paddingX: 16, paddingY: 10, iconSize: 20, iconGap: 8, borderRadius: 8, focusRingOffset: 2 },
  lg: { minHeight: 52, paddingX: 20, paddingY: 12, iconSize: 24, iconGap: 10, borderRadius: 10, focusRingOffset: 3 },
};

export const ICON_BUTTON_GEOMETRY: Record<ControlSize, { size: number; padding: number }> = {
  sm: { size: 32, padding: 8 },
  md: { size: 44, padding: 12 },
  lg: { size: 52, padding: 14 },
};