import { ReactNode } from 'react';

export type PositionStatus = 'healthy' | 'at_risk' | 'stop_nearby' | 'reconciling';
export type PositionSide = 'LONG' | 'SHORT';

export interface PositionData {
  id: string;
  pair: string;
  side: PositionSide;
  strategy: string;
  entryPrice: string | number;
  currentPrice: string | number;
  quantity: string | number;
  valueUsdt: string | number;
  pnlPct: string | number;
  pnlUsdt: string | number;
  status: PositionStatus;
}

/**
 * @interface PositionsDataTableProps
 * @description Contract for the industrial trading positions table.
 */
export interface PositionsDataTableProps {
  /** Array of active position data objects */
  data: PositionData[];
  /** Callback for viewing position details */
  onViewDetail?: (id: string) => void;
  /** Callback for closing a position manually */
  onClosePosition?: (id: string) => void;
  /** Whether the table is in a loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}
