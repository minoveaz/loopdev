/**
 * @hook useStrategyMetrics
 * @description Real-time metrics fetching for trading bots
 *
 * Features:
 * - REST API initial fetch (better caching)
 * - WebSocket for real-time updates (< 1s latency)
 * - Automatic reconnection with exponential backoff
 * - Error handling and fallback to REST polling
 * - Zero hardcoding - all metrics calculated on backend
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface RSIMetrics {
  value: number;
  period: number;
  oversold_threshold: number;
  overbought_threshold: number;
  status: 'oversold' | 'neutral' | 'overbought';
}

interface SMA50Metrics {
  value: number;
  price: number;
  distance: number;
  distance_pct: number;
  position: 'above' | 'below';
}

interface SignalMetrics {
  required_level: number;
  current_value: number;
  gap: number;
  gap_pct: number;
  ready: boolean;
}

interface PositionPreview {
  entry_price: number;
  long_tp: number;
  long_sl: number;
  short_tp: number;
  short_sl: number;
}

interface VolatilityMetrics {
  atr: number;
  atr_pct: number;
  status: 'low' | 'normal' | 'high';
}

export interface StrategyMetricsSnapshot {
  current_price: number;
  rsi: RSIMetrics;
  sma50: SMA50Metrics;
  signals: {
    long_entry: SignalMetrics;
    short_entry: SignalMetrics;
  };
  preview: PositionPreview;
  volatility: VolatilityMetrics;
  last_updated: string;
  update_frequency_ms: number;
}

export interface UseStrategyMetricsReturn {
  metrics: StrategyMetricsSnapshot | null;
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  refresh: () => Promise<void>;
}

const QUANT_API_BASE = process.env.NEXT_PUBLIC_QUANT_API_URL || 'http://localhost:8000';
const QUANT_WS_BASE = process.env.NEXT_PUBLIC_QUANT_WS_URL || 'ws://localhost:8000';
const RECONNECT_DELAY_MS = 2000;
const MAX_RECONNECT_ATTEMPTS = 5;
const POLLING_INTERVAL_MS = 3000;

export const useStrategyMetrics = (botId: string): UseStrategyMetricsReturn => {
  const [metrics, setMetrics] = useState<StrategyMetricsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch metrics via REST API
  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${QUANT_API_BASE}/strategies/${botId}/metrics`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success && data.data) {
        setMetrics(data.data);
        setError(null);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch metrics';
      setError(message);
      console.error('[useStrategyMetrics] Fetch error:', message);
    } finally {
      setLoading(false);
    }
  }, [botId]);

  // WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    try {
      const wsUrl = `${QUANT_WS_BASE}/strategies/ws/${botId}/metrics`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('[useStrategyMetrics] WebSocket connected');
        setIsConnected(true);
        reconnectCountRef.current = 0;
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.event === 'metrics_update' && message.data) {
            setMetrics(message.data);
            setError(null);
          } else if (message.event === 'error') {
            console.warn('[useStrategyMetrics]', message.message);
            setError(message.message);
          }
        } catch (err) {
          console.error('[useStrategyMetrics] Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('[useStrategyMetrics] WebSocket error:', event);
        setIsConnected(false);
        setError('WebSocket connection error');
      };

      ws.onclose = () => {
        console.log('[useStrategyMetrics] WebSocket closed');
        setIsConnected(false);
        wsRef.current = null;

        // Attempt to reconnect with exponential backoff
        if (reconnectCountRef.current < MAX_RECONNECT_ATTEMPTS) {
          const delay = RECONNECT_DELAY_MS * Math.pow(2, reconnectCountRef.current);
          reconnectCountRef.current++;

          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(
              `[useStrategyMetrics] Reconnecting (attempt ${reconnectCountRef.current})...`,
            );
            connectWebSocket();
          }, delay);
        } else {
          console.warn(
            '[useStrategyMetrics] Max reconnection attempts reached. Falling back to polling.',
          );
          setError('WebSocket disconnected. Switching to polling mode.');
          startPolling();
        }
      };

      wsRef.current = ws;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect WebSocket';
      console.error('[useStrategyMetrics]', message);
      setError(message);
      setIsConnected(false);
      startPolling();
    }
  }, [botId]);

  // Start polling fallback
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) return; // Already polling

    console.log('[useStrategyMetrics] Starting REST polling mode');

    pollingIntervalRef.current = setInterval(() => {
      fetchMetrics();
    }, POLLING_INTERVAL_MS);
  }, [fetchMetrics]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      console.log('[useStrategyMetrics] Polling stopped');
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
        wsRef.current = null;
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [stopPolling]);

  // Initialize connection
  useEffect(() => {
    // Try WebSocket first
    fetchMetrics().then(() => {
      connectWebSocket();
    });
  }, [botId, fetchMetrics, connectWebSocket]);

  // Manual refresh
  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    isConnected,
    refresh,
  };
};
