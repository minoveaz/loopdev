/**
 * Trade History & Orders Type Definitions
 */

export interface Order {
  id: string;
  bot_id: string;
  bot_name: string;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  status: string;
  signal_source: string;
  created_at: string;
  exchange_order_id: string;
}

export interface OrdersResponse {
  data: Order[];
  total: number;
  limit: number;
  offset: number;
  pages: number;
}

interface TradeMetrics {
  pnl: number;
  pnl_pct: number;
  entry_price: number;
  exit_price: number;
}

export interface OrderStats {
  total_orders: number;
  buy_orders: number;
  sell_orders: number;
  total_pnl_usdt: number;
  total_pnl_pct: number;
  win_rate: number;
  avg_pnl_usdt: number;
  avg_pnl_pct: number;
  top_exit_reason: string;
  best_trade: TradeMetrics | null;
  worst_trade: TradeMetrics | null;
}

export interface ClosedTrade {
  entry_order: {
    id: string;
    side: 'buy' | 'sell';
    price: number;
    quantity: number;
    created_at: string;
    signal_source: string;
  };
  exit_order: {
    id: string;
    side: 'buy' | 'sell';
    price: number;
    quantity: number;
    created_at: string;
    signal_source: string;
  };
  entry_price: number;
  exit_price: number;
  quantity: number;
  duration_minutes: number;
  pnl_usdt: number;
  pnl_pct: number;
  exit_reason: string;
}

export interface ClosedTradesResponse {
  data: ClosedTrade[];
  total: number;
  limit: number;
  offset: number;
  pages: number;
}

export interface OrderFilters {
  bot_id?: string;
  side?: 'buy' | 'sell';
  status?: string;
  limit?: number;
  offset?: number;
}

export interface TradeFilters {
  bot_id?: string;
  limit?: number;
  offset?: number;
}
