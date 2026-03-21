'use client';

import React, { useState } from 'react';
import { LpdText } from '@loopdev/ui';
import { useOrders, useOrderStats, useClosedTrades } from '@/hooks/orders';
import {
  StatsCards,
  OrdersTable,
  ClosedTradesTable,
  OrderFilters,
} from './components';
import type { OrderFilters as OrderFiltersType } from '@/types/orders';

export default function TradeHistoryPage() {
  const [orderFilters, setOrderFilters] = useState<OrderFiltersType>({
    limit: 50,
    offset: 0,
  });

  const [tradeOffset, setTradeOffset] = useState(0);

  // Fetch data with hooks
  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useOrders(orderFilters);
  const { data: statsData, isLoading: statsLoading, error: statsError } = useOrderStats();
  const { data: tradesData, isLoading: tradesLoading, error: tradesError } = useClosedTrades({
    limit: 50,
    offset: tradeOffset,
  });

  const handleFiltersChange = (filters: OrderFiltersType) => {
    setOrderFilters({ ...filters, offset: 0 });
  };

  return (
    <main className="h-full overflow-y-auto flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-32 custom-scrollbar">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <LpdText size="2xl" weight="bold" className="text-text-main tracking-tight uppercase italic">
          Trade_Audit_History
        </LpdText>
        <LpdText size="sm" className="text-text-muted max-w-2xl leading-relaxed">
          Comprehensive audit trail of every closed position and executed order. Real-time statistics and detailed trade analysis.
        </LpdText>
      </header>

      {/* Statistics Overview */}
      <section className="flex flex-col gap-4">
        <LpdText size="lg" weight="bold" className="text-text-main uppercase">
          Performance Overview
        </LpdText>
        <StatsCards stats={statsData} isLoading={statsLoading} error={statsError} />
      </section>

      {/* All Orders Section */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <LpdText size="lg" weight="bold" className="text-text-main uppercase">
            All Orders
          </LpdText>
          <LpdText size="sm" className="text-text-muted">
            Complete list of all buy and sell orders executed by your trading bots.
          </LpdText>
        </div>

        <OrderFilters onFiltersChange={handleFiltersChange} />

        <OrdersTable
          data={ordersData}
          isLoading={ordersLoading}
          error={ordersError}
          currentOffset={orderFilters.offset || 0}
          onPageChange={(offset) => setOrderFilters({ ...orderFilters, offset })}
        />
      </section>

      {/* Closed Trades Section */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <LpdText size="lg" weight="bold" className="text-text-main uppercase">
            Closed Trades
          </LpdText>
          <LpdText size="sm" className="text-text-muted">
            Paired buy/sell trades with detailed profit and loss analysis.
          </LpdText>
        </div>

        <ClosedTradesTable
          data={tradesData}
          isLoading={tradesLoading}
          error={tradesError}
          currentOffset={tradeOffset}
          onPageChange={setTradeOffset}
        />
      </section>
    </main>
  );
}
