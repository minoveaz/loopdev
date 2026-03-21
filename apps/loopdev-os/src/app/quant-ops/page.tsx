'use client';

import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  LpdText, 
  Heading, 
  TechnicalSurface, 
  StatusPulse, 
  Icon, 
  MetricCard,
  PositionsDataTable,
  ActivityStream,
  RiskMeter,
  Skeleton,
  TechnicalDialog,
  Button,
  BotCardIndustrial,
  toast
} from '@loopdev/ui';
import { usePortfolioStats } from '@/hooks/trading/usePortfolioStats';
import { useBotFleet } from '@/hooks/trading/useBotFleet';
import { useActivityStream } from '@/hooks/trading/useActivityStream';
import { useQuantOps } from './context';

export default function QuantOpsOverview() {
  const [isKillSwitchConfirmOpen, setIsKillSwitchConfirmOpen] = useState(false);
  const { openBotInspector } = useQuantOps();
  const queryClient = useQueryClient();
  
  const { 
    totalEquity, 
    unrealizedPnlUsdt, 
    unrealizedPnlPct, 
    deployedCapital, 
    activeBotsCount, 
    openPositionsCount,
    activePositions 
  } = usePortfolioStats();

  const { bots, toggleStatus, updateBotTargets, isLoading } = useBotFleet();
  const { data: activity = [], isLoading: isActivityLoading } = useActivityStream();

  const handleToggle = async (id: string, status: any) => {
    await toggleStatus({ id, status });
    queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] });
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="grid grid-cols-6 gap-4"><Skeleton className="h-24 rounded-2xl" /></div>
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  return (
    <main className="h-full overflow-y-auto flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-32 custom-scrollbar">
      
      {/* 1. HERO METRICS */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard label="Net Equity" value={`$${totalEquity.toLocaleString()}`} delta={`${unrealizedPnlPct >= 0 ? '+' : ''}${unrealizedPnlPct.toFixed(2)}%`} trend={unrealizedPnlPct >= 0 ? 'up' : 'down'} icon="account_balance_wallet" />
        <MetricCard label="Aggregated PnL" value={`${unrealizedPnlUsdt >= 0 ? '+' : ''}$${unrealizedPnlUsdt.toLocaleString()}`} trend={unrealizedPnlUsdt >= 0 ? 'up' : 'down'} colorClassName={unrealizedPnlUsdt >= 0 ? 'text-emerald-500' : 'text-rose-500'} icon="trending_up" />
        <MetricCard label="Deployed Capital" value={`$${deployedCapital.toLocaleString()}`} icon="hub" colorClassName="text-amber-500" />
        <MetricCard label="Active Agents" value={activeBotsCount.toString()} icon="smart_toy" colorClassName="text-blue-500" />
        <MetricCard label="Open Positions" value={openPositionsCount.toString()} icon="shopping_cart" colorClassName="text-purple-500" />
        <MetricCard label="System Health" value="Optimal" delta="100%" trend="up" icon="speed" colorClassName="text-emerald-500" />
      </section>

      {/* 2. ANALYTICS & GOVERNANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <TechnicalSurface variant="surface" className="h-[450px] p-6 flex flex-col gap-6">
            <Heading size="sm" weight="bold" className="uppercase italic tracking-tighter">Equity_Growth_Analysis</Heading>
            <div className="flex-1 relative bg-slate-950/20 rounded-2xl border border-border-technical/30 overflow-hidden"></div>
          </TechnicalSurface>
        </div>
        <div className="lg:col-span-4 flex flex-col gap-8">
          <TechnicalSurface variant="surface" className="p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <Heading size="xs" weight="bold" className="opacity-60">Fleet_Governance</Heading>
              <StatusPulse variant="energy" size="xs" isAnimated />
            </div>
            <button onClick={() => setIsKillSwitchConfirmOpen(true)} className="w-full bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500 hover:text-white text-rose-500 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">EMERGENCY_KILL_SWITCH</button>
          </TechnicalSurface>
          <RiskMeter title="Capital_Exposure" value={deployedCapital} maxValue={10000} valueLabel={`$${deployedCapital.toLocaleString()}`} maxLabel="/ $10,000" />
        </div>
      </div>

      {/* 3. BOT FLEET GRID (REPAIRED COMMANDS) */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-2">
          <Heading size="sm" weight="bold" className="uppercase italic tracking-tighter opacity-60">Fleet_Operational_Grid</Heading>
          <LpdText size="nano" className="font-mono text-text-muted opacity-40 uppercase tracking-widest">Live_Indexing_Active</LpdText>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map(bot => (
            <BotCardIndustrial 
              key={bot.id} 
              bot={bot} 
              onOpenDetails={(id) => openBotInspector(id)}
              onToggleStatus={(id, status) => handleToggle(id, status)}
              onDelete={(id) => {
                 if (confirm('Issue Emergency Termination?')) {
                   handleToggle(id, 'paused');
                 }
              }}
              onMarketExit={async (id) => {
                toast.show({ tenantId: 'loopdev', title: 'MARKET_EXIT_ISSUED', variant: 'warning', metadata: 'EXEC_MANUAL' });
                await toggleStatus({ id, status: 'paused' });
                queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] });
              }}
              onSetToBE={async (id) => {
                const targetBot = bots.find(b => b.id === id);
                if (!targetBot) return;
                
                const bePrice = targetBot.currentEntryPrice * 1.002;
                
                // NOTA: Usamos snake_case para que el mapeador lo entienda al recuperar de la DB
                await updateBotTargets({ 
                  id, 
                  targets: { 
                    sl_price: bePrice,
                    tp_price: targetBot.exitTargets?.tpPrice || 0,
                    be_price: bePrice 
                  } 
                });

                queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] });
                toast.show({ tenantId: 'loopdev', title: 'STOP_LOSS_ADJUSTED', description: 'Moved to Break-even', variant: 'success', metadata: 'RISK_0' });
              }}
              onExecuteTP={async (id) => {
                toast.show({ tenantId: 'loopdev', title: 'TAKE_PROFIT_TRIGGERED', variant: 'success', metadata: 'WIN_EXIT' });
                await toggleStatus({ id, status: 'paused' });
                queryClient.invalidateQueries({ queryKey: ['trading', 'fleet'] });
              }}
            />
          ))}
        </div>
      </section>

      {/* 4. POSITION LEDGER */}
      <section className="flex flex-col gap-4 mt-8">
        <Heading size="sm" weight="bold" className="uppercase italic tracking-tighter opacity-60">Live_Position_Ledger</Heading>
        <PositionsDataTable data={activePositions as any} onViewDetail={(id) => openBotInspector(id)} />
      </section>

      {/* 5. ACTIVITY LOG */}
      <ActivityStream title="Fleet_Activity_Log" events={activity} isLoading={isActivityLoading} />

      {/* DIALOGS */}
      <TechnicalDialog
        isOpen={isKillSwitchConfirmOpen}
        onClose={() => setIsKillSwitchConfirmOpen(false)}
        title="Confirm_Fleet_Termination"
        description="Global PAUSE command to all active agents."
        variant="danger"
        actions={
          <>
            <Button variant="ghost" onClick={() => setIsKillSwitchConfirmOpen(false)}>Abort</Button>
            <Button variant="danger" onClick={() => {
               bots.forEach(b => handleToggle(b.id, 'paused'));
               setIsKillSwitchConfirmOpen(false);
            }}>Confirm</Button>
          </>
        }
      />
    </main>
  );
}
