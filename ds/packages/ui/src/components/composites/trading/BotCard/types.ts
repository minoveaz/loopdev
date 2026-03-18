import { BotConfig, BotStatus } from '@loopdev/contracts';

/**
 * @interface BotCardProps
 * @description Contract for the industrial bot management card.
 */
export interface BotCardProps {
  /** The bot configuration data */
  bot: BotConfig;
  /** Performance metrics (Profit, Win Rate, etc.) */
  stats?: {
    totalProfitPct: number;
    totalProfitUsdt: number;
    winRate: number;
    uptime: string;
  };
  /** Live state from the engine */
  liveState?: {
    currentAction: string; // e.g. "Scanning EMA20", "Awaiting Signal"
    openPosition?: {
      entryPrice: number;
      investedUsdt: number;
      openedAt?: string;
      quantity: number;
      pnlPct: number;
      pnlUsdt: number;
      exitTargets?: {
        slPrice: number;
        tpPrice: number;
      };
    };
    logicSnapshot?: Record<string, any>;
  };
  /** Callback when the status toggle is triggered */
  onToggleStatus?: (id: string, currentStatus: BotStatus) => void;
  /** Callback to open settings/edit */
  onEdit?: (id: string) => void;
  /** Callback to delete the bot */
  onDelete?: (id: string) => void;
  /** Whether the card is in a loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}
