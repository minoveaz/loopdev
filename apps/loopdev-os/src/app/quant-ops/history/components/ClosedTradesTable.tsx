'use client';

import React from 'react';
import { LpdText } from '@loopdev/ui';
import type { ClosedTradesResponse, ClosedTrade } from '@/types/orders';
import { TablePagination } from './TablePagination';
import { HistoryTableState } from './HistoryTableState';

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
    return <HistoryTableState kind="loading" loadingRowClassName="h-16" />;
  }

  if (error || !data) {
    return <HistoryTableState kind="error" message="closed trades" />;
  }

  if (data.data.length === 0) {
    return <HistoryTableState kind="empty" message="closed trades" />;
  }

  return (
    <div className="space-y-4">
      <div className="bg-background-surface rounded-lg border border-border-technical/30 overflow-hidden">
        <div className="grid grid-cols-8 gap-3 p-4 bg-background-elevated border-b border-border-technical/30">
          {[
            'Entry Date',
            'Entry Price',
            'Exit Price',
            'Duration',
            'Qty',
            'P&L',
            '%',
            'Exit Reason',
          ].map((label) => (
            <LpdText
              key={label}
              size="xs"
              weight="bold"
              className="text-text-muted uppercase tracking-wide"
            >
              {label}
            </LpdText>
          ))}
        </div>
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
      <TablePagination
        pages={data.pages}
        total={data.total}
        limit={data.limit}
        currentOffset={currentOffset}
        onPageChange={onPageChange}
      />
    </div>
  );
}
