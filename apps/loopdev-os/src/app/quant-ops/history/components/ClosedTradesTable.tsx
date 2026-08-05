'use client';

import React from 'react';
import { LpdText } from '@loopdev/ui';
import type { ClosedTradesResponse, ClosedTrade } from '@/types/orders';

interface ClosedTradesTableProps {
  data: ClosedTradesResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  onPageChange?: (offset: number) => void;
  currentOffset?: number;
}

export function ClosedTradesTable({
  data,
  isLoading,
  error,
  onPageChange,
  currentOffset = 0,
}: ClosedTradesTableProps) {
  if (isLoading) {
    return (
      <div className="bg-background-surface rounded-lg border border-border-technical/30 p-8">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-background-elevated rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
        <LpdText size="sm" className="text-red-500">
          Failed to load closed trades
        </LpdText>
      </div>
    );
  }

  if (data.data.length === 0) {
    return (
      <div className="bg-background-surface rounded-lg border border-border-technical/30 p-12 text-center">
        <LpdText size="sm" className="text-text-muted">
          No closed trades found
        </LpdText>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-background-surface rounded-lg border border-border-technical/30 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-8 gap-3 p-4 bg-background-elevated border-b border-border-technical/30">
          <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-wide">
            Entry Date
          </LpdText>
          <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-wide">
            Entry Price
          </LpdText>
          <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-wide">
            Exit Price
          </LpdText>
          <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-wide">
            Duration
          </LpdText>
          <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-wide">
            Qty
          </LpdText>
          <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-wide">
            P&L
          </LpdText>
          <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-wide">
            %
          </LpdText>
          <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-wide">
            Exit Reason
          </LpdText>
        </div>

        {/* Table Rows */}
        {data.data.map((trade: ClosedTrade, idx: number) => (
          <div
            key={`${trade.entry_order.id}-${idx}`}
            className="grid grid-cols-8 gap-3 p-4 border-b border-border-technical/10 hover:bg-background-elevated/50 transition-colors"
          >
            <LpdText size="sm" className="text-text-main font-mono">
              {new Date(trade.entry_order.created_at).toLocaleDateString()}
            </LpdText>
            <LpdText size="sm" className="text-text-main font-mono">
              ${trade.entry_price.toFixed(2)}
            </LpdText>
            <LpdText size="sm" className="text-text-main font-mono">
              ${trade.exit_price.toFixed(2)}
            </LpdText>
            <LpdText size="sm" className="text-text-muted">
              {Math.floor(trade.duration_minutes / 60)}h {trade.duration_minutes % 60}m
            </LpdText>
            <LpdText size="sm" className="text-text-main font-mono">
              {trade.quantity.toFixed(6)}
            </LpdText>
            <LpdText
              size="sm"
              weight="bold"
              className={trade.pnl_usdt >= 0 ? 'text-green-500' : 'text-red-500'}
            >
              ${trade.pnl_usdt.toFixed(2)}
            </LpdText>
            <LpdText
              size="sm"
              weight="bold"
              className={trade.pnl_pct >= 0 ? 'text-green-500' : 'text-red-500'}
            >
              {trade.pnl_pct.toFixed(2)}%
            </LpdText>
            <LpdText size="xs" className="text-text-muted uppercase">
              {trade.exit_reason}
            </LpdText>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data.pages > 1 && (
        <div className="flex items-center justify-between">
          <LpdText size="xs" className="text-text-muted">
            Page {Math.floor(currentOffset / (data.limit || 50)) + 1} of {data.pages}
            {' '} ({data.total} total)
          </LpdText>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange?.(Math.max(0, currentOffset - (data.limit || 50)))}
              disabled={currentOffset === 0}
              className="px-3 py-1 text-sm border border-border-technical/30 rounded hover:bg-background-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={() => onPageChange?.((currentOffset || 0) + (data.limit || 50))}
              disabled={currentOffset + (data.limit || 50) >= data.total}
              className="px-3 py-1 text-sm border border-border-technical/30 rounded hover:bg-background-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
