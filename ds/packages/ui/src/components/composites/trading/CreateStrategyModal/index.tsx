'use client';

import React, { useState, useEffect } from 'react';
import { CreateStrategyModalProps, StrategyConfig, StrategyDefinition } from './types';
import { 
  TechnicalSurface, 
  LpdText, 
  Heading, 
  Input, 
  Button, 
  IconButton, 
  Divider,
  Icon,
  Badge
} from '../../../atoms';
import { cn } from '../../../../helpers/cn';

/**
 * @component CreateStrategyModal
 * @description Dynamic Strategy Factory. Generates configuration forms based on the selected core registry.
 */
export const CreateStrategyModal: React.FC<CreateStrategyModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  exchanges,
  availableAssets,
  availableCores = [],
  isLoading = false
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<StrategyConfig>({
    name: '',
    coreId: availableCores[0]?.id || 'atr-breakout-v1',
    description: '',
    exchangeId: exchanges[0]?.id || '',
    mode: 'paper',
    status: 'draft',
    pairs: [],
    parameters: {},
    stopLoss: 2.0,
    takeProfit: 5.0
  });

  const selectedCore = availableCores.find(c => c.id === formData.coreId);

  // Initialize parameters and risk guards when core changes
  useEffect(() => {
    if (selectedCore) {
      const initialParams: Record<string, any> = {};
      selectedCore.parameters.forEach(p => {
        initialParams[p.id] = p.default;
      });

      // Dinamically find TP/SL defaults from registry parameters if they exist
      const registryTP = selectedCore.parameters.find(p => p.id === 'tp_pct' || p.id === 'atr_tp_multiplier')?.default;
      const registrySL = selectedCore.parameters.find(p => p.id === 'sl_pct' || p.id === 'atr_sl_multiplier')?.default;

      setFormData(prev => ({ 
        ...prev, 
        parameters: initialParams,
        // Si la estrategia es de Scalping, bajamos los guards automáticamente
        takeProfit: registryTP || (selectedCore.category.toUpperCase() === 'SCALPING' ? 1.5 : 5.0),
        stopLoss: registrySL || (selectedCore.category.toUpperCase() === 'SCALPING' ? 1.0 : 2.0)
      }));
    }
  }, [formData.coreId, selectedCore]);

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

  const stepTitles = ['Protocol_Selection', 'Asset_Targeting', 'Logic_Tuning', 'Final_Validation'];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <TechnicalSurface variant="surface" depth="overlay" className="relative z-10 w-full max-w-2xl h-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex flex-col h-full w-full">
          {/* HEADER */}
          <header className="p-6 border-b border-border-technical/30 flex items-center justify-between bg-background-subtle/30 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <span className="material-symbols-outlined text-xl font-bold">architecture</span>
              </div>
              <div>
                <Heading size="xs" weight="bold" className="uppercase tracking-tight italic">{stepTitles[step-1]}</Heading>
                <LpdText size="nano" className="text-text-muted uppercase tracking-widest font-mono opacity-60">Quant_OS // Strategy_Factory</LpdText>
              </div>
            </div>
            <IconButton icon="close" size="sm" onClick={onClose} />
          </header>

          <div className="w-full h-1 bg-background-subtle">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar flex flex-col gap-8 min-h-0">
            
            {step === 1 && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Input label="Strategy Friendly Name" placeholder="e.g. My_Alpha_Protocol" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase font-black tracking-widest text-text-muted px-1">Logic_Engine_Core</label>
                  <div className="grid grid-cols-1 gap-3">
                    {availableCores.map(core => (
                      <button
                        key={core.id}
                        onClick={() => setFormData({...formData, coreId: core.id})}
                        className={cn(
                          "p-4 rounded-xl border flex flex-col items-start gap-2 transition-all text-left",
                          formData.coreId === core.id ? "bg-primary/5 border-primary shadow-lg" : "border-border-technical/30 hover:border-border-technical"
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <Heading size="xs" weight="bold" className={formData.coreId === core.id ? "text-primary" : "text-text-main"}>{core.name}</Heading>
                          <Badge variant="outline">{core.category}</Badge>
                        </div>
                        <LpdText size="xs" className="text-text-muted line-clamp-2">{core.description}</LpdText>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedCore && (
                  <div className="bg-background-subtle rounded-xl p-4 border border-border-technical/20">
                    <LpdText size="nano" weight="black" className="uppercase tracking-widest text-primary mb-2 block">Technical_Summary</LpdText>
                    <LpdText size="xs" className="text-text-main italic leading-relaxed">{selectedCore.technical_summary}</LpdText>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-2 gap-3">
                  {availableAssets.map(asset => (
                    <button key={asset.symbol} onClick={() => togglePair(asset.symbol)} className={cn("p-3 rounded-xl border flex items-center justify-between transition-all", formData.pairs.includes(asset.symbol) ? "bg-primary/10 border-primary text-primary" : "border-border-technical/30 text-text-muted")}>
                      <span className="text-xs font-bold font-mono">{asset.symbol}</span>
                      <span className="material-symbols-outlined text-sm">{formData.pairs.includes(asset.symbol) ? 'check_circle' : 'add_circle'}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Heading size="xs" weight="bold" className="uppercase px-1">Engine_Parameters</Heading>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedCore?.parameters.map(param => (
                    <div key={param.id} className="flex flex-col gap-1.5">
                      <Input 
                        label={param.label} 
                        type="number" 
                        value={formData.parameters[param.id]} 
                        onChange={(e) => setFormData({
                          ...formData, 
                          parameters: { ...formData.parameters, [param.id]: Number(e.target.value) }
                        })}
                        helperText={param.description}
                      />
                    </div>
                  ))}
                </div>
                <Divider />
                <Heading size="xs" weight="bold" className="uppercase px-1">Global_Risk_Guard</Heading>
                <div className="grid grid-cols-2 gap-6">
                  <Input label="Hard Stop Loss (%)" type="number" step="0.1" value={formData.stopLoss} onChange={(e) => setFormData({...formData, stopLoss: Number(e.target.value)})} />
                  <Input label="Take Profit Threshold (%)" type="number" step="0.1" value={formData.takeProfit} onChange={(e) => setFormData({...formData, takeProfit: Number(e.target.value)})} />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-background-subtle rounded-2xl p-6 border border-border-technical/30 flex flex-col gap-4">
                  <div className="flex justify-between items-center"><LpdText size="xs" weight="bold">Blueprint_Name</LpdText><LpdText size="xs" weight="black">{formData.name}</LpdText></div>
                  <div className="flex justify-between items-center"><LpdText size="xs" weight="bold">Core_Engine</LpdText><LpdText size="xs" weight="black" className="text-primary">{selectedCore?.name}</LpdText></div>
                  <div className="flex justify-between items-center"><LpdText size="xs" weight="bold">Target_Assets</LpdText><LpdText size="xs" weight="black" className="font-mono">{formData.pairs.join(', ')}</LpdText></div>
                </div>
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-500">verified_user</span>
                  <LpdText size="xs" className="text-emerald-600 font-bold uppercase">Ready_for_Industrial_Deployment</LpdText>
                </div>
              </div>
            )}

          </div>

          <footer className="p-6 border-t border-border-technical/30 flex items-center justify-between bg-background-subtle/10 shrink-0">
            <Button variant="outline" onClick={handleBack} disabled={step === 1} startIcon="chevron_left">Back</Button>
            {step < 4 ? (
              <Button variant="primary" onClick={handleNext} disabled={step === 1 && !formData.name || step === 2 && formData.pairs.length === 0} endIcon="chevron_right">Next_Phase</Button>
            ) : (
              <Button variant="energy" onClick={() => onCreate(formData)} isLoading={isLoading} className="px-12">Commit_Strategy</Button>
            )}
          </footer>
        </div>
      </TechnicalSurface>
    </div>
  );
};
