'use client';

import React from 'react';
import { 
  LpdText, 
  Heading, 
  TechnicalSurface, 
  Button, 
  Divider, 
  RiskMeter, 
  Input, 
  Icon, 
  Skeleton,
  cn 
} from '@loopdev/ui';
import { useRiskSettings } from '@/hooks/trading/useRiskSettings';

/**
 * @page RiskControlPage
 * @description Master safety hub for the trading engine.
 * Implements Phase 5: Governance & Emergency Protocols.
 */
export default function RiskControlPage() {
  const { settings, isLoading, updateSettings, isUpdating } = useRiskSettings();

  const handleKillSwitch = () => {
    const nextState = !settings?.killSwitchActive;
    if (nextState) {
      if (confirm('ACTIVATE GLOBAL KILL SWITCH? This will stop ALL active loops and close positions if configured.')) {
        updateSettings({ killSwitchActive: true });
      }
    } else {
      updateSettings({ killSwitchActive: false });
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-[1200px] mx-auto space-y-12 animate-pulse">
        <Skeleton className="h-20 w-1/3 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <main className="h-full overflow-y-auto flex flex-col gap-12 p-8 max-w-[1200px] mx-auto animate-in fade-in duration-700 pb-32 custom-scrollbar">
      
      {/* 1. STANDARDIZED HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-rose-500">
            <span className="material-symbols-outlined text-sm font-bold">gavel</span>
            <LpdText size="nano" weight="black" className="uppercase tracking-[0.2em]">Safety_&_Governance_Center</LpdText>
          </div>
          <Heading size="2xl" weight="bold" className="text-text-main tracking-tight uppercase italic">
            Risk_Control<span className="text-rose-500">.</span>
          </Heading>
          <LpdText size="sm" className="text-text-muted max-w-2xl leading-relaxed">
            Configure account-wide protection layers. These parameters override individual bot settings to ensure total capital preservation.
          </LpdText>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. EMERGENCY KILL SWITCH (The Hero Action) */}
        <TechnicalSurface 
          variant="surface" 
          className={cn(
            "lg:col-span-12 p-8 border-2 transition-all flex flex-col md:flex-row items-center justify-between gap-8 rounded-[2.5rem]",
            settings?.killSwitchActive 
              ? "bg-rose-500/10 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.2)]" 
              : "border-border-technical hover:border-rose-500/30"
          )}
        >
          <div className="flex items-center gap-6">
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center border-4",
              settings?.killSwitchActive ? "bg-rose-500 border-rose-400 animate-pulse" : "bg-background-subtle border-border-technical"
            )}>
              <span className={cn(
                "material-symbols-outlined text-4xl",
                settings?.killSwitchActive ? "text-white" : "text-text-muted"
              )}>power_settings_new</span>
            </div>
            <div className="flex flex-col gap-1">
              <Heading size="sm" weight="black" className="uppercase italic">Global_Execution_Kill_Switch</Heading>
              <LpdText size="sm" className="text-text-muted max-w-md">
                Immediately halts all core engine loops. No new trades will be opened and existing orders will be frozen.
              </LpdText>
            </div>
          </div>
          
          <Button 
            variant={settings?.killSwitchActive ? "energy" : "danger"}
            size="lg"
            onClick={handleKillSwitch}
            isLoading={isUpdating}
            className="px-12 py-6 text-xs font-black shadow-2xl uppercase tracking-widest"
          >
            {settings?.killSwitchActive ? 'Resume_All_Loops' : 'Activate_Kill_Switch'}
          </Button>
        </TechnicalSurface>

        {/* 3. ACCOUNT LIMITS & METRICS */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <TechnicalSurface variant="surface" depth="flat" className="p-8 border-border-technical/30 rounded-[2.5rem] flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">analytics</span>
                <Heading size="xs" weight="bold" className="uppercase">Account_Level_Exposure</Heading>
              </div>
              <RiskMeter 
                title="Capital_At_Risk"
                value={1250} // Mock current exposure
                maxValue={settings?.maxTotalExposureUsdt || 5000}
                valueLabel="$1,250"
                maxLabel={`$${settings?.maxTotalExposureUsdt}`}
                subtitle="Live Portfolio Exposure"
              />
            </div>
            
            <Divider thickness="technical" className="opacity-30" />

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-rose-500">trending_down</span>
                <Heading size="xs" weight="bold" className="uppercase">Daily_Drawdown_Guard</Heading>
              </div>
              <RiskMeter 
                title="Today_Loss_Limit"
                value={45} // Mock current loss
                maxValue={settings?.maxDailyLossUsdt || 500}
                valueLabel="$45.20"
                maxLabel={`$${settings?.maxDailyLossUsdt}`}
                subtitle="Reset in 8h 12m"
              />
            </div>
          </TechnicalSurface>
        </div>

        {/* 4. CONFIGURATION PANEL */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <TechnicalSurface variant="surface" depth="raised" className="p-8 border-border-technical/30 rounded-[2.5rem] flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-text-muted">settings_applications</span>
              <Heading size="xs" weight="bold" className="uppercase">Hard_Limit_Config</Heading>
            </div>
            
            <div className="space-y-6">
              <Input 
                label="Max Daily Loss (USDT)" 
                type="number" 
                value={settings?.maxDailyLossUsdt} 
                onChange={(e) => updateSettings({ maxDailyLossUsdt: Number(e.target.value) })}
                helperText="Shutdown engine if realized loss exceeds this value."
              />
              <Input 
                label="Max Total Exposure (USDT)" 
                type="number" 
                value={settings?.maxTotalExposureUsdt} 
                onChange={(e) => updateSettings({ maxTotalExposureUsdt: Number(e.target.value) })}
                helperText="Maximum capital allowed across all active bots."
              />
              <Input 
                label="Max Concurrent Bots" 
                type="number" 
                value={settings?.maxConcurrentBots} 
                onChange={(e) => updateSettings({ maxConcurrentBots: Number(e.target.value) })}
                helperText="Maximum number of bots allowed to run in parallel."
              />
            </div>

            <div className="p-4 bg-background-subtle rounded-xl border border-border-technical/20">
              <LpdText size="nano" className="text-text-muted italic leading-relaxed">
                // System_Note: All changes are applied in real-time to the orquestrator heartbeat.
              </LpdText>
            </div>
          </TechnicalSurface>
        </div>

      </section>

    </main>
  );
}
