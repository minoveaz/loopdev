'use client';

import React from 'react';
import { ExchangeAccountCardProps } from './types';
import { TechnicalSurface, LpdText, Heading, Skeleton, StatusPulse, Icon, Button, IconButton } from '../../../atoms';
import { cn } from '../../../../helpers/cn';

/**
 * @component ExchangeAccountCard
 * @description Industrial-grade card for managing exchange connectivity.
 * Implements Section 18 & 22.7 of the Blueprint UX.
 */
export const ExchangeAccountCard: React.FC<ExchangeAccountCardProps> = ({
  account,
  onTestConnection,
  onSettings,
  isLoading = false,
  className
}) => {
  
  if (isLoading) {
    return (
      <TechnicalSurface variant="surface" depth="flat" className={cn("p-6 h-[220px]", className)}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-5 w-32 rounded-lg" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="h-8 flex-1 rounded-lg" />
            <Skeleton className="h-8 w-10 rounded-lg" />
          </div>
        </div>
      </TechnicalSurface>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'emerald';
      case 'warning': return 'amber';
      case 'error': return 'rose';
      default: return 'slate';
    }
  };

  const statusColor = getStatusColor(account.status);

  return (
    <TechnicalSurface 
      variant="surface" 
      depth="flat" 
      className={cn(
        "p-6 flex flex-col justify-between border-border-technical/30 group hover:border-primary/30 transition-all min-h-[240px]",
        className
      )}
    >
      <div className="flex flex-col gap-6">
        {/* HEADER: Provider & Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-background-subtle border border-border-technical flex items-center justify-center text-text-muted">
               <span className="material-symbols-outlined text-xl">
                 {account.provider === 'binance' ? 'currency_exchange' : 'account_balance'}
               </span>
            </div>
            <div className="flex flex-col">
              <Heading size="xs" weight="bold" className="tracking-tight text-text-main">
                {account.name}
              </Heading>
              <div className="flex items-center gap-2">
                <LpdText size="nano" className="uppercase tracking-widest text-text-muted font-black">
                  {account.provider}
                </LpdText>
                <span className="text-text-muted opacity-20">•</span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[8px] font-black uppercase border",
                  account.isPaper ? "bg-blue-500/10 border-blue-500/20 text-blue-600" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                )}>
                  {account.isPaper ? 'Paper_Trading' : 'Live_Trading'}
                </span>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "flex items-center gap-2 px-2 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest",
            account.status === 'healthy' ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600" : 
            account.status === 'warning' ? "bg-amber-500/5 border-amber-500/20 text-amber-600" :
            "bg-rose-500/5 border-rose-500/20 text-rose-600"
          )}>
            <StatusPulse variant={account.status === 'healthy' ? 'online' : 'error'} size="xs" />
            {account.status}
          </div>
        </div>

        {/* DETAILS: API Key & Sync */}
        <div className="flex flex-col gap-3">
          <div className="bg-background-subtle/50 dark:bg-white/5 rounded-xl p-4 border border-border-technical/20 flex flex-col gap-2">
             <div className="flex items-center justify-between">
                <LpdText size="nano" className="uppercase font-black text-text-muted tracking-widest opacity-40">API_Key_Signature</LpdText>
                <LpdText size="nano" className="font-mono text-text-main font-bold">{account.apiKeyMasked}</LpdText>
             </div>
             <div className="flex items-center justify-between">
                <LpdText size="nano" className="uppercase font-black text-text-muted tracking-widest opacity-40">Last_Verified_Sync</LpdText>
                <LpdText size="nano" className="font-mono text-text-muted italic">
                  {account.lastVerifiedAt ? new Date(account.lastVerifiedAt).toLocaleString() : 'never'}
                </LpdText>
             </div>
          </div>

          {account.lastError && (
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-3 flex items-start gap-3">
              <span className="material-symbols-outlined text-rose-500 text-sm font-bold">warning</span>
              <div className="flex flex-col gap-0.5">
                <LpdText size="nano" weight="black" className="text-rose-600 uppercase tracking-widest">Operational_Error</LpdText>
                <LpdText size="nano" className="text-rose-700/80 leading-tight line-clamp-2">{account.lastError}</LpdText>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER: Actions */}
      <div className="flex gap-2 mt-6">
         <Button 
           variant="primary" 
           size="sm"
           fullWidth
           onClick={() => onTestConnection?.(account.id)}
           className="text-[9px] uppercase tracking-widest py-2 h-auto"
         >
            Test_Connection
         </Button>
         <IconButton 
           icon="settings" 
           variant="ghost" 
           size="md"
           onClick={() => onSettings?.(account.id)}
           className="border border-border-technical/50 hover:border-border-technical"
         />
      </div>
    </TechnicalSurface>
  );
};
