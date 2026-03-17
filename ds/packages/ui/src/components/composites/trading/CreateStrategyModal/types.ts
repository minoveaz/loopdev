import { Asset } from '../../../../atoms/trading/AssetSelector/types';

export type StrategyMode = 'paper' | 'live';
export type StrategyStatus = 'draft' | 'active' | 'paused' | 'archived';

export interface StrategyRiskProfile {
  sizePerTrade: number;
  maxPositions: number;
  maxExposure: number;
  stopLoss: number;
  takeProfit: number;
  trailingStop: number;
  cooldownMinutes: number;
  dailyLossLimit: number;
}

export interface StrategyConfig {
  id?: string;
  name: string;
  description?: string;
  exchangeId: string;
  mode: StrategyMode;
  status: StrategyStatus;
  pairs: string[];
  riskProfile: StrategyRiskProfile;
}

/**
 * @interface CreateStrategyModalProps
 * @description Contract for the industrial strategy creation workflow.
 */
export interface CreateStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (strategy: StrategyConfig) => void;
  /** Available exchanges for connection */
  exchanges: Array<{ id: string; name: string; provider: string }>;
  /** Available certified assets from the DB */
  availableAssets: Asset[];
  /** Whether the creation process is pending */
  isLoading?: boolean;
}
