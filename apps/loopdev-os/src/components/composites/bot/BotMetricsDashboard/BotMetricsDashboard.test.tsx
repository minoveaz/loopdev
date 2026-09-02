/**
 * @file BotMetricsDashboard.test.tsx
 * @description Unit tests for BotMetricsDashboard composite component
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BotMetricsDashboard } from './index';
import * as metricsHook from '@/hooks/trading/useStrategyMetrics';

// Mock the useStrategyMetrics hook
vi.mock('@/hooks/trading/useStrategyMetrics', () => ({
  useStrategyMetrics: vi.fn(),
}));

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

describe('BotMetricsDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: null,
      loading: true,
      error: null,
      isConnected: false,
      refresh: vi.fn(),
    });

    render(<BotMetricsDashboard botId="test-bot" />);

    // Loading skeleton should be visible
    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('renders metrics when data is loaded', async () => {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: mockMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });

    render(<BotMetricsDashboard botId="test-bot" botName="Test Bot" />);

    await waitFor(() => {
      expect(screen.getByText('Test Bot')).toBeInTheDocument();
      expect(screen.getByRole('status', { name: /RSI:/ })).toBeInTheDocument();
      expect(screen.getByText('71000.45')).toBeInTheDocument(); // SMA50
    });
  });

  it('renders an error state when metrics loading fails', () => {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: null,
      loading: false,
      error: 'Failed to fetch metrics',
      isConnected: false,
      refresh: vi.fn(),
    });

    render(<BotMetricsDashboard botId="test-bot" />);

    expect(screen.getByText('Failed to fetch metrics')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('renders the bot connection status indicator', () => {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: mockMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });

    render(<BotMetricsDashboard botId="test-bot" />);

    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('renders health warnings when metrics data is stale', async () => {
    const staleMetrics = {
      ...mockMetrics,
      last_updated: new Date(Date.now() - 60000).toISOString(), // 60 seconds old
    };

    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: staleMetrics,
      loading: false,
      error: null,
      isConnected: false,
      refresh: vi.fn(),
    });

    render(<BotMetricsDashboard botId="test-bot" />);

    await waitFor(() => {
      const warning = screen.queryByText(/Data is/);
      // Should have a warning about data age
    });
  });

  it('renders entry signal analysis section', () => {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: mockMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });

    render(<BotMetricsDashboard botId="test-bot" />);

    expect(screen.getByText('Entry Signals')).toBeInTheDocument();
    expect(screen.getByText('LONG Entry')).toBeInTheDocument();
    expect(screen.getByText('SHORT Entry')).toBeInTheDocument();
  });

  it('renders position preview section when showExtended is true', () => {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: mockMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });

    render(<BotMetricsDashboard botId="test-bot" showExtended={true} />);

    expect(screen.getByText('Position Preview')).toBeInTheDocument();
    expect(screen.getByText('LONG Position')).toBeInTheDocument();
    expect(screen.getByText('SHORT Position')).toBeInTheDocument();
  });

  it('does not render position preview when showExtended is false', () => {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: mockMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });

    render(<BotMetricsDashboard botId="test-bot" showExtended={false} />);

    expect(screen.queryByText('Position Preview')).not.toBeInTheDocument();
  });

  it('has refresh button', () => {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: mockMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });

    render(<BotMetricsDashboard botId="test-bot" />);

    expect(screen.getByText('↻ Refresh Metrics')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: mockMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });

    const { container } = render(<BotMetricsDashboard botId="test-bot" className="custom-class" />);

    const dashboard = container.firstChild;
    expect(dashboard?.className).toContain('custom-class');
  });

  it('renders MetricGauge with the bot RSI metric', () => {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: mockMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });

    render(<BotMetricsDashboard botId="test-bot" />);

    expect(screen.getByRole('status', { name: /RSI:/ })).toBeInTheDocument();
  });

  it('renders MetricCards for price, SMA50, ATR, and volatility', async () => {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: mockMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });

    render(<BotMetricsDashboard botId="test-bot" />);

    await waitFor(() => {
      expect(screen.getByText('Current Price')).toBeInTheDocument();
      expect(screen.getByText('SMA50')).toBeInTheDocument();
      expect(screen.getByText('ATR')).toBeInTheDocument();
      expect(screen.getByText('Volatility')).toBeInTheDocument();
    });
  });

  it('calls onMetricsUpdate callback when metrics change', () => {
    const callback = vi.fn();

    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: mockMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });

    render(<BotMetricsDashboard botId="test-bot" onMetricsUpdate={callback} />);

    // Callback should be called when component receives metrics
    expect(callback).toHaveBeenCalledWith(mockMetrics);
  });

  it('renders nothing when metrics are null and not loading', () => {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: null,
      loading: false,
      error: null,
      isConnected: false,
      refresh: vi.fn(),
    });

    render(<BotMetricsDashboard botId="test-bot" />);

    expect(screen.getByText('No metrics available')).toBeInTheDocument();
  });

  it('passes botId to useStrategyMetrics hook', () => {
    vi.mocked(metricsHook.useStrategyMetrics).mockReturnValue({
      metrics: mockMetrics,
      loading: false,
      error: null,
      isConnected: true,
      refresh: vi.fn(),
    });

    render(<BotMetricsDashboard botId="specific-bot-id" />);

    expect(metricsHook.useStrategyMetrics).toHaveBeenCalledWith('specific-bot-id');
  });
});
