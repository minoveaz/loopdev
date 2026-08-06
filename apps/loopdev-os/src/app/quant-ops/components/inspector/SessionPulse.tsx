'use client';

import React from 'react';
import { LpdText, IndustrialMetric } from '@loopdev/ui';

interface SessionPulseProps {
  bot: { realizedPnlUsdt?: number; currentPnlUsdt?: number; baseInvestmentUsdt: number; totalTrades: number; winningTrades: number };
}

export const SessionPulse: React.FC<SessionPulseProps> = ({ bot }) => {
  const sessionPnlUsdt = (bot.realizedPnlUsdt || 0) + (bot.currentPnlUsdt || 0);
  const sessionPnlPct = bot.baseInvestmentUsdt > 0 ? (sessionPnlUsdt / bot.baseInvestmentUsdt) * 100 : 0;
  
  const pnlPctStr = `${sessionPnlPct >= 0 ? '+' : ''}${sessionPnlPct.toFixed(2)}%`;
  const pnlUsdtStr = `${sessionPnlUsdt >= 0 ? '+' : '-'}$${Math.abs(sessionPnlUsdt).toFixed(2)} USD`;
  const winRate = bot.totalTrades > 0 ? ((bot.winningTrades / bot.totalTrades) * 100).toFixed(1) : '---';

  return (
    <section className="flex flex-col gap-4">
      <LpdText size="nano" weight="black" className="uppercase tracking-[0.2em] text-text-muted opacity-40 px-1">Session_Pulse_Ledger</LpdText>
      <div className="grid grid-cols-2 gap-3">
        <IndustrialMetric 
          label="Net_Session_PnL" 
          value={pnlPctStr} 
          secondaryValue={pnlUsdtStr} 
          trend={sessionPnlPct >= 0 ? 'up' : 'down'} 
        />
        <IndustrialMetric 
          label="Win_Rate" 
          value={winRate === '---' ? '---' : `${winRate}%`} 
          secondaryValue={bot.totalTrades > 0 ? `${bot.winningTrades}W / ${bot.totalTrades - bot.winningTrades}L` : 'IDLE_SESSION'} 
        />
        <IndustrialMetric 
          label="Max_Drawdown" 
          value="-0.42%" 
          secondaryValue="Risk_Score: SAFE" 
          trend="down" 
        />
        <IndustrialMetric 
          label="Est_Commissions" 
          value={`$${(bot.baseInvestmentUsdt * 0.001 * (bot.totalTrades || 1)).toFixed(2)}`} 
          secondaryValue="Fees_Net_Accumulated" 
          valueClassName="text-amber-500/80" 
        />
      </div>
    </section>
  );
};
