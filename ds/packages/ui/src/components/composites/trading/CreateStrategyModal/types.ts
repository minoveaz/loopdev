import { Asset } from '../../../../atoms/trading/AssetSelector/types';

export type StrategyMode = 'paper' | 'live';
export type StrategyStatus = 'draft' | 'active' | 'paused' | 'archived';

export interface StrategyParameter {
  id: string;
  label: string;
  default: any;
  type: string;
  description: string;
  min?: number;
  max?: number;
}

export interface StrategyDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  technical_summary: string;
  recommended_timeframe: string;
  parameters: StrategyParameter[];
}

export interface StrategyConfig {
  id?: string;
  name: string;
  coreId: string;
  description?: string;
  exchangeId: string;
  mode: StrategyMode;
  status: StrategyStatus;
  pairs: string[];
  parameters: Record<string, any>;
  // Global Risk Guard (Standard for all strategies)
  stopLoss: number;
  takeProfit: number;
}

/**
 * @interface CreateStrategyModalProps
 * @description Contract for the dynamic strategy creation factory.
 */
export interface CreateStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (strategy: StrategyConfig) => void;
  /** Available exchanges */
  exchanges: Array<{ id: string; name: string; provider: string }>;
  /** Available certified assets */
  availableAssets: Asset[];
  /** Official cores from Python Registry */
  availableCores: StrategyDefinition[];
  /** Whether the creation process is pending */
  isLoading?: boolean;
}
