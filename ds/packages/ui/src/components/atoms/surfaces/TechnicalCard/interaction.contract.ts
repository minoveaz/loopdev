export type CardInteractionState = 'static' | 'interactive' | 'disabled' | 'readonly';

export interface CardInteractionContract {
  state: CardInteractionState;
  requiresActionableSemantics: boolean;
  pointerEvents: 'auto' | 'none';
  opacity?: number;
}

export const CARD_INTERACTION_CONTRACTS: Record<CardInteractionState, CardInteractionContract> = {
  static: { state: 'static', requiresActionableSemantics: false, pointerEvents: 'auto' },
  interactive: { state: 'interactive', requiresActionableSemantics: true, pointerEvents: 'auto' },
  disabled: { state: 'disabled', requiresActionableSemantics: true, pointerEvents: 'none', opacity: 0.6 },
  readonly: { state: 'readonly', requiresActionableSemantics: false, pointerEvents: 'auto', opacity: 0.8 },
};