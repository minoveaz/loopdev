'use client';

import React, { useState, useEffect } from 'react';
import { CreateStrategyModalProps, StrategyConfig } from './types';
import { 
  TechnicalSurface, 
  LpdText, 
  Heading, 
  Input, 
  Button, 
  IconButton, 
  Divider,
  Icon
} from '../../../atoms';
import { cn } from '../../../../helpers/cn';

/**
 * @component CreateStrategyModal
 * @description Industrial-grade multi-step workflow for creating trading strategies.
 * Promoted from application local component to Design System.
 */
export const CreateStrategyModal: React.FC<CreateStrategyModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  exchanges,
  availableAssets,
  isLoading = false
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<StrategyConfig>({
    name: '',
    description: '',
    exchangeId: exchanges[0]?.id || '',
    mode: 'paper',
    status: 'draft',
    pairs: [],
    riskProfile: {
      sizePerTrade: 100,
      maxPositions: 5,
      maxExposure: 1000,
      stopLoss: 2.0,
      takeProfit: 5.0,
      trailingStop: 0.0,
      cooldownMinutes: 60,
      dailyLossLimit: 5.0
    }
  });

  // Reset form when opening/closing
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData(prev => ({
        ...prev,
        exchangeId: exchanges[0]?.id || ''
      }));
    }
  }, [isOpen, exchanges]);

  if (!isOpen) return null;

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const togglePair = (symbol: string) => {
    setFormData(prev => ({
      ...prev,
      pairs: prev.pairs.includes(symbol)
        ? prev.pairs.filter(p => p !== symbol)
        : [...prev.pairs, symbol]
    }));
  };

  const stepTitles = [
    'Strategy_Identity',
    'Asset_Selection',
    'Risk_Parameters',
    'Final_Audit'
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <TechnicalSurface 
        variant="surface" 
        depth="overlay" 
        className="relative z-10 w-full max-w-2xl h-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300"
      >
        <div className="flex flex-col h-full w-full">
          {/* HEADER */}
          <header className="p-6 border-b border-border-technical/30 flex items-center justify-between bg-background-subtle/30 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <span className="material-symbols-outlined text-xl font-bold">architecture</span>
              </div>
              <div>
                <Heading size="xs" weight="bold" className="uppercase tracking-tight italic">{stepTitles[step-1]}</Heading>
                <LpdText size="nano" className="text-text-muted uppercase tracking-widest font-mono opacity-60">Step_0{step} // Protocol_Builder</LpdText>
              </div>
            </div>
            <IconButton icon="close" size="sm" onClick={onClose} />
          </header>

          {/* PROGRESS BAR */}
          <div className="w-full h-1 bg-background-subtle">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out" 
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar flex flex-col gap-8 min-h-0">
            
            {step === 1 && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Input 
                  label="Strategy Name" 
                  placeholder="e.g. BTC_Volatility_Seeker" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-text-muted px-1">Exchange_Nexus</label>
                  <select 
                    className="w-full h-10 px-3 rounded-lg bg-white dark:bg-[#161E33] border border-border-technical/50 text-sm font-bold text-text-main focus:border-primary outline-none transition-all"
                    value={formData.exchangeId}
                    onChange={(e) => setFormData({...formData, exchangeId: e.target.value})}
                  >
                    {exchanges.map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.name} ({ex.provider})</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-3">
                   <label className="text-[10px] uppercase font-black tracking-widest text-text-muted px-1">Operational_Mode</label>
                   <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setFormData({...formData, mode: 'paper'})}
                        className={cn(
                          "p-4 rounded-xl border flex flex-col items-center gap-1 transition-all",
                          formData.mode === 'paper' ? "bg-primary/5 border-primary text-primary shadow-lg shadow-primary/10" : "border-border-technical/30 text-text-muted hover:border-border-technical"
                        )}
                      >
                        <span className="material-symbols-outlined font-bold">science</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Paper_Trading</span>
                      </button>
                      <button 
                        onClick={() => setFormData({...formData, mode: 'live'})}
                        className={cn(
                          "p-4 rounded-xl border flex flex-col items-center gap-1 transition-all",
                          formData.mode === 'live' ? "bg-amber-500/5 border-amber-500 text-amber-500 shadow-lg shadow-amber-500/10" : "border-border-technical/30 text-text-muted hover:border-border-technical"
                        )}
                      >
                        <span className="material-symbols-outlined font-bold">bolt</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Live_Trading</span>
                      </button>
                   </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <LpdText size="xs" className="text-text-muted italic px-1">// Select certified assets for automated monitoring.</LpdText>
                <div className="grid grid-cols-2 gap-3">
                  {availableAssets.map(asset => (
                    <button
                      key={asset.symbol}
                      onClick={() => togglePair(asset.symbol)}
                      className={cn(
                        "p-3 rounded-xl border flex items-center justify-between transition-all",
                        formData.pairs.includes(asset.symbol) ? "bg-primary/10 border-primary text-primary" : "border-border-technical/30 text-text-muted hover:border-border-technical"
                      )}
                    >
                      <span className="text-xs font-bold font-mono">{asset.symbol}</span>
                      <span className="material-symbols-outlined text-sm">
                        {formData.pairs.includes(asset.symbol) ? 'check_circle' : 'add_circle'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-2 gap-6">
                  <Input 
                    label="Size per Trade ($)" 
                    type="number"
                    value={formData.riskProfile.sizePerTrade}
                    onChange={(e) => setFormData({...formData, riskProfile: {...formData.riskProfile, sizePerTrade: Number(e.target.value)}})}
                  />
                  <Input 
                    label="Max Positions" 
                    type="number"
                    value={formData.riskProfile.maxPositions}
                    onChange={(e) => setFormData({...formData, riskProfile: {...formData.riskProfile, maxPositions: Number(e.target.value)}})}
                  />
                  <Input 
                    label="Stop Loss (%)" 
                    type="number"
                    step="0.1"
                    value={formData.riskProfile.stopLoss}
                    onChange={(e) => setFormData({...formData, riskProfile: {...formData.riskProfile, stopLoss: Number(e.target.value)}})}
                  />
                  <Input 
                    label="Take Profit (%)" 
                    type="number"
                    step="0.1"
                    value={formData.riskProfile.takeProfit}
                    onChange={(e) => setFormData({...formData, riskProfile: {...formData.riskProfile, takeProfit: Number(e.target.value)}})}
                  />
                </div>
                <Divider thickness="technical" className="opacity-50" />
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-3">
                  <span className="material-symbols-outlined text-amber-500 text-sm">info</span>
                  <LpdText size="xs" className="text-amber-600/80 leading-relaxed font-medium">
                    Parameters will be applied to every entry signal. Manual overrides are available in the Risk Control module.
                  </LpdText>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-background-subtle rounded-2xl p-6 border border-border-technical/30 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <LpdText size="xs" weight="bold" className="uppercase tracking-widest text-text-muted">Protocol_Name</LpdText>
                    <LpdText size="xs" weight="black" className="text-text-main uppercase">{formData.name}</LpdText>
                  </div>
                  <div className="flex justify-between items-center">
                    <LpdText size="xs" weight="bold" className="uppercase tracking-widest text-text-muted">Active_Assets</LpdText>
                    <LpdText size="xs" weight="black" className="text-primary font-mono">{formData.pairs.join(', ') || 'NONE'}</LpdText>
                  </div>
                  <div className="flex justify-between items-center">
                    <LpdText size="xs" weight="bold" className="uppercase tracking-widest text-text-muted">Exposure_Limit</LpdText>
                    <LpdText size="xs" weight="black" className="text-text-main">${formData.riskProfile.maxExposure}</LpdText>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-500">verified_user</span>
                  <LpdText size="xs" className="text-emerald-600 font-bold uppercase tracking-tight">Strategy_Verified_Ready_for_Deployment</LpdText>
                </div>
              </div>
            )}

          </div>

          {/* FOOTER */}
          <footer className="p-6 border-t border-border-technical/30 flex items-center justify-between bg-background-subtle/10 shrink-0">
            <Button 
              variant="outline" 
              onClick={handleBack} 
              disabled={step === 1}
              startIcon="chevron_left"
            >
              Back
            </Button>
            
            {step < 4 ? (
              <Button 
                variant="primary" 
                onClick={handleNext}
                disabled={step === 1 && !formData.name || step === 2 && formData.pairs.length === 0}
                endIcon="chevron_right"
              >
                Next_Phase
              </Button>
            ) : (
              <Button 
                variant="energy" 
                onClick={() => onCreate(formData)}
                isLoading={isLoading}
                className="px-12"
              >
                Commit_Strategy
              </Button>
            )}
          </footer>
        </div>
      </TechnicalSurface>
    </div>
  );
};
