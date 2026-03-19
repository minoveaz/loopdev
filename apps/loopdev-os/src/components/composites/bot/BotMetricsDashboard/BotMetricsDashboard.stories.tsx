/**
 * @file BotMetricsDashboard.stories.tsx
 * @description Storybook stories for BotMetricsDashboard composite
 */

import type { Meta, StoryObj } from '@storybook/react';
import { BotMetricsDashboard } from './index';
import * as metricsHook from '@/hooks/trading/useStrategyMetrics';
import { vi } from 'vitest';

// Mock the hook
vi.mock('@/hooks/trading/useStrategyMetrics');

const mockMetrics = {
  current_price: 71073.74,
  rsi: {
    value: 45.2,
    period: 14,
    oversold_threshold: 30,
    overbought_threshold: 70,
    status: 'neutral' as const,
  },
  sma50: {
    value: 71000.45,
    price: 71073.74,
    distance: 73.29,
    distance_pct: 0.103,
    position: 'above' as const,
  },
  signals: {
    long_entry: {
      required_level: 30,
      current_value: 45.2,
      gap: -15.2,
      gap_pct: 50.6,
      ready: false,
    },
    short_entry: {
      required_level: 70,
      current_value: 45.2,
      gap: 24.8,
      gap_pct: 35.4,
      ready: false,
    },
  },
  preview: {
    entry_price: 71073.74,
    long_tp: 71108.24,
    long_sl: 71039.24,
    short_tp: 71039.24,
    short_sl: 71108.24,
  },
  volatility: {
    atr: 36.146,
    atr_pct: 0.051,
    status: 'normal' as const,
  },
  last_updated: new Date().toISOString(),
  update_frequency_ms: 1000,
};

const meta: Meta<typeof BotMetricsDashboard> = {
  title: 'Composites/Bot/BotMetricsDashboard',
  component: BotMetricsDashboard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Real-time metrics dashboard for trading bots. Displays RSI gauge, entry signals, and position preview.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Normal state: Bot is live, metrics are being received
 */
export const Normal: Story = {
  args: {
    botId: 'bot-rsi-pro-test',
    botName: 'RSI Pro Test',
    showExtended: false,
  },
  beforeEach() {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: mockMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });
  },
};

/**
 * Extended view: Shows position preview (TP/SL)
 */
export const ExtendedView: Story = {
  args: {
    botId: 'bot-rsi-pro-test',
    botName: 'RSI Pro Test',
    showExtended: true,
  },
  beforeEach() {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: mockMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });
  },
};

/**
 * Loading state: Initial data fetch
 */
export const Loading: Story = {
  args: {
    botId: 'bot-rsi-pro-test',
    botName: 'RSI Pro Test',
  },
  beforeEach() {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: null,
      loading: true,
      error: null,
      isConnected: false,
      refresh: vi.fn(),
    });
  },
};

/**
 * Error state: Failed to fetch metrics
 */
export const Error: Story = {
  args: {
    botId: 'bot-rsi-pro-test',
    botName: 'RSI Pro Test',
  },
  beforeEach() {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: null,
      loading: false,
      error: 'Failed to fetch metrics from server',
      isConnected: false,
      refresh: vi.fn(),
    });
  },
};

/**
 * Polling mode: WebSocket disconnected, using REST polling
 */
export const PollingMode: Story = {
  args: {
    botId: 'bot-rsi-pro-test',
    botName: 'RSI Pro Test',
  },
  beforeEach() {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: mockMetrics,
      loading: false,
      error: null,
      isConnected: false,  // Polling instead of WebSocket
      refresh: vi.fn(),
    });
  },
};

/**
 * Oversold condition: RSI < 30, ready for long entry
 */
export const OversoldSignal: Story = {
  args: {
    botId: 'bot-rsi-pro-test',
    botName: 'RSI Pro Test',
  },
  beforeEach() {
    const oversoldMetrics = {
      ...mockMetrics,
      rsi: {
        ...mockMetrics.rsi,
        value: 25,
        status: 'oversold' as const,
      },
      signals: {
        ...mockMetrics.signals,
        long_entry: {
          ...mockMetrics.signals.long_entry,
          required_level: 30,
          current_value: 25,
          gap: 5,
          gap_pct: 16.7,
          ready: true,  // Ready to trigger!
        },
      },
    };

    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: oversoldMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });
  },
};

/**
 * Overbought condition: RSI > 70, ready for short entry
 */
export const OverboughtSignal: Story = {
  args: {
    botId: 'bot-rsi-pro-test',
    botName: 'RSI Pro Test',
  },
  beforeEach() {
    const overboughtMetrics = {
      ...mockMetrics,
      rsi: {
        ...mockMetrics.rsi,
        value: 78,
        status: 'overbought' as const,
      },
      signals: {
        ...mockMetrics.signals,
        short_entry: {
          ...mockMetrics.signals.short_entry,
          required_level: 70,
          current_value: 78,
          gap: -8,
          gap_pct: 11.4,
          ready: true,  // Ready to trigger!
        },
      },
    };

    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: overboughtMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });
  },
};

/**
 * High volatility: ATR spike, status = "high"
 */
export const HighVolatility: Story = {
  args: {
    botId: 'bot-rsi-pro-test',
    botName: 'RSI Pro Test',
  },
  beforeEach() {
    const volatileMetrics = {
      ...mockMetrics,
      volatility: {
        atr: 150.5,
        atr_pct: 0.212,
        status: 'high' as const,
      },
    };

    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: volatileMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });
  },
};

/**
 * Low volatility: ATR dip, status = "low"
 */
export const LowVolatility: Story = {
  args: {
    botId: 'bot-rsi-pro-test',
    botName: 'RSI Pro Test',
  },
  beforeEach() {
    const quietMetrics = {
      ...mockMetrics,
      volatility: {
        atr: 8.2,
        atr_pct: 0.011,
        status: 'low' as const,
      },
    };

    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: quietMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });
  },
};

/**
 * Responsive: Mobile (320px)
 */
export const MobileView: Story = {
  args: {
    botId: 'bot-rsi-pro-test',
    botName: 'RSI Pro Test',
    showExtended: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  beforeEach() {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: mockMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });
  },
};

/**
 * Responsive: Tablet (768px)
 */
export const TabletView: Story = {
  args: {
    botId: 'bot-rsi-pro-test',
    botName: 'RSI Pro Test',
    showExtended: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  beforeEach() {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: mockMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });
  },
};

/**
 * STRESS TEST: Long bot name with special characters
 */
export const StressLongBotName: Story = {
  args: {
    botId: 'bot-long-name',
    botName: 'My Ultra Professional RSI Mean Reversion Trading Bot V2.0 - Production Edition with Extended Features and Configuration Options',
  },
  beforeEach() {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: mockMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });
  },
};

/**
 * STRESS TEST: Edge case values (very high and very low)
 */
export const StressExtremeValues: Story = {
  args: {
    botId: 'bot-extreme',
    botName: 'Extreme Test Bot',
  },
  beforeEach() {
    const extremeMetrics = {
      ...mockMetrics,
      current_price: 100000.999,
      rsi: {
        ...mockMetrics.rsi,
        value: 99.9,
      },
      volatility: {
        atr: 500.25,
        atr_pct: 0.5,
        status: 'high' as const,
      },
    };

    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: extremeMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });
  },
};
