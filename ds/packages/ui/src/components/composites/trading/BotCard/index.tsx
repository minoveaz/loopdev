'use client';

import React from 'react';
import { BotCardProps } from './types';
import { TechnicalSurface, LpdText, Heading, Skeleton, Icon, LivePriceLabel } from '../../../atoms';
import { cn } from '../../../../helpers/cn';

/**
 * @component BotCard
 * @description Industrial-grade control card for trading bot instances.
 * Implements Section 13 & 22.5 of the Blueprint UX.
 */
export const BotCard: React.FC<BotCardProps> = ({
  bot,
  stats,
  onToggleStatus,
  onEdit,
  isLoading = false,
  className
}) => {
  
  if (isLoading) {
    return (
      <TechnicalSurface variant="surface" depth="flat" className={cn("p-8 h-[340px]", className)}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-32 rounded-lg" />
              <Skeleton className="h-3 w-20 rounded-md" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </TechnicalSurface>
    );
  }

  const isActive = bot.status === 'active';
  const isPaper = bot.status === 'paper_trading';
  const isEmergency = bot.status === 'emergency_stop';

  return (
    <TechnicalSurface 
      variant="surface" 
      depth="flat" 
      className={cn(
        "p-8 flex flex-col justify-between h-full border-border-technical/30 group hover:border-amber-500/30 transition-all relative overflow-hidden",
        className
      )}
    >
      {/* 1. STATUS DECORATOR (Background Aura) */}
      <div className={cn(
        "absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl transition-colors",
        isActive ? "bg-emerald-500/5 group-hover:bg-emerald-500/10" : "bg-amber-500/5 group-hover:bg-amber-500/10"
      )}></div>

      <div className="relative z-10 flex flex-col gap-8">
        
        {/* HEADER: Identity & PnL Snapshot */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl border flex items-center justify-center transition-colors shadow-sm",
              isActive 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" 
                : "bg-background-subtle border-border-technical text-text-muted"
            )}>
               <span className="material-symbols-outlined text-2xl font-bold italic">
                 {isPaper ? 'science' : 'smart_toy'}
               </span>
            </div>
            <div className="flex flex-col">
              <Heading size="xs" weight="bold" className="tracking-tight text-text-main truncate max-w-[180px]">
                {bot.name}
              </Heading>
              <div className="flex items-center gap-2">
                <LpdText size="nano" className="font-mono text-text-muted uppercase tracking-widest">{bot.pair}</LpdText>
                <span className="text-text-muted opacity-20">•</span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[8px] font-black uppercase border",
                  isActive ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" :
                  isEmergency ? "bg-rose-500/10 border-rose-500/20 text-rose-600" :
                  "bg-background-subtle border-border-technical text-text-muted"
                )}>
                  {bot.status}
                </span>
              </div>
              <LivePriceLabel pair={bot.pair} size="xs" className="mt-1" />
            </div>
          </div>

          {stats && (
            <div className="flex flex-col items-end">
              <span className={cn(
                "text-2xl font-black tracking-tighter font-mono",
                stats.totalProfitPct >= 0 ? "text-emerald-500" : "text-rose-500"
              )}>
                {stats.totalProfitPct >= 0 ? '+' : ''}{stats.totalProfitPct}%
              </span>
              <LpdText size="nano" className="text-text-muted uppercase font-bold opacity-40">PnL_Total</LpdText>
            </div>
          )}
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 gap-3">
           <div className="bg-background-subtle/50 dark:bg-white/5 rounded-xl p-3 border border-border-technical/30">
              <p className="text-[9px] uppercase font-black text-text-muted mb-1 tracking-widest">Win_Rate</p>
              <p className="text-sm font-bold font-mono text-text-main">{stats?.winRate || '0.0'}%</p>
           </div>
           <div className="bg-background-subtle/50 dark:bg-white/5 rounded-xl p-3 border border-border-technical/30">
              <p className="text-[9px] uppercase font-black text-text-muted mb-1 tracking-widest">Uptime</p>
              <p className="text-sm font-bold font-mono text-text-main truncate">{stats?.uptime || '0h 0m'}</p>
           </div>
        </div>

        {/* QUICK CONTROLS */}
        <div className="flex gap-3 mt-2">
           <button 
             onClick={() => onToggleStatus?.(bot.id, bot.status)}
             className={cn(
               "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg",
               isActive 
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20" 
                : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
             )}
           >
              {isActive ? 'Pause_Execution' : 'Activate_Bot'}
           </button>
           <button 
             onClick={() => onEdit?.(bot.id)}
             className="px-4 border border-border-technical/50 hover:bg-background-subtle rounded-xl transition-all text-text-muted hover:text-text-main"
           >
              <span className="material-symbols-outlined text-sm font-bold">settings</span>
           </button>
        </div>
      </div>
    </TechnicalSurface>
  );
};
