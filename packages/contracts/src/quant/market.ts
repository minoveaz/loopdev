import { z } from 'zod';

// ============= ENUMS =============
export const TradingEnvironmentSchema = z.enum(['testnet', 'production']);
export type TradingEnvironment = z.infer<typeof TradingEnvironmentSchema>;

// ============= DOMAIN SCHEMAS =============

/**
 * @schema MarketCandleSchema
 * @description Standard OHLCV candle for time-series storage.
 * Note: Prices are stored in Cents (Integer) to ensure financial precision.
 */
export const MarketCandleSchema = z.object({
  id: z.string().uuid().optional(),
  pair: z.string().min(3).max(20),
  environment: TradingEnvironmentSchema,
  timeframe: z.string().min(1).max(5),
  open: z.number().int().positive(),   // In Cents
  high: z.number().int().positive(),   // In Cents
  low: z.number().int().positive(),    // In Cents
  close: z.number().int().positive(),  // In Cents
  volume: z.number().nonnegative(),    // Volume can be decimal
  timestamp: z.string().datetime(),
  provider: z.string().default('binance'),
}).strict();

export type MarketCandle = z.infer<typeof MarketCandleSchema>;

/**
 * @schema MarketConfigSchema
 * @description Ingestor control configuration.
 */
export const MarketConfigSchema = z.object({
  pair: z.string(),
  is_active: z.boolean(),
  retention_days: z.number().int().min(1).max(365),
  fetch_interval: z.string().default('1m'),
  last_backfill_at: z.string().datetime().nullable(),
});

export type MarketConfig = z.infer<typeof MarketConfigSchema>;

// ============= API ENVELOPES =============

export const MarketHistoryResponseSchema = z.object({
  data: z.array(MarketCandleSchema),
  meta: z.object({
    pair: z.string(),
    count: z.number(),
    traceId: z.string(),
  }),
});

export type MarketHistoryResponse = z.infer<typeof MarketHistoryResponseSchema>;
