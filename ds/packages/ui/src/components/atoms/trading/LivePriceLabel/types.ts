/**
 * @interface LivePriceLabelProps
 * @description Contract for real-time price streaming atoms.
 */
export interface LivePriceLabelProps {
  /** Trading pair symbol (e.g. BTC/USDT) */
  pair: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Show price change percentage */
  showChange?: boolean;
  /** Additional CSS classes */
  className?: string;
}
