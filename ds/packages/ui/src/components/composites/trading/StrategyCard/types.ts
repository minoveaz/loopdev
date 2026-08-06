import { StrategyConfig, StrategyStatus } from '../CreateStrategyModal/types';

/**
 * @interface StrategyCardProps
 * @description Contract for the industrial strategy management card.
 */
export interface StrategyCardProps {
  /** The strategy definition */
  strategy: StrategyConfig;
  /** Performance snapshot (Win rate, Return, etc.) */
  performance?: {
    winRate: number;
    totalReturn: number;
    drawdown: number;
    riskScore: number;
  };
  /** Callbacks for operational control */
  onActivate?: (id: string) => void;
  onPause?: (id: string) => void;
  onBacktest?: (id: string) => void;
  onClone?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  /** State flags */
  isLoading?: boolean;
  className?: string;
}
