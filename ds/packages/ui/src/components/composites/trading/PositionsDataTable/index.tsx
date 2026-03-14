'use client';

import React from 'react';
import { PositionsDataTableProps } from './types';
import { TechnicalSurface, LpdText, Skeleton } from '../../../atoms';
import { cn } from '../../../../helpers/cn';

/**
 * @component PositionsDataTable
 * @description Official LoopDev composite for real-time position monitoring.
 * Implements Section 11 & 22.3 of the Blueprint UX.
 */
export const PositionsDataTable: React.FC<PositionsDataTableProps> = ({
  data,
  onViewDetail,
  onClosePosition,
  isLoading = false,
  className
}) => {
  
  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <TechnicalSurface 
      variant="surface" 
      depth="flat" 
      className={cn("overflow-hidden border-border-technical/30 shadow-sm rounded-3xl", className)}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-background-subtle/50 dark:bg-white/5 border-b border-border-technical/30 text-[10px] uppercase font-black tracking-widest text-text-muted">
            <tr>
              <th className="px-6 py-4">Pair_Identity</th>
              <th className="px-6 py-4">Strategy</th>
              <th className="px-6 py-4">Entry / Current</th>
              <th className="px-6 py-4">Quantity / Value</th>
              <th className="px-6 py-4">PnL_Realtime</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-technical/10">
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center opacity-30 italic">
                  <LpdText size="sm">// no_active_positions_in_context</LpdText>
                </td>
              </tr>
            ) : (
              data.map((pos) => {
                const isPositive = typeof pos.pnlPct === 'string' ? pos.pnlPct.startsWith('+') : pos.pnlPct >= 0;
                
                return (
                  <tr key={pos.id} className="group hover:bg-background-subtle/30 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          pos.side === 'LONG' ? 'bg-emerald-500' : 'bg-rose-500'
                        )}></div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold tracking-tight text-text-main">{pos.pair}</span>
                          <span className="text-[9px] font-black opacity-40 uppercase tracking-widest">{pos.side}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-5">
                      <span className="px-2 py-1 rounded-lg bg-background-subtle border border-border-technical/50 text-[10px] font-mono font-bold italic text-text-muted">
                        {pos.strategy}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-col font-mono text-[10px]">
                        <span className="text-text-muted">In: {pos.entryPrice}</span>
                        <span className="text-xs font-bold text-text-main">{pos.currentPrice}</span>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-technical">
                      <div className="flex flex-col font-mono">
                        <span className="font-bold text-text-main">{pos.quantity}</span>
                        <span className="opacity-40 text-[9px]">${pos.valueUsdt}</span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className={cn(
                          "text-sm font-black tracking-tighter",
                          isPositive ? 'text-emerald-500' : 'text-rose-500'
                        )}>
                          {pos.pnlPct}%
                        </span>
                        <span className="text-[10px] font-mono opacity-40">
                          {isPositive ? '+' : ''}{pos.pnlUsdt} USDT
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => onViewDetail?.(pos.id)}
                          className="p-2 rounded-xl hover:bg-background-surface dark:hover:bg-white/10 border border-transparent hover:border-border-technical transition-all"
                        >
                          <span className="material-symbols-outlined text-lg opacity-40 group-hover:opacity-100 transition-opacity">monitoring</span>
                        </button>
                        <button 
                          onClick={() => onClosePosition?.(pos.id)}
                          className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[9px] font-black uppercase tracking-widest transition-all"
                        >
                          Close
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </TechnicalSurface>
  );
};
