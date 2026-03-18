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
 * @description Industrial-grade control card for trading bot instances.
 * Implements Section 13 & 22.5 of the Blueprint UX.
 */
export const BotCard: React.FC<BotCardProps> = ({
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

        {/* PROMINENT LIVE PRICE (High Visibility) */}
        <div className="flex flex-col gap-1">
          <LpdText size="nano" weight="black" className="uppercase tracking-[0.2em] text-text-muted opacity-40">Live_Market_Price</LpdText>
          <div className="flex items-baseline gap-2">
            <LivePriceLabel pair={bot.pair} size="lg" className="font-black tracking-tighter" />
            <LpdText size="nano" weight="bold" className="text-text-muted opacity-30 font-mono">USDT</LpdText>
          </div>
        </div>

        {/* OPERATIONAL STATE (Live Feed) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <LpdText size="nano" weight="black" className="uppercase tracking-[0.2em] text-primary opacity-60">Operational_State</LpdText>
            {bot.status === 'active' && <StatusPulse variant="energy" size="xs" isAnimated />}
          </div>
          <div className="bg-background-subtle/50 dark:bg-white/5 rounded-xl p-4 border border-border-technical/30 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-sm text-primary">radar</span>
              <LpdText size="xs" weight="bold" className="text-text-main uppercase tracking-tight">
                {liveState?.currentAction || (isActive ? 'Scanning_Market...' : 'Engine_Idle')}
              </LpdText>
            </div>
            
            <Divider thickness="technical" className="opacity-20" />

            {liveState?.openPosition ? (
              <>
                {/* ROW 1: ENTRY SPECS */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <LpdText size="nano" className="text-text-muted uppercase font-bold">Entry_Price</LpdText>
                    <LpdText size="xs" weight="black" className="font-mono text-text-main">${liveState.openPosition.entryPrice.toLocaleString()}</LpdText>
                  </div>
                  <div className="flex flex-col items-end">
                    <LpdText size="nano" className="text-text-muted uppercase font-bold">Capital_Invested</LpdText>
                    <LpdText size="xs" weight="black" className="font-mono text-text-main">${liveState.openPosition.investedUsdt.toLocaleString()}</LpdText>
                  </div>
                </div>

                <Divider thickness="technical" className="opacity-10" />

                {/* ROW 2: LIVE PERFORMANCE */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <LpdText size="nano" className="text-text-muted uppercase font-bold">Unrealized_PnL</LpdText>
                    <LpdText size="xs" weight="black" className={cn(
                      "font-mono",
                      liveState.openPosition.pnlPct >= 0 ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {liveState.openPosition.pnlUsdt >= 0 ? '+' : ''}${liveState.openPosition.pnlUsdt.toLocaleString()}
                    </LpdText>
                  </div>
                  <div className="flex flex-col items-end">
                    <LpdText size="nano" className="text-text-muted uppercase font-bold">Performance</LpdText>
                    <LpdText size="xs" weight="black" className={cn(
                      "font-mono",
                      liveState.openPosition.pnlPct >= 0 ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {liveState.openPosition.pnlPct >= 0 ? '+' : ''}{liveState.openPosition.pnlPct.toFixed(2)}%
                    </LpdText>
                  </div>
                </div>

                <Divider thickness="technical" className="opacity-10" />

                {/* ROW 3: TRADE CLOCK */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <LpdText size="nano" className="text-text-muted uppercase font-bold">Opened_At</LpdText>
                    <LpdText size="xs" weight="bold" className="font-mono text-text-main/80">
                      {liveState.openPosition.openedAt ? new Date(liveState.openPosition.openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </LpdText>
                  </div>
                  <div className="flex flex-col items-end">
                    <LpdText size="nano" className="text-text-muted uppercase font-bold">Duration</LpdText>
                    <LpdText size="xs" weight="black" className="font-mono text-primary">
                      {(() => {
                        if (!liveState.openPosition.openedAt) return '0m';
                        const diff = Math.floor((new Date().getTime() - new Date(liveState.openPosition.openedAt).getTime()) / 60000);
                        const h = Math.floor(diff / 60);
                        const m = diff % 60;
                        return h > 0 ? `${h}h ${m}m` : `${m}m`;
                      })()}
                    </LpdText>
                  </div>
                </div>

                {/* EXIT STRATEGY TARGETS (The "Guardian" visualization) */}
                {liveState.openPosition.exitTargets && (
                  <div className="flex flex-col gap-3 pt-3 border-t border-border-technical/10">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <LpdText size="nano" className="text-rose-500 uppercase font-black">Stop_Loss</LpdText>
                        <LpdText size="xs" weight="black" className="font-mono text-rose-500/80">${liveState.openPosition.exitTargets.slPrice.toLocaleString()}</LpdText>
                      </div>
                      <div className="flex flex-col items-end">
                        <LpdText size="nano" className="text-emerald-500 uppercase font-black">Take_Profit</LpdText>
                        <LpdText size="xs" weight="black" className="font-mono text-emerald-500/80">${liveState.openPosition.exitTargets.tpPrice.toLocaleString()}</LpdText>
                      </div>
                    </div>
                    
                    {/* RISK CORRIDOR PROGRESS BAR */}
                    <div className="relative w-full h-1.5 bg-background-surface rounded-full overflow-hidden border border-border-technical/20">
                      <div 
                        className={cn(
                          "absolute h-full transition-all duration-1000",
                          liveState.openPosition.pnlPct >= 0 ? "bg-emerald-500" : "bg-rose-500"
                        )}
                        style={{ 
                          width: `${Math.min(Math.max(50 + (liveState.openPosition.pnlPct * 10), 5), 95)}%`,
                          left: '0%' 
                        }}
                      ></div>
                      <div className="absolute top-0 bottom-0 w-0.5 bg-white/40 left-1/2 -translate-x-1/2"></div>
                    </div>
                    <div className="flex justify-between">
                      <LpdText size="nano" className="text-text-muted italic">Exit_Guardian_Active</LpdText>
                      <LpdText size="nano" className="text-text-muted font-mono uppercase">Proximity_Audit</LpdText>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2 opacity-30 italic py-1">
                <span className="material-symbols-outlined text-xs">info</span>
                <LpdText size="nano" className="uppercase font-bold tracking-widest">No_Active_Position</LpdText>
              </div>
            )}
          </div>
        </div>

        {/* METRICS GRID - ONLY SHOW WHEN IDLE */}
        {!liveState?.openPosition && (
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
        )}

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
           
           <TechnicalDropdown
             align="end"
             open={isMenuOpen}
             onOpenChange={setIsMenuOpen}
             trigger={
               <IconButton 
                 icon="more_vert" 
                 variant="ghost" 
                 size="md"
                 className="border border-border-technical/50 hover:bg-background-subtle rounded-xl transition-all"
               />
             }
           >
              <div className="bg-white dark:bg-surface-elevated w-48 flex flex-col py-1">
                <TechnicalMenuItem 
                  label="Edit Configuration" 
                  icon="settings" 
                  onClick={() => onEdit?.(bot.id)} 
                />
                <div className="h-px bg-border-technical my-1" />
                <TechnicalMenuItem 
                  label="Delete Bot Instance" 
                  icon="delete" 
                  isDanger
                  onClick={() => onDelete?.(bot.id)} 
                />
              </div>
           </TechnicalDropdown>
        </div>

        {/* LOGIC AUDIT SNAPSHOT (Moved to bottom as subtle heartbeat) */}
        {liveState?.logicSnapshot && Object.keys(liveState.logicSnapshot).length > 0 && (
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border-technical/10">
            <div className="flex items-center justify-between">
              <LpdText size="nano" weight="black" className="uppercase tracking-[0.2em] text-text-muted opacity-40">Strategy_Heartbeat</LpdText>
              <LpdText size="nano" className="text-primary font-mono opacity-60">LIVE_DATA</LpdText>
            </div>
            <div className="grid grid-cols-3 gap-2 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
              {Object.entries(liveState.logicSnapshot).filter(([key]) => key !== 'sma20').map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <LpdText size="nano" className="text-text-muted uppercase font-bold text-[7px]">{key}</LpdText>
                  <LpdText size="nano" weight="black" className="font-mono text-text-main text-[9px]">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </LpdText>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </TechnicalSurface>
  );
};
