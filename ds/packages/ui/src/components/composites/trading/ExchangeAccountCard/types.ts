export type ExchangeProvider = 'binance' | 'kraken' | 'ibkr' | 'metatrader';
export type ConnectionStatus = 'healthy' | 'warning' | 'error' | 'disconnected';

export interface ExchangeAccount {
  id: string;
  name: string;
  provider: ExchangeProvider;
  status: ConnectionStatus;
  isPaper: boolean;
  lastSync?: string;
  lastVerifiedAt?: string;
  lastError?: string;
  apiKeyMasked: string;
}

/**
 * @interface ExchangeAccountCardProps
 * @description Contract for the industrial exchange connection card.
 */
export interface ExchangeAccountCardProps {
  /** The exchange account data */
  account: ExchangeAccount;
  /** Callback to test the connection */
  onTestConnection?: (id: string) => void;
  /** Callback to edit or rotate keys */
  onSettings?: (id: string) => void;
  /** Whether the card is in a loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}
