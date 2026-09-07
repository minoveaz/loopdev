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
  Badge,
  cn
} from '@loopdev/ui';
import { BotConfig, RiskProfile } from '@loopdev/contracts';
import { useAssets } from '@/hooks/trading/useAssets';
import { useStrategies } from '@/hooks/trading/useStrategies';
import { useExchangeVault } from '@/hooks/trading/useExchangeVault';

interface DeployFormData {
  name: string;
  exchangeId: string;
  pair: string;
  strategyId: string;
  baseInvestmentUsdt: number;
  maxDailyLossPct: number;
  globalStopLossPct: number;
  maxRebuys: number;
  maxExposureUsdt: number;
  useInitialRangeFilter: boolean;
  useMarketRegimeFilter: boolean;
}

type InitialBotData = Partial<DeployFormData> & { riskProfile?: Partial<RiskProfile> };

interface DeployBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (bot: Partial<BotConfig>) => void;
  initialData?: InitialBotData;
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
  const { accounts, fetchBalance } = useExchangeVault();
  const [availableBalance, setAvailableBalance] = useState<number | null>(null);
  const [, setIsFetchingBalance] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  
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

  // Fetch Balance when exchange changes
  useEffect(() => {
    if (!formData.exchangeId || initialData || !isOpen) return;
    
    const getBalance = async () => {
      setIsFetchingBalance(true);
      try {
        const result = await fetchBalance(formData.exchangeId);
        if (result.success) {
          setAvailableBalance(result.available_trading_usdt);
        } else {
          setAvailableBalance(0);
        }
      } catch (err) {
        console.error('Failed to fetch real balance:', err);
        setAvailableBalance(0);
      } finally {
        setIsFetchingBalance(false);
      }
    };
    getBalance();
  }, [formData.exchangeId, initialData, isOpen, fetchBalance]);

  // 1. AUTO-FILL LOGIC: Adjust risk parameters based on trading style
  useEffect(() => {
    // Only auto-fill for new bots, not when editing
    if (initialData || !formData.strategyId || strategies.length === 0) return;

    const selectedStrat = strategies.find(s => s.id === formData.strategyId);
    if (!selectedStrat) return;

    if (selectedStrat.tradingStyle === 'SCALPING') {
      setFormData(prev => ({
        ...prev,
        maxDailyLossPct: 1.5,
        globalStopLossPct: 1.0,
        maxRebuys: 2,
        maxExposureUsdt: 2000
      }));
    } else if (selectedStrat.tradingStyle === 'DAY_TRADING') {
      setFormData(prev => ({
        ...prev,
        maxDailyLossPct: 3.5,
        globalStopLossPct: 5.0,
        maxRebuys: 3,
        maxExposureUsdt: 5000
      }));
    }
  }, [formData.strategyId, strategies, initialData]);

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
  }, [assets, formData.pair]);

  // Set default strategy
  useEffect(() => {
    if (strategies.length > 0 && !formData.strategyId && !initialData) {
      setFormData(prev => ({ ...prev, strategyId: strategies[0].id }));
    }
  }, [strategies, formData.strategyId, initialData]);

  if (!isOpen) return null;

  const isBalanceInsufficient = availableBalance !== null && formData.baseInvestmentUsdt > availableBalance;
  const isFormValid = formData.name && formData.exchangeId && formData.pair && formData.strategyId && formData.baseInvestmentUsdt > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isBalanceInsufficient || isDeploying) return;

    setIsDeploying(true);
    
    // Simulate industrial initialization lag for positive friction
    await new Promise(r => setTimeout(r, 1200));
    
    onDeploy({
      name: formData.name,
      exchangeId: formData.exchangeId,
      pair: formData.pair,
      strategyId: formData.strategyId,
      baseInvestmentUsdt: formData.baseInvestmentUsdt,
      riskProfile: {
        maxDailyLossPct: formData.maxDailyLossPct,
        globalStopLossPct: formData.globalStopLossPct,
        maxRebuys: formData.maxRebuys,
        maxExposureUsdt: formData.maxExposureUsdt,
        cooldownPeriodMinutes: 60,
      },
      useInitialRangeFilter: formData.useInitialRangeFilter,
      useMarketRegimeFilter: formData.useMarketRegimeFilter,
    });
    setIsDeploying(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8">
      <div className="bg-background-canvas/60 animate-in fade-in absolute inset-0 backdrop-blur-sm duration-300" onClick={onClose} />

      <TechnicalSurface variant="surface" depth="overlay" className="animate-in zoom-in-95 relative z-10 flex h-full max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden shadow-2xl duration-300">
        <div className="flex h-full w-full flex-col">
          <header className="border-border-technical/30 bg-background-subtle/30 flex shrink-0 items-center justify-between border-b p-6">
            <div className="flex items-center gap-3">
              <div className="bg-energy-yellow/10 text-energy-yellow border-energy-yellow/20 flex h-10 w-10 items-center justify-center rounded-xl border">
                <span className="material-symbols-outlined text-xl font-bold italic">add_task</span>
              </div>
              <div>
                <Heading size="xs" weight="bold" className="uppercase italic tracking-tight">
                  {initialData ? 'Update_Bot_Instance' : 'Deploy_New_Bot_Instance'}
                </Heading>
                <LpdText size="nano" className="text-text-muted font-mono uppercase tracking-widest opacity-60">Quant_Core // Orchestrator</LpdText>
              </div>
            </div>
            <IconButton icon="close" size="sm" onClick={onClose} />
          </header>

          <form onSubmit={handleSubmit} className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto p-8">
            
            {/* 0. EXCHANGE SELECTION */}
            <div className="flex flex-col gap-6">
              <LpdText size="nano" weight="black" className="text-primary px-1 uppercase tracking-[0.2em] opacity-60">00. Exchange_Nexus</LpdText>
              <div className="flex flex-col gap-2">
                <label className="text-text-muted px-1 text-[10px] font-black uppercase tracking-widest">Target_Exchange_Account</label>
                <select 
                  className="dark:bg-lpd-bg-dark border-border-technical/50 text-text-main focus:border-primary h-10 w-full cursor-pointer appearance-none rounded-lg border bg-white px-3 text-sm font-bold outline-none transition-all"
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
              <LpdText size="nano" weight="black" className="text-primary px-1 uppercase tracking-[0.2em] opacity-60">01. Bot_Identity</LpdText>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
              <div className="flex items-center justify-between px-1">
                <LpdText size="nano" weight="black" className="text-primary uppercase tracking-[0.2em] opacity-60">02. Strategy_Blueprint</LpdText>
                
                {/* TRADING STYLE BADGE */}
                {formData.strategyId && strategies.find(s => s.id === formData.strategyId)?.tradingStyle && (
                  <Badge variant="outline" className={cn(
                    "border-primary/20 text-[8px] font-black tracking-[0.2em]",
                    strategies.find(s => s.id === formData.strategyId)?.tradingStyle === 'SCALPING' ? "text-amber-500 border-amber-500/20" : "text-primary"
                  )}>
                    {strategies.find(s => s.id === formData.strategyId)?.tradingStyle}_MODE
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-text-muted px-1 text-[10px] font-black uppercase tracking-widest">Select_Blueprint</label>
                  <select 
                    className="dark:bg-lpd-bg-dark border-border-technical/50 text-text-main focus:border-primary h-10 w-full cursor-pointer appearance-none rounded-lg border bg-white px-3 text-sm font-bold outline-none transition-all"
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
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-text-muted text-[10px] font-black uppercase tracking-widest">Base_Investment (USDT)</label>
                    {availableBalance !== null && (
                      <LpdText size="nano" className={cn(
                        "font-mono italic",
                        formData.baseInvestmentUsdt > availableBalance ? "text-rose-500 animate-pulse" : "text-emerald-500/60"
                      )}>
                        Available: ${availableBalance.toLocaleString()}
                      </LpdText>
                    )}
                  </div>
                  <Input 
                    type="number" 
                    value={formData.baseInvestmentUsdt} 
                    onChange={(e) => setFormData({...formData, baseInvestmentUsdt: Number(e.target.value)})} 
                    required 
                  />
                </div>
              </div>
            </div>

            <Divider thickness="technical" className="opacity-50" />

            {/* SECTION 3: Risk Guard */}
            <div className="flex flex-col gap-6">
              <LpdText size="nano" weight="black" className="px-1 uppercase tracking-[0.2em] text-rose-500 opacity-60">03. Risk_Guard_Parameters</LpdText>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Input label="Max Daily Loss %" type="number" step="0.1" value={formData.maxDailyLossPct} onChange={(e) => setFormData({...formData, maxDailyLossPct: Number(e.target.value)})} />
                  <LpdText size="nano" className="text-text-muted px-1 font-mono italic opacity-40">
                    Est. Risk: -${((formData.baseInvestmentUsdt * formData.maxDailyLossPct) / 100).toFixed(2)} USDT
                  </LpdText>
                </div>
                <div className="flex flex-col gap-2">
                  <Input label="Global Stop Loss %" type="number" step="0.1" value={formData.globalStopLossPct} onChange={(e) => setFormData({...formData, globalStopLossPct: Number(e.target.value)})} />
                  <LpdText size="nano" className="text-text-muted px-1 font-mono italic opacity-40">
                    Est. Protection: -${((formData.baseInvestmentUsdt * formData.globalStopLossPct) / 100).toFixed(2)} USDT
                  </LpdText>
                </div>
                <Input label="Max Rebuys" type="number" value={formData.maxRebuys} onChange={(e) => setFormData({...formData, maxRebuys: Number(e.target.value)})} />
                <Input label="Max Exposure (USDT)" type="number" value={formData.maxExposureUsdt} onChange={(e) => setFormData({...formData, maxExposureUsdt: Number(e.target.value)})} />
              </div>
            </div>

          </form>

          <footer className="border-border-technical/30 bg-background-subtle/10 flex shrink-0 items-center justify-end gap-4 border-t p-6">
            <Button variant="outline" onClick={onClose} disabled={isDeploying}>Cancel_Action</Button>
            <Button 
              variant="primary" 
              type="submit" 
              onClick={handleSubmit} 
              isLoading={isDeploying}
              disabled={!isFormValid || isBalanceInsufficient}
              className={cn(
                "px-12 shadow-xl transition-all duration-500",
                isDeploying ? "opacity-100" : "shadow-primary/20"
              )}
            >
              {isDeploying ? 'Initializing_Core...' : (initialData ? 'Update_Agent' : 'Deploy_Agent')}
            </Button>
          </footer>
        </div>
      </TechnicalSurface>
    </div>
  );
};
