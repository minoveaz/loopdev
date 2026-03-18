'use client';

import React, { useState, useEffect } from 'react';
import { 
  TechnicalSurface, 
  LpdText, 
  Heading, 
  Input, 
  Button, 
  IconButton,
  Divider,
  AssetSelector,
  Badge
} from '@loopdev/ui';
import { BotConfig } from '@loopdev/contracts';
import { useAssets } from '@/hooks/trading/useAssets';
import { useStrategies } from '@/hooks/trading/useStrategies';
import { useExchangeVault } from '@/hooks/trading/useExchangeVault';

interface DeployBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (bot: Partial<BotConfig>) => void;
  initialData?: any;
}

/**
 * @component DeployBotModal
 * @description Industrial modal for deploying new trading bot instances with Cross-Exchange validation.
 */
export const DeployBotModal: React.FC<DeployBotModalProps> = ({
  isOpen,
  onClose,
  onDeploy,
  initialData
}) => {
  const { accounts } = useExchangeVault();
  
  const [formData, setFormData] = useState({
    name: '',
    exchangeId: '',
    pair: '',
    strategyId: '',
    baseInvestmentUsdt: 1000,
    maxDailyLossPct: 2,
    globalStopLossPct: 5,
    maxRebuys: 3,
    maxExposureUsdt: 5000,
    useInitialRangeFilter: true,
    useMarketRegimeFilter: true
  });

  // Resolve Selected Provider for Asset Filtering
  const selectedExchange = accounts.find(a => a.id === formData.exchangeId);
  const selectedProvider = selectedExchange?.provider;

  const { data: assets = [], isLoading: isLoadingAssets } = useAssets(selectedProvider);
  const { strategies, isLoading: isLoadingStrategies } = useStrategies();

  // Load initial data for editing
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        name: initialData.name || '',
        exchangeId: initialData.exchangeId || '',
        pair: initialData.pair || '',
        strategyId: initialData.strategyId || '',
        baseInvestmentUsdt: initialData.baseInvestmentUsdt || 1000,
        maxDailyLossPct: initialData.riskProfile?.maxDailyLossPct || 2,
        globalStopLossPct: initialData.riskProfile?.globalStopLossPct || 5,
        maxRebuys: initialData.riskProfile?.maxRebuys || 3,
        maxExposureUsdt: initialData.riskProfile?.maxExposureUsdt || 5000,
        useInitialRangeFilter: initialData.useInitialRangeFilter ?? true,
        useMarketRegimeFilter: initialData.useMarketRegimeFilter ?? true
      });
    }
  }, [initialData, isOpen]);

  // Set default exchange if not set
  useEffect(() => {
    if (accounts.length > 0 && !formData.exchangeId && !initialData) {
      setFormData(prev => ({ ...prev, exchangeId: accounts[0].id }));
    }
  }, [accounts, formData.exchangeId, initialData]);

  // Set default pair when assets change (filtering)
  useEffect(() => {
    if (assets.length > 0) {
      const currentPairValid = assets.some(a => a.symbol === formData.pair);
      if (!currentPairValid) {
        setFormData(prev => ({ ...prev, pair: assets[0].symbol }));
      }
    }
  }, [assets]);

  // Set default strategy
  useEffect(() => {
    if (strategies.length > 0 && !formData.strategyId && !initialData) {
      setFormData(prev => ({ ...prev, strategyId: strategies[0].id }));
    }
  }, [strategies, formData.strategyId, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDeploy(formData as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

      <TechnicalSurface variant="surface" depth="overlay" className="relative z-10 w-full max-w-2xl h-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex flex-col h-full w-full">
          <header className="p-6 border-b border-border-technical/30 flex items-center justify-between bg-background-subtle/30 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                <span className="material-symbols-outlined text-xl font-bold italic">add_task</span>
              </div>
              <div>
                <Heading size="xs" weight="bold" className="uppercase tracking-tight italic">
                  {initialData ? 'Update_Bot_Instance' : 'Deploy_New_Bot_Instance'}
                </Heading>
                <LpdText size="nano" className="text-text-muted uppercase tracking-widest font-mono opacity-60">Quant_Core // Orchestrator</LpdText>
              </div>
            </div>
            <IconButton icon="close" size="sm" onClick={onClose} />
          </header>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar flex flex-col gap-8 min-h-0">
            
            {/* 0. EXCHANGE SELECTION */}
            <div className="flex flex-col gap-6">
              <LpdText size="nano" weight="black" className="text-primary uppercase tracking-[0.2em] opacity-60 px-1">00. Exchange_Nexus</LpdText>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-text-muted px-1">Target_Exchange_Account</label>
                <select 
                  className="w-full h-10 px-3 rounded-lg bg-white dark:bg-[#161E33] border border-border-technical/50 text-sm font-bold text-text-main focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                  value={formData.exchangeId}
                  onChange={(e) => setFormData({...formData, exchangeId: e.target.value})}
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name} ({acc.provider})</option>
                  ))}
                </select>
              </div>
            </div>

            <Divider thickness="technical" className="opacity-50" />

            {/* SECTION 1: Bot Identity */}
            <div className="flex flex-col gap-6">
              <LpdText size="nano" weight="black" className="text-primary uppercase tracking-[0.2em] opacity-60 px-1">01. Bot_Identity</LpdText>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Instance Name" placeholder="e.g. Alpha_01" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                <AssetSelector 
                  label={`Trading Pair (${selectedProvider || 'all'})`}
                  assets={assets}
                  value={formData.pair}
                  onChange={(symbol) => setFormData({...formData, pair: symbol})}
                  isLoading={isLoadingAssets}
                />
              </div>
            </div>

            <Divider thickness="technical" className="opacity-50" />

            {/* SECTION 2: Strategy */}
            <div className="flex flex-col gap-6">
              <LpdText size="nano" weight="black" className="text-primary uppercase tracking-[0.2em] opacity-60 px-1">02. Strategy_Blueprint</LpdText>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-text-muted px-1">Select_Blueprint</label>
                  <select 
                    className="w-full h-10 px-3 rounded-lg bg-white dark:bg-[#161E33] border border-border-technical/50 text-sm font-bold text-text-main focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                    value={formData.strategyId}
                    onChange={(e) => setFormData({...formData, strategyId: e.target.value})}
                    disabled={isLoadingStrategies}
                  >
                    {strategies.length === 0 && <option value="">No strategies available</option>}
                    {strategies.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.mode})</option>
                    ))}
                  </select>
                </div>
                <Input label="Base Investment (USDT)" type="number" value={formData.baseInvestmentUsdt} onChange={(e) => setFormData({...formData, baseInvestmentUsdt: Number(e.target.value)})} required />
              </div>
            </div>

            <Divider thickness="technical" className="opacity-50" />

            {/* SECTION 3: Risk Guard */}
            <div className="flex flex-col gap-6">
              <LpdText size="nano" weight="black" className="text-rose-500 uppercase tracking-[0.2em] opacity-60 px-1">03. Risk_Guard_Parameters</LpdText>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Max Daily Loss %" type="number" step="0.1" value={formData.maxDailyLossPct} onChange={(e) => setFormData({...formData, maxDailyLossPct: Number(e.target.value)})} />
                <Input label="Global Stop Loss %" type="number" step="0.1" value={formData.globalStopLossPct} onChange={(e) => setFormData({...formData, globalStopLossPct: Number(e.target.value)})} />
                <Input label="Max Rebuys" type="number" value={formData.maxRebuys} onChange={(e) => setFormData({...formData, maxRebuys: Number(e.target.value)})} />
                <Input label="Max Exposure (USDT)" type="number" value={formData.maxExposureUsdt} onChange={(e) => setFormData({...formData, maxExposureUsdt: Number(e.target.value)})} />
              </div>
            </div>

          </form>

          <footer className="p-6 border-t border-border-technical/30 flex items-center justify-end gap-4 bg-background-subtle/10 shrink-0">
            <Button variant="outline" onClick={onClose}>Cancel_Action</Button>
            <Button variant="primary" type="submit" onClick={handleSubmit} className="px-12 shadow-xl shadow-primary/20">
              {initialData ? 'Update_Agent' : 'Deploy_Agent'}
            </Button>
          </footer>
        </div>
      </TechnicalSurface>
    </div>
  );
};
