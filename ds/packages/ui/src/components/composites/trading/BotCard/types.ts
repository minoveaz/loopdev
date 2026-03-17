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
  /** Callback when the status toggle is triggered */
  onToggleStatus?: (id: string, currentStatus: BotStatus) => void;
  /** Callback to open settings/edit */
  onEdit?: (id: string) => void;
  /** Whether the card is in a loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}
