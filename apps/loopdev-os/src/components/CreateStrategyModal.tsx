'use client';

import React, { useState } from 'react';
import {
  Button,
  Input,
  Label,
  TechnicalSurface,
  Heading,
  LpdText,
  Divider,
  cn
} from '@loopdev/ui';
import { X, ChevronRight, ChevronLeft, AlertCircle, Check, ChevronDown } from 'lucide-react';

interface CreateStrategyModalProps {
  isOpen: boolean;
  exchanges: Array<{ id: string; name: string; provider: string }>;
  availablePairs: string[];
  onClose: () => void;
  onCreate: (params: {
    name: string;
    exchangeId: string;
    mode: 'paper' | 'live';
    pairs: string[];
    sizePerTrade: number;
    maxPositions: number;
    maxExposure: number;
    stopLoss: number;
    takeProfit: number;
    trailingStop: number;
    cooldownMinutes: number;
    dailyLossLimit: number;
    description?: string;
  }) => void;
  isLoading?: boolean;
}

const COMMON_PAIRS = [
  'BTC/USD',
  'ETH/USD',
  'BNB/USD',
  'XRP/USD',
  'ADA/USD',
  'SOL/USD',
  'DOGE/USD',
  'MATIC/USD'
];

type NumericStrategyField = 'sizePerTrade' | 'maxPositions' | 'stopLoss' | 'takeProfit' | 'trailingStop' | 'cooldownMinutes';

export const CreateStrategyModal: React.FC<CreateStrategyModalProps> = ({
  isOpen,
  exchanges,
  availablePairs,
  onClose,
  onCreate,
  isLoading = false
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    exchangeId: exchanges[0]?.id || '',
    mode: 'paper' as 'paper' | 'live',
    pairs: [] as string[],
    sizePerTrade: 100,
    maxPositions: 5,
    maxExposure: 50,
    stopLoss: 2,
    takeProfit: 5,
    trailingStop: 1,
    cooldownMinutes: 60,
    dailyLossLimit: 10,
    description: ''
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateNumericField = (key: NumericStrategyField, value: number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCreate = () => {
    onCreate(formData);
    setStep(1);
    setFormData({
      name: '',
      exchangeId: exchanges[0]?.id || '',
      mode: 'paper',
      pairs: [],
      sizePerTrade: 100,
      maxPositions: 5,
      maxExposure: 50,
      stopLoss: 2,
      takeProfit: 5,
      trailingStop: 1,
      cooldownMinutes: 60,
      dailyLossLimit: 10,
      description: ''
    });
    onClose();
  };

  const togglePair = (pair: string) => {
    setFormData(prev => ({
      ...prev,
      pairs: prev.pairs.includes(pair)
        ? prev.pairs.filter(p => p !== pair)
        : [...prev.pairs, pair]
    }));
  };

  if (!isOpen) return null;

  const pairs = availablePairs.length > 0 ? availablePairs : COMMON_PAIRS;
  const stepNames = ['Información Básica', 'Configurar Pares', 'Parámetros de Riesgo', 'Revisar & Crear'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <TechnicalSurface variant="surface" depth="raised" className="max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--lpd-color-border-technical,rgba(255,255,255,0.05))] sticky top-0 bg-[var(--lpd-color-bg-base,#ffffff)] z-10">
          <div className="flex flex-col gap-1">
            <Heading size="sm" weight="bold" className="text-[var(--lpd-color-text-base,#0f172a)]">
              {stepNames[step - 1]}
            </Heading>
            <LpdText className="text-[var(--lpd-color-text-muted,#64748b)] tracking-widest uppercase">
              Paso {step} de 4
            </LpdText>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--lpd-color-bg-subtle,#f1f5f9)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--lpd-color-text-muted,#64748b)]" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-6 flex flex-col gap-6">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" textWeight="black" className="uppercase tracking-widest text-[var(--lpd-color-text-muted,#64748b)]">
                  Nombre de la Estrategia
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej: Scalping BTC"
                  variant="outline"
                  size="md"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exchange" textWeight="black" className="uppercase tracking-widest text-[var(--lpd-color-text-muted,#64748b)]">
                  Exchange Conectado
                </Label>
                <div className="relative">
                  <select
                    id="exchange"
                    value={formData.exchangeId}
                    onChange={(e) => setFormData({ ...formData, exchangeId: e.target.value })}
                    className={cn(
                      "w-full px-4 py-2.5 pr-10 rounded-lg border border-[var(--lpd-color-border-technical,rgba(255,255,255,0.05))]",
                      "bg-[var(--lpd-color-bg-base,#ffffff)]",
                      "text-[var(--lpd-color-text-base,#0f172a)]",
                      "focus:ring-2 focus:ring-[var(--lpd-color-brand-primary,#135bec)]/50",
                      "outline-none transition-all font-mono text-sm",
                      "appearance-none cursor-pointer"
                    )}
                  >
                    {exchanges.map(ex => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name} ({ex.provider})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--lpd-color-text-muted,#64748b)] pointer-events-none" />
                </div>
              </div>

              <div className="space-y-3">
                <Label textWeight="black" className="uppercase tracking-widest text-[var(--lpd-color-text-muted,#64748b)]">
                  Modo de Operación
                </Label>
                <div className="flex gap-3">
                  {[
                    { value: 'paper', label: '📝 Paper (Simulado)', desc: 'Modo de prueba sin dinero real' },
                    { value: 'live', label: '💰 Live (Real)', desc: 'Operaciones con dinero real' }
                  ].map(mode => (
                    <label
                      key={mode.value}
                      className={cn(
                        'flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all',
                        formData.mode === mode.value
                          ? 'border-[var(--lpd-color-brand-primary,#135bec)] bg-[var(--lpd-color-brand-primary,#135bec)]/10'
                          : 'border-[var(--lpd-color-border-technical,rgba(255,255,255,0.05))] hover:border-[var(--lpd-color-border-technical,rgba(255,255,255,0.1))]'
                      )}
                    >
                      <input
                        type="radio"
                        name="mode"
                        value={mode.value}
                        checked={formData.mode === mode.value}
                        onChange={(e) => setFormData({ ...formData, mode: (e.target.value === 'paper' ? 'paper' : 'live') })}
                        className="hidden"
                      />
                      <div className="flex items-start gap-2">
                        <div className={cn(
                          'w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0',
                          formData.mode === mode.value ? 'border-[var(--lpd-color-brand-primary,#135bec)]' : 'border-[var(--lpd-color-border-technical,rgba(255,255,255,0.05))]'
                        )}>
                          {formData.mode === mode.value && <div className="w-2 h-2 bg-[var(--lpd-color-brand-primary,#135bec)] rounded-full" />}
                        </div>
                        <div className="flex flex-col">
                          <LpdText weight="bold" className="text-[var(--lpd-color-text-base,#0f172a)]">{mode.label}</LpdText>
                          <LpdText className="text-[var(--lpd-color-text-muted,#64748b)]">{mode.desc}</LpdText>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" textWeight="black" className="uppercase tracking-widest text-[var(--lpd-color-text-muted,#64748b)]">
                  Descripción (Opcional)
                </Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe tu estrategia..."
                  rows={3}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border border-[var(--lpd-color-border-technical,rgba(255,255,255,0.05))]",
                    "bg-[var(--lpd-color-bg-base,#ffffff)]",
                    "text-[var(--lpd-color-text-base,#0f172a)]",
                    "focus:ring-2 focus:ring-[var(--lpd-color-brand-primary,#135bec)]/50",
                    "outline-none transition-all font-mono text-sm resize-none"
                  )}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Pairs */}
          {step === 2 && (
            <div className="space-y-4">
              <LpdText className="text-[var(--lpd-color-text-muted,#64748b)]">
                Selecciona los pares que quieres operar. Puedes seleccionar múltiples.
              </LpdText>
              <div className="grid grid-cols-2 gap-3">
                {pairs.map(pair => (
                  <button
                    key={pair}
                    onClick={() => togglePair(pair)}
                    className={cn(
                      'p-3 rounded-lg border-2 transition-all flex items-center gap-2',
                      formData.pairs.includes(pair)
                        ? 'border-[var(--lpd-color-brand-primary,#135bec)] bg-[var(--lpd-color-brand-primary,#135bec)]/10'
                        : 'border-[var(--lpd-color-border-technical,rgba(255,255,255,0.05))] hover:border-[var(--lpd-color-brand-primary,#135bec)]/50'
                    )}
                  >
                    <div className={cn(
                      'w-4 h-4 rounded border border-[var(--lpd-color-text-muted,#64748b)] flex items-center justify-center flex-shrink-0',
                      formData.pairs.includes(pair) && 'bg-[var(--lpd-color-brand-primary,#135bec)] border-[var(--lpd-color-brand-primary,#135bec)]'
                    )}>
                      {formData.pairs.includes(pair) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <LpdText weight="bold" className="text-[var(--lpd-color-text-base,#0f172a)] font-mono">{pair}</LpdText>
                  </button>
                ))}
              </div>
              {formData.pairs.length === 0 && (
                <div className="p-3 rounded-lg border border-[rgba(245,158,11,0.2)] bg-[rgba(245,158,11,0.05)] flex gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
                  <LpdText style={{ color: '#f59e0b' }}>Selecciona al menos un par para continuar</LpdText>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Risk Parameters */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Tamaño por Trade ($)', key: 'sizePerTrade', type: 'number', step: '1' },
                  { label: 'Máx Posiciones', key: 'maxPositions', type: 'number', step: '1' },
                  { label: 'Stop Loss (%)', key: 'stopLoss', type: 'number', step: '0.1' },
                  { label: 'Take Profit (%)', key: 'takeProfit', type: 'number', step: '0.1' },
                  { label: 'Trailing Stop (%)', key: 'trailingStop', type: 'number', step: '0.1' },
                  { label: 'Cooldown (minutos)', key: 'cooldownMinutes', type: 'number', step: '1' },
                ].map(field => (
                  <div key={field.key} className="space-y-2">
                    <Label textWeight="black" className="uppercase tracking-widest text-[11px] text-[var(--lpd-color-text-muted,#64748b)]">
                      {field.label}
                    </Label>
                    <Input
                      type={field.type}
                      step={field.step}
                      value={formData[field.key as NumericStrategyField]}
                      onChange={(e) => updateNumericField(field.key as NumericStrategyField, parseFloat(e.target.value))}
                      variant="outline"
                      size="md"
                    />
                  </div>
                ))}
              </div>

              <Divider />

              <div className="space-y-2">
                <Label textWeight="black" className="uppercase tracking-widest text-[var(--lpd-color-text-muted,#64748b)]">
                  Límite de Pérdida Diaria (%)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.dailyLossLimit}
                  onChange={(e) => setFormData({ ...formData, dailyLossLimit: parseFloat(e.target.value) })}
                  variant="outline"
                  size="md"
                />
              </div>

              <TechnicalSurface variant="surface" depth="flat" className="p-3 border border-[rgba(245,158,11,0.2)] bg-[rgba(245,158,11,0.05)]">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
                  <div className="space-y-1">
                    <LpdText weight="bold" style={{ color: '#f59e0b' }}>Recomendación de Riesgo</LpdText>
                    <LpdText className="text-[var(--lpd-color-text-muted,#64748b)]">
                      Los parámetros recomendados son stop loss 2% y take profit 5%.
                    </LpdText>
                  </div>
                </div>
              </TechnicalSurface>
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
            <div className="space-y-4">
              <TechnicalSurface variant="surface" depth="flat" className="p-4 border-2 border-[var(--lpd-color-brand-primary,#135bec)]/20 bg-[var(--lpd-color-brand-primary,#135bec)]/5">
                <div className="space-y-3">
                  <Heading size="sm" weight="bold">Resumen de la Estrategia</Heading>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <LpdText className="text-[var(--lpd-color-text-muted,#64748b)] uppercase tracking-widest">Nombre</LpdText>
                      <LpdText weight="bold" className="text-[var(--lpd-color-text-base,#0f172a)] mt-1">{formData.name}</LpdText>
                    </div>
                    <div>
                      <LpdText className="text-[var(--lpd-color-text-muted,#64748b)] uppercase tracking-widest">Exchange</LpdText>
                      <LpdText weight="bold" className="text-[var(--lpd-color-text-base,#0f172a)] mt-1">
                        {exchanges.find(e => e.id === formData.exchangeId)?.name}
                      </LpdText>
                    </div>
                    <div>
                      <LpdText className="text-[var(--lpd-color-text-muted,#64748b)] uppercase tracking-widest">Modo</LpdText>
                      <LpdText weight="bold" className="text-[var(--lpd-color-text-base,#0f172a)] mt-1">
                        {formData.mode === 'paper' ? '📝 Paper' : '💰 Live'}
                      </LpdText>
                    </div>
                    <div>
                      <LpdText className="text-[var(--lpd-color-text-muted,#64748b)] uppercase tracking-widest">Pares</LpdText>
                      <LpdText weight="bold" className="text-[var(--lpd-color-text-base,#0f172a)] mt-1">{formData.pairs.length} seleccionados</LpdText>
                    </div>
                  </div>
                </div>
              </TechnicalSurface>

              <TechnicalSurface variant="surface" depth="flat" className="p-4 border border-[var(--lpd-color-border-technical,rgba(255,255,255,0.05))]">
                <div className="space-y-3">
                  <Heading size="sm" weight="bold">Parámetros de Riesgo</Heading>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <LpdText className="text-[var(--lpd-color-text-muted,#64748b)]">Tamaño/Trade:</LpdText>
                      <LpdText weight="bold">${formData.sizePerTrade}</LpdText>
                    </div>
                    <div className="flex justify-between">
                      <LpdText className="text-[var(--lpd-color-text-muted,#64748b)]">Máx Posiciones:</LpdText>
                      <LpdText weight="bold">{formData.maxPositions}</LpdText>
                    </div>
                    <div className="flex justify-between">
                      <LpdText className="text-[var(--lpd-color-text-muted,#64748b)]">Stop Loss:</LpdText>
                      <LpdText weight="bold">{formData.stopLoss}%</LpdText>
                    </div>
                    <div className="flex justify-between">
                      <LpdText className="text-[var(--lpd-color-text-muted,#64748b)]">Take Profit:</LpdText>
                      <LpdText weight="bold">{formData.takeProfit}%</LpdText>
                    </div>
                  </div>
                </div>
              </TechnicalSurface>

              <div className="p-3 rounded-lg border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.05)]">
                <div className="flex gap-2">
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#10b981' }} />
                  <LpdText style={{ color: '#10b981' }}>
                    ℹ️ Se creará en estado &quot;Borrador&quot;. Puedes hacer backtest o activarla después.
                  </LpdText>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-[var(--lpd-color-border-technical,rgba(255,255,255,0.05))] bg-[var(--lpd-color-bg-subtle,#f1f5f9)] space-y-4">
          {/* Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-[var(--lpd-color-border-technical,rgba(255,255,255,0.05))] overflow-hidden">
            <div
              className="h-full bg-[var(--lpd-color-brand-primary,#135bec)] rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={handleBack}
              disabled={step === 1 || isLoading}
              className="flex items-center gap-2 min-w-max"
            >
              <ChevronLeft className="w-4 h-4" />
              Atrás
            </Button>

            {step < 4 ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                disabled={
                  (step === 1 && !formData.name) ||
                  (step === 2 && formData.pairs.length === 0) ||
                  isLoading
                }
                className="flex items-center gap-2 min-w-max"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="energy"
                size="md"
                onClick={handleCreate}
                disabled={isLoading}
                className="flex items-center gap-2 min-w-max"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[var(--lpd-color-text-base,#0f172a)]/30 border-t-[var(--lpd-color-text-base,#0f172a)] rounded-full animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Crear Estrategia
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </TechnicalSurface>
    </div>
  );
};
