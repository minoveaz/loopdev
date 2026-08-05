'use client';

import React from 'react';
import { LpdText } from '@loopdev/ui';
import type { OrdersResponse, Order } from '@/types/orders';

interface OrdersTableProps {
  data: OrdersResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  onPageChange?: (offset: number) => void;
  currentOffset?: number;
}

export function OrdersTable({
  data,
  isLoading,
  error,
  onPageChange,
  currentOffset = 0,
}: OrdersTableProps) {
  if (isLoading) {
    return (
      <div className="bg-background-surface rounded-lg border border-border-technical/30 p-8">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-background-elevated rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
        <LpdText size="sm" className="text-red-500">
          Failed to load orders
        </LpdText>
      </div>
    );
  }

  if (data.data.length === 0) {
    return (
      <div className="bg-background-surface rounded-lg border border-border-technical/30 p-12 text-center">
        <LpdText size="sm" className="text-text-muted">
          No orders found
        </LpdText>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-background-surface rounded-lg border border-border-technical/30 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-7 gap-4 p-4 bg-background-elevated border-b border-border-technical/30">
          <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-wide">
            Date
          </LpdText>
          <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-wide">
            Bot
          </LpdText>
          <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-wide">
            Side
          </LpdText>
          <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-wide">
            Price
          </LpdText>
          <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-wide">
            Qty
          </LpdText>
          <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-wide">
            Signal
          </LpdText>
          <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-wide">
            Status
          </LpdText>
        </div>

        {/* Table Rows */}
        {data.data.map((order: Order) => (
          <div
            key={order.id}
            className="grid grid-cols-7 gap-4 p-4 border-b border-border-technical/10 hover:bg-background-elevated/50 transition-colors"
          >
            <LpdText size="sm" className="text-text-main font-mono">
              {new Date(order.created_at).toLocaleDateString()}
            </LpdText>
            <LpdText size="sm" className="text-text-main">
              {order.bot_name}
            </LpdText>
            <LpdText
              size="sm"
              weight="bold"
              className={order.side === 'buy' ? 'text-green-500' : 'text-red-500'}
            >
              {order.side.toUpperCase()}
            </LpdText>
            <LpdText size="sm" className="text-text-main font-mono">
              ${order.price.toFixed(2)}
            </LpdText>
            <LpdText size="sm" className="text-text-main font-mono">
              {order.quantity.toFixed(6)}
            </LpdText>
            <LpdText size="xs" className="text-text-muted">
              {order.signal_source}
            </LpdText>
            <LpdText size="sm" className="text-text-main uppercase">
              {order.status}
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
