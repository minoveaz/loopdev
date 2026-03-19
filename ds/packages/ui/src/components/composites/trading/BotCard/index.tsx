'use client';

import React, { useState } from 'react';
import { BotCardProps } from './types';
import { 
  TechnicalSurface, 
  LpdText, 
  Heading, 
  Skeleton, 
  Icon, 
  LivePriceLabel, 
  StatusPulse, 
  Divider,
  TechnicalDropdown,
  TechnicalMenuItem,
  IconButton
} from '../../../atoms';
import { cn } from '../../../../helpers/cn';

/**
 * @component BotCard
 * @description Industrial-grade control card for trading bot instances with Institutional Analytics.
 */
export const BotCardIndustrial: React.FC<BotCardProps> = ({
  bot,
  stats,
  liveState,
  onToggleStatus,
  onEdit,
  onDelete,
  isLoading = false,
  className
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  if (isLoading) {
    return (
      <TechnicalSurface variant="surface" depth="flat" className={cn("p-8 h-[340px]", className)}>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </TechnicalSurface>
    );
  }

  const isActive = bot.status === 'active';

  return (
    <TechnicalSurface 
      variant="surface" 
      depth="flat" 
      className={cn("p-8 flex flex-col justify-between h-full border-border-technical/30 group hover:border-amber-500/30 transition-all relative overflow-hidden", className)}
    >
      <div className="relative z-10 flex flex-col gap-6">
        
        {/* HEADER: Identity, Status & Sentiment */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-2xl border flex items-center justify-center transition-colors shadow-sm", isActive ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-background-subtle border-border-technical text-text-muted")}>
               <span className="material-symbols-outlined text-2xl font-bold">smart_toy</span>
            </div>
            <div className="flex flex-col">
              <Heading size="xs" weight="bold" className="text-text-main">{bot.name}</Heading>
              <div className="flex items-center gap-2 mt-1">
                <LpdText size="nano" className="font-mono text-text-muted uppercase tracking-widest">{bot.pair}</LpdText>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[8px] font-black uppercase border",
                  bot.macroSentiment === 'bullish' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                  bot.macroSentiment === 'bearish' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : 
                  "bg-slate-500/10 text-slate-400 border-slate-500/20"
                )}>
                  {bot.macroSentiment || 'neutral'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SPARKLINE */}
        {bot.priceHistory && bot.priceHistory.length > 5 && (
          <div className="h-12 w-full opacity-40">
            <svg viewBox={`0 0 ${bot.priceHistory.length - 1} 100`} className="w-full h-full" preserveAspectRatio="none">
              <path
                d={`M ${bot.priceHistory.map((p: number, i: number) => `${i},${100 - ((p - Math.min(...bot.priceHistory)) / (Math.max(...bot.priceHistory) - Math.min(...bot.priceHistory)) * 80 + 10)}`).join(' L ')}`}
                fill="none"
                stroke={bot.priceHistory[bot.priceHistory.length-1] >= bot.priceHistory[0] ? "#10b981" : "#f43f5e"}
                strokeWidth="2"
              />
            </svg>
          </div>
        )}

        {/* PRICE */}
        <div className="flex flex-col">
          <LpdText size="nano" className="uppercase tracking-[0.2em] text-text-muted opacity-40">Live_Market_Price</LpdText>
          <div className="flex items-baseline gap-2">
            <LivePriceLabel pair={bot.pair} size="lg" className="font-black" />
            <LpdText size="nano" className="text-text-muted opacity-30 font-mono">USDT</LpdText>
          </div>
        </div>

        {/* OPERATIONAL STATE */}
        <div className="bg-background-subtle/50 rounded-xl p-4 border border-border-technical/30 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xs text-primary">radar</span>
            <LpdText size="xs" weight="bold" className="uppercase">{liveState?.currentAction || 'Awaiting Signal'}</LpdText>
          </div>
          
          {liveState?.openPosition && (
            <>
              <Divider className="opacity-20" />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col"><LpdText size="nano" className="text-text-muted uppercase font-bold">Entry_Price</LpdText><LpdText size="xs" weight="black">${liveState.openPosition.entryPrice.toLocaleString()}</LpdText></div>
                <div className="flex flex-col items-end"><LpdText size="nano" className="text-text-muted uppercase font-bold">Capital</LpdText><LpdText size="xs" weight="black">${liveState.openPosition.investedUsdt.toLocaleString()}</LpdText></div>
                <div className="flex flex-col"><LpdText size="nano" className="text-text-muted uppercase font-bold">Unrealized_PnL</LpdText><LpdText size="xs" weight="black" className={liveState.openPosition.pnlPct >= 0 ? "text-emerald-500" : "text-rose-500"}>${liveState.openPosition.pnlUsdt.toLocaleString()}</LpdText></div>
                <div className="flex flex-col items-end"><LpdText size="nano" className="text-text-muted uppercase font-bold">Performance</LpdText><LpdText size="xs" weight="black" className={liveState.openPosition.pnlPct >= 0 ? "text-emerald-500" : "text-rose-500"}>{liveState.openPosition.pnlPct.toFixed(2)}%</LpdText></div>
              </div>
              <div className="flex justify-between mt-2">
                <LpdText size="nano" className="text-text-muted italic">Duration: {(() => {
                  if (!liveState.openPosition.openedAt) return '0m';
                  const diff = Math.floor((new Date().getTime() - new Date(liveState.openPosition.openedAt).getTime()) / 60000);
                  const h = Math.floor(diff / 60);
                  const m = diff % 60;
                  return h > 0 ? `${h}h ${m}m` : `${m}m`;
                })()}</LpdText>
              </div>
            </>
          )}
        </div>

        {/* HEARTBEAT */}
        {liveState?.logicSnapshot && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border-technical/10 opacity-50">
             {Object.entries(liveState.logicSnapshot).slice(0,3).map(([k,v]) => (
               <div key={k} className="flex flex-col"><LpdText size="nano" className="uppercase text-[7px]">{k}</LpdText><LpdText size="nano" weight="black" className="font-mono">{v}</LpdText></div>
             ))}
          </div>
        )}

      </div>
    </TechnicalSurface>
  );
};
