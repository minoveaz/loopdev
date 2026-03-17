'use client';

import React, { useState } from 'react';
import { StrategyCardProps } from './types';
import { 
  TechnicalSurface, 
  LpdText, 
  Heading, 
  Skeleton, 
  Badge, 
  StatusPulse,
  Button,
  IconButton,
  Divider,
  TechnicalDropdown,
  TechnicalMenuItem
} from '../../../atoms';
import { cn } from '../../../../helpers/cn';

/**
 * @component StrategyCard
 * @description Industrial visualization for trading protocols.
 * Promoted to Design System for cross-suite consistency.
 */
export const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  performance,
  onActivate,
  onPause,
  onBacktest,
  onClone,
  onEdit,
  onDelete,
  isLoading = false,
  className
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  if (isLoading) {
    return (
      <TechnicalSurface variant="surface" depth="flat" className={cn("p-6 h-[320px]", className)}>
        <div className="flex flex-col gap-4 animate-pulse">
          <Skeleton className="h-6 w-1/2 rounded-md" />
          <Skeleton className="h-4 w-1/3 rounded-md" />
          <Divider />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
          <Skeleton className="h-10 mt-auto rounded-xl" />
        </div>
      </TechnicalSurface>
    );
  }

  const isActive = strategy.status === 'active';
  const isDraft = strategy.status === 'draft';

  return (
    <TechnicalSurface 
      variant="surface" 
      depth="flat" 
      className={cn(
        "p-6 flex flex-col justify-between border-border-technical/30 group hover:border-primary/30 transition-all min-h-[340px] relative overflow-hidden",
        className
      )}
    >
      {/* BACKGROUND DECORATOR */}
      <div className={cn(
        "absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-10 transition-colors",
        isActive ? "bg-emerald-500" : isDraft ? "bg-amber-500" : "bg-primary"
      )} />

      <div className="relative z-10 flex flex-col gap-5">
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={cn(
                "w-2 h-2 rounded-full",
                isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500"
              )} />
              <Heading size="xs" weight="black" className="uppercase tracking-tight truncate max-w-[180px]">
                {strategy.name}
              </Heading>
            </div>
            <LpdText size="nano" className="font-mono text-text-muted uppercase tracking-[0.2em]">
              Mode // {strategy.mode}
            </LpdText>
          </div>
          <Badge variant={isActive ? 'success' : isDraft ? 'warning' : 'outline'} size="sm" className="uppercase font-black text-[8px]">
            {strategy.status}
          </Badge>
        </div>

        {/* ASSET PILLS */}
        <div className="flex flex-wrap gap-1.5">
          {strategy.pairs.slice(0, 3).map(pair => (
            <span key={pair} className="px-2 py-0.5 rounded-md bg-background-subtle border border-border-technical/20 text-[9px] font-bold font-mono text-text-muted italic">
              {pair}
            </span>
          ))}
          {strategy.pairs.length > 3 && (
            <span className="text-[9px] font-black text-text-muted opacity-40">+{strategy.pairs.length - 3}</span>
          )}
        </div>

        <Divider thickness="technical" className="opacity-30" />

        {/* PERFORMANCE GRID */}
        <div className="grid grid-cols-2 gap-3">
           <div className="bg-background-subtle/50 dark:bg-white/5 rounded-xl p-3 border border-border-technical/20">
              <p className="text-[8px] uppercase font-black text-text-muted mb-1 tracking-widest opacity-50">Win_Rate</p>
              <p className="text-sm font-black font-mono text-text-main">{performance?.winRate || '0.0'}%</p>
           </div>
           <div className="bg-background-subtle/50 dark:bg-white/5 rounded-xl p-3 border border-border-technical/20">
              <p className="text-[8px] uppercase font-black text-text-muted mb-1 tracking-widest opacity-50">T_Return</p>
              <p className={cn(
                "text-sm font-black font-mono",
                (performance?.totalReturn || 0) >= 0 ? "text-emerald-500" : "text-rose-500"
              )}>
                {(performance?.totalReturn || 0) >= 0 ? '+' : ''}{performance?.totalReturn || '0.0'}%
              </p>
           </div>
        </div>
      </div>

      {/* OPERATIONAL FOOTER */}
      <div className="relative z-10 flex gap-2 mt-6 pt-4 border-t border-border-technical/10">
         <Button 
           variant={isActive ? "outline" : "energy"} 
           size="sm"
           fullWidth
           onClick={() => isActive ? onPause?.(strategy.id!) : onActivate?.(strategy.id!)}
           className="text-[9px] font-black uppercase tracking-widest"
         >
            {isActive ? 'Pause_Protocol' : 'Deploy_Active'}
         </Button>
         <IconButton 
           icon="analytics" 
           variant="primary" 
           size="md"
           onClick={() => onBacktest?.(strategy.id!)}
           className="shadow-lg shadow-primary/10"
         />
         
         <TechnicalDropdown
           align="end"
           open={isMenuOpen}
           onOpenChange={setIsMenuOpen}
           trigger={
             <IconButton 
               icon="more_vert" 
               variant="ghost" 
               size="md"
               className="border border-border-technical/30"
             />
           }
         >
            <div className="bg-white dark:bg-surface-elevated w-48 flex flex-col py-1">
              <TechnicalMenuItem 
                label="Edit Configuration" 
                icon="edit" 
                onClick={() => onEdit?.(strategy.id!)} 
              />
              <TechnicalMenuItem 
                label="Clone Strategy" 
                icon="content_copy" 
                onClick={() => onClone?.(strategy.id!)} 
              />
              <div className="h-px bg-border-technical my-1" />
              <TechnicalMenuItem 
                label="Delete Protocol" 
                icon="delete" 
                isDanger
                onClick={() => onDelete?.(strategy.id!)} 
              />
            </div>
         </TechnicalDropdown>
      </div>
    </TechnicalSurface>
  );
};
