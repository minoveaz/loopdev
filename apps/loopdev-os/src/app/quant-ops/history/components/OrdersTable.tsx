'use client';

import React from 'react';
import { LpdText } from '@loopdev/ui';
import type { OrdersResponse, Order } from '@/types/orders';
import { TablePagination } from './TablePagination';
import { HistoryTableState } from './HistoryTableState';

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
    return <HistoryTableState kind="loading" />;
  }

  if (error || !data) {
    return <HistoryTableState kind="error" message="orders" />;
  }

  if (data.data.length === 0) {
    return <HistoryTableState kind="empty" message="orders" />;
  }

  return (
    <div className="space-y-4">
      <div className="bg-background-surface rounded-lg border border-border-technical/30 overflow-hidden">
        <div className="grid grid-cols-7 gap-4 p-4 bg-background-elevated border-b border-border-technical/30">
          {['Date', 'Bot', 'Side', 'Price', 'Qty', 'Signal', 'Status'].map((label) => (
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
