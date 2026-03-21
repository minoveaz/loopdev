import { BotConfig, BotStatus } from '@loopdev/contracts';

/**
 * @interface BotCardProps
 * @description Contract for the industrial bot management card with Institutional Analytics.
 */
export interface BotCardProps {
  /** The bot configuration data */
  bot: BotConfig & {
    macroSentiment?: 'bullish' | 'bearish' | 'neutral';
    priceHistory?: number[];
  };
  /** Performance metrics (Profit, Win Rate, etc.) */
  stats?: {
    totalProfitPct: number;
    totalProfitUsdt: number;
    winRate: number;
    uptime: string;
  };
  /** Live state from the engine */
  liveState?: {
    currentAction: string;
    openPosition?: {
      entryPrice: number;
      investedUsdt: number;
      inventory: number; // Quantitative Units
      openedAt?: string;
      quantity: number;
      pnlPct: number;
      pnlUsdt: number;
      exitTargets?: {
        slPrice: number;
        tpPrice: number;
        bePrice?: number; // Break-even target
      };
    };
    logicSnapshot?: Record<string, any>;
  };
  /** Direction indicators for visual feedback */
  priceDirection?: 'up' | 'down' | null;
  smaDirection?: 'up' | 'down' | null;
  atrDirection?: 'up' | 'down' | null;
  /** Callback when the status toggle is triggered */
  onToggleStatus?: (id: string, currentStatus: BotStatus) => void;
  /** Professional Tactical Commands */
  onMarketExit?: (id: string) => Promise<void>;
  onSetToBE?: (id: string) => Promise<void>;
  onExecuteTP?: (id: string) => Promise<void>;
  /** Callback to open the management drawer/panel */
  onOpenDetails?: (id: string) => void;
  /** Callback to open settings/edit */
  onEdit?: (id: string) => void;
  /** Callback to delete the bot */
  onDelete?: (id: string) => void;
  /** Whether the card is in a loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}
