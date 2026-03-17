'use client';

import React, { useState } from 'react';
import { LpdText, Heading, TechnicalSurface, Icon, BotCard, BotConfig, Skeleton, BotStatus, Button } from '@loopdev/ui';
import { DeployBotModal } from '../components/DeployBotModal';
import { useBotFleet } from '@/hooks/trading/useBotFleet';

/**
 * @page BotFleetPage
 * @description Operational management of all bot instances.
 * Connected to Quant Core via Supabase.
 */
export default function BotFleetPage() {
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const { bots, isLoading, deployBot, toggleStatus } = useBotFleet();

  const handleToggleStatus = (id: string, current: BotStatus) => {
    const nextStatus: BotStatus = current === 'active' ? 'paused' : 'active';
    toggleStatus({ id, status: nextStatus });
  };

  const handleDeploy = (newBotData: any) => {
    const botPayload = {
      name: newBotData.name,
      pair: newBotData.pair,
      strategyId: newBotData.strategyId,
      baseInvestmentUsdt: newBotData.baseInvestmentUsdt,
      riskProfile: {
        maxDailyLossPct: newBotData.maxDailyLossPct,
        globalStopLossPct: newBotData.globalStopLossPct,
        maxRebuys: newBotData.maxRebuys,
        maxExposureUsdt: newBotData.maxExposureUsdt,
      },
      useInitialRangeFilter: newBotData.useInitialRangeFilter,
      useMarketRegimeFilter: newBotData.useMarketRegimeFilter
    };
    
    deployBot(botPayload as any);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-12 p-8 max-w-[1600px] mx-auto">
        <Skeleton className="h-20 w-1/3 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-[340px] w-full rounded-3xl" />
          <Skeleton className="h-[340px] w-full rounded-3xl" />
          <Skeleton className="h-[340px] w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <main className="h-full overflow-y-auto flex flex-col gap-12 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-32 custom-scrollbar">
      
      <DeployBotModal 
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        onDeploy={handleDeploy}
      />

      {/* 1. STANDARDIZED HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-amber-500">
            <span className="material-symbols-outlined text-sm font-bold">hub</span>
            <LpdText size="nano" weight="black" className="uppercase tracking-[0.2em]">Operational_Fleet_Manager</LpdText>
          </div>
          <Heading size="2xl" weight="bold" className="text-text-main tracking-tight uppercase italic">
            Bot_Fleet_Control<span className="text-amber-500">.</span>
          </Heading>
          <LpdText size="sm" className="text-text-muted max-w-2xl leading-relaxed">
            Monitor, deploy, and scale your algorithmic agents. All instances are synchronized with the Quant Core Engine.
          </LpdText>
        </div>

        <Button 
          variant="energy" 
          onClick={() => setIsDeployModalOpen(true)}
          startIcon="add"
          className="px-8 shadow-xl shadow-amber-500/20"
        >
          Deploy_New_Bot
        </Button>
      </header>

      {/* 2. FLEET GRID */}
      {bots.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {bots.map((bot) => (
            <BotCard 
              key={bot.id} 
              bot={bot} 
              stats={{
                totalProfitPct: 0,
                totalProfitUsdt: 0,
                winRate: 0,
                uptime: '0h 0m'
              }}
              onToggleStatus={() => handleToggleStatus(bot.id, bot.status)}
              onEdit={(id) => console.log('Edit bot', id)}
            />
          ))}
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center p-24 border border-dashed border-border-technical/50 rounded-[2.5rem] bg-background-surface/50 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-500/40 mb-6">
            <Icon name="Bot" size="lg" />
          </div>
          <Heading size="lg" weight="bold" className="text-text-main mb-2">No Bots Deployed</Heading>
          <LpdText size="sm" className="text-text-muted text-center max-w-sm mb-8">
            Your fleet is currently offline. Start by deploying your first trading agent using a certified strategy logic.
          </LpdText>
          <button 
            onClick={() => setIsDeployModalOpen(true)}
            className="bg-amber-500 text-white px-8 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-transform shadow-lg shadow-amber-500/20"
          >
            Deploy_Your_First_Bot
          </button>
        </section>
      )}

    </main>
  );
}
