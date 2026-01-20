import { FontDefinition } from '@loopdev/contracts';

export interface TypefaceCardProps {
  /** The font data from the contract */
  font: FontDefinition;
  /** Visual variant: brand (light/watermark) or technical (dark/mono) */
  variant: 'brand' | 'technical';
  /** Optional click handler for inspector integration */
  onClick?: () => void;
  /** Whether the card is currently selected in the UI */
  isSelected?: boolean;
}
