import { z } from 'zod';

// --- ENUMS & ATOMS ---

export const BotStatusSchema = z.enum(['active', 'paused', 'emergency_stop', 'liquidated', 'paper_trading']);
export type BotStatus = z.infer<typeof BotStatusSchema>;

export const TradingPairSchema = z.string().regex(/^[A-Z0-9]+\/[A-Z0-9]+$/, {
  message: "Trading pair must be in format BASE/QUOTE (e.g. BTC/USDT)"
});

export const OrderSideSchema = z.enum(['buy', 'sell']);
export const OrderTypeSchema = z.enum(['market', 'limit', 'stop_loss', 'take_profit']);

// --- RISK MANAGEMENT ---

export const RiskProfileSchema = z.object({
  maxDailyLossPct: z.number().min(0.1).max(10).default(2), // Halt if daily loss > 2%
  globalStopLossPct: z.number().min(0.5).max(50).default(5), // Close all if total loss > 5%
  maxRebuys: z.number().int().min(0).max(10).default(3), // Legacy logic: max strategic re-entries
  maxExposureUsdt: z.number().positive(), // Max USDT committed to this bot
  cooldownPeriodMinutes: z.number().int().default(60) // Time to wait after a loss
});
export type RiskProfile = z.infer<typeof RiskProfileSchema>;

// --- BOT CONFIGURATION ---

export const BotConfigSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).max(50),
  pair: TradingPairSchema,
  exchangeId: z.string(), // Reference to exchange credentials
  strategyId: z.string(), // e.g., 'intraday-atr-v1'
  baseInvestmentUsdt: z.number().min(10),
  status: BotStatusSchema.default('paper_trading'),
  riskProfile: RiskProfileSchema,
  
  // Legacy rescued flags
  useInitialRangeFilter: z.boolean().default(true),
  useMarketRegimeFilter: z.boolean().default(true),
  
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type BotConfig = z.infer<typeof BotConfigSchema>;

// --- EXECUTION & STATE ---

export const OrderIntentSchema = z.object({
  botId: z.string().uuid(),
  side: OrderSideSchema,
  type: OrderTypeSchema,
  quantity: z.number().positive(),
  price: z.number().positive().optional(), // Required for limit orders
  signalSource: z.string(), // Why was this order generated?
  metadata: z.record(z.any()).optional()
});
export type OrderIntent = z.infer<typeof OrderIntentSchema>;

export const PositionSchema = z.object({
  botId: z.string().uuid(),
  pair: TradingPairSchema,
  entryPrice: z.number().positive(),
  averagePrice: z.number().positive(),
  totalQuantity: z.number().positive(),
  totalInvestedUsdt: z.number().positive(),
  unrealizedPnLUsdt: z.number(),
  unrealizedPnLPct: z.number(),
  rebuysCount: z.number().int().default(0),
  lastUpdated: z.string().datetime()
});
export type Position = z.infer<typeof PositionSchema>;
