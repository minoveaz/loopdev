export type ControlState = 'normal' | 'hover' | 'focus' | 'active' | 'disabled' | 'loading';

export interface ControlStateContract {
  blocksInteraction: boolean;
  requiredAria: Readonly<Record<string, string | boolean>>;
  focusRing: 'visible' | 'hidden' | 'custom';
}

export const CONTROL_STATE_CONTRACTS: Record<ControlState, ControlStateContract> = {
  normal: { blocksInteraction: false, requiredAria: {}, focusRing: 'hidden' },
  hover: { blocksInteraction: false, requiredAria: {}, focusRing: 'hidden' },
  focus: { blocksInteraction: false, requiredAria: {}, focusRing: 'visible' },
  active: { blocksInteraction: false, requiredAria: { 'aria-pressed': true }, focusRing: 'visible' },
  disabled: { blocksInteraction: true, requiredAria: { 'aria-disabled': true, disabled: true }, focusRing: 'hidden' },
  loading: { blocksInteraction: true, requiredAria: { 'aria-busy': true }, focusRing: 'custom' },
};