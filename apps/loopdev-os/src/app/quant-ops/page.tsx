'use client';

import React from 'react';
import { 
  LpdText, 
  Heading, 
  TechnicalSurface, 
  StatusPulse, 
  Icon, 
  Divider, 
  SimpleLineChart, 
  MetricCard,
  PositionsDataTable,
  PositionData,
  ActivityStream,
  ActivityEvent,
  RiskMeter
} from '@loopdev/ui';

/**
 * @page QuantOpsOverview
 * @version 0.0.1
 * @description Suite Landing Page for Trading Quant Ops.
 * Aligned with Blueprint UX v1.0 - Section 9.
 */
export default function QuantOpsOverview() {
  const mockEquityData = [10, 15, 8, 45, 30, 70, 55, 90, 85, 100, 95];

  const mockPositions: PositionData[] = [
    { 
      id: '1', 
      pair: 'BTC/USDT', 
      side: 'LONG', 
      strategy: 'ATR_Breakout_v1', 
      entryPrice: '64,120.00', 
      currentPrice: '64,420.50', 
      quantity: '0.024', 
      valueUsdt: '1,546.09', 
      pnlPct: '+1.24', 
      pnlUsdt: '19.17', 
      status: 'healthy' 
    },
    { 
      id: '2', 
      pair: 'SOL/USDT', 
      side: 'LONG', 
      strategy: 'Grid_Flow_v2', 
      entryPrice: '145.20', 
      currentPrice: '142.10', 
      quantity: '12.0', 
      valueUsdt: '1,705.20', 
      pnlPct: '-2.13', 
      pnlUsdt: '37.20', 
      status: 'at_risk' 
    }
  ];

  const mockLogs: ActivityEvent[] = [
    { id: 'l1', time: '14:32:01', type: 'BUY', pair: 'BTC/USDT', qty: '0.024', price: '64,240.50', status: 'filled', strategy: 'ATR_Breakout' },
    { id: 'l2', time: '12:15:42', type: 'REBUY', pair: 'SOL/USDT', qty: '12.0', price: '142.10', status: 'filled', strategy: 'Grid_Flow' },
    { id: 'l3', time: '10:02:10', type: 'SELL', pair: 'BTC/USDT', qty: '0.010', price: '65,100.20', status: 'filled', strategy: 'ATR_Breakout' },
    { id: 'l4', time: '09:45:00', type: 'RISK', pair: 'ETH/USDT', status: 'rejected', message: 'Max_Daily_Loss_Near', strategy: 'System_Guard' },
  ];

  return (
    <main className="h-full overflow-y-auto flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-32 custom-scrollbar">
      
      {/* 1. HERO STATS ROW (Section 9.1) */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Equity', value: '$12,420.50', delta: '+2.4%', trend: 'up' as const, icon: 'account_balance_wallet' },
          { label: 'Day PnL', value: '+$342.10', delta: '+1.2%', trend: 'up' as const, color: 'text-emerald-500', icon: 'trending_up' },
          { label: 'Unrealized PnL', value: '-$12.40', delta: '-0.01%', trend: 'down' as const, color: 'text-rose-500', icon: 'monitoring' },
          { label: 'Deployed Capital', value: '$4,200.00', delta: '33.8%', color: 'text-amber-500', icon: 'hub' },
          { label: 'Current Risk', value: 'Low', delta: 'Safe', trend: 'neutral' as const, color: 'text-blue-500', icon: 'shield_check' },
          { label: 'System Health', value: '100%', delta: 'Optimal', trend: 'up' as const, color: 'text-emerald-500', icon: 'speed' },
        ].map((stat, i) => (
          <MetricCard 
            key={i}
            label={stat.label}
            value={stat.value}
            delta={stat.delta}
            trend={stat.trend}
            icon={stat.icon}
            colorClassName={stat.color}
          />
        ))}
      </section>

      {/* 2. MAIN CHART & BENTO GRID (Section 9.2 & 9.3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Equity Curve (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <TechnicalSurface variant="surface" depth="raised" className="h-[450px] overflow-hidden">
            <div className="flex flex-col h-full p-6">
              <div className="flex items-center justify-between mb-8 shrink-0">
                <Heading size="sm" weight="bold" className="uppercase italic tracking-tighter">Equity_Curve_Analysis</Heading>
                <div className="flex gap-2">
                  {['1D', '7D', '30D', 'ALL'].map(t => (
                    <button key={t} className="px-3 py-1 rounded-lg text-[10px] font-bold border border-border-technical hover:bg-background-subtle transition-colors">{t}</button>
                  ))}
                </div>
              </div>
              <div className="flex-1 relative bg-background-subtle/20 rounded-2xl border border-border-technical/30 overflow-hidden">
                 <SimpleLineChart data={mockEquityData} isLive color="var(--lpd-color-brand-primary)">
                    <div className="absolute top-6 left-6 flex flex-col gap-1 pointer-events-none">
                       <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-widest">+12.42% Total_Growth</span>
                       <span className="text-[8px] font-mono text-text-muted/40 uppercase tracking-tighter italic">// realtime_stream_active</span>
                    </div>
                 </SimpleLineChart>
              </div>
            </div>
          </TechnicalSurface>
        </div>

        {/* Operational Sidebar (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Bot Status Block */}
          <TechnicalSurface variant="surface" depth="raised" className="p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <Heading size="xs" weight="bold" className="uppercase tracking-tight opacity-60">Bot_Status</Heading>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[9px] font-bold border border-emerald-500/20 uppercase">Live_Trading</span>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between py-2 border-b border-border-technical/30">
                <LpdText size="xs" className="text-text-muted">Active Strategies</LpdText>
                <LpdText size="xs" weight="bold" className="font-mono">03</LpdText>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border-technical/30">
                <LpdText size="xs" className="text-text-muted">Open Positions</LpdText>
                <LpdText size="xs" weight="bold" className="font-mono">02</LpdText>
              </div>
              <div className="flex items-center justify-between py-2">
                <LpdText size="xs" className="text-text-muted">Pending Orders</LpdText>
                <LpdText size="xs" weight="bold" className="font-mono">00</LpdText>
              </div>
            </div>
            <button className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-500/20">
              Emergency_Kill_Switch
            </button>
          </TechnicalSurface>

          {/* Open Risk Block */}
          <TechnicalSurface variant="surface" depth="raised" className="p-6 flex flex-col gap-6 bg-slate-900 text-white">
            <RiskMeter 
              title="Open_Risk"
              subtitle="Within_Limits"
              value={4200}
              maxValue={10000}
              valueLabel="$4,200.00"
              maxLabel="/ $10,000"
            />
            <LpdText size="nano" className="text-slate-400 italic">Max Drawdown Active: <span className="text-emerald-400">-0.42%</span></LpdText>
          </TechnicalSurface>

        </div>
      </div>

      {/* 3. ACTIVE POSITIONS (Section 11) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <Heading size="sm" weight="bold" className="uppercase italic tracking-tighter opacity-60">Active_Market_Positions</Heading>
          <LpdText size="nano" className="font-mono text-text-muted uppercase tracking-widest">Total_Exposure: $3,251.29</LpdText>
        </div>
        <PositionsDataTable 
          data={mockPositions} 
          onViewDetail={(id) => console.log('View detail', id)}
          onClosePosition={(id) => console.log('Close', id)}
        />
      </section>

      {/* 4. TODAY ACTIVITY (Section 9.4) */}
      <ActivityStream 
        title="Today_Activity_Stream" 
        events={mockLogs} 
        isLive 
      />

    </main>
  );
}