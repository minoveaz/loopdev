'use client';

import React from 'react';
import {
  TechnicalSurface,
  Heading,
  LpdText,
  Button,
  IconButton,
  StatusPulse,
  cn
} from '@loopdev/ui';
import { Play, Pause, Copy, MoreVertical, Zap } from 'lucide-react';
import type { Strategy } from '@/hooks/trading/useStrategies';

interface StrategyCardProps {
  strategy: Strategy;
  isLoading?: boolean;
  onActivate?: (id: string) => void;
  onPause?: (id: string) => void;
  onClone?: (id: string) => void;
  onBacktest?: (id: string) => void;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  isLoading = false,
  onActivate,
  onPause,
  onClone,
  onBacktest
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active': 
        return { 
          pulse: 'success' as const, 
          color: '#10b981',
          label: 'Activo'
        };
      case 'paused': 
        return { 
          pulse: 'energy' as const, 
          color: '#f59e0b',
          label: 'Pausado'
        };
      case 'draft': 
        return { 
          pulse: 'neutral' as const, 
          color: 'var(--lpd-color-text-muted, #64748b)',
          label: 'Borrador'
        };
      case 'archived': 
        return { 
          pulse: 'neutral' as const, 
          color: 'var(--lpd-color-text-muted, #64748b)',
          label: 'Archivado'
        };
      default: 
        return { 
          pulse: 'neutral' as const, 
          color: 'var(--lpd-color-text-muted, #64748b)',
          label: status
        };
    }
  };

  const statusConfig = getStatusConfig(strategy.status);
  const modeIsPaper = strategy.mode === 'paper';

  return (
    <TechnicalSurface
      variant="surface"
      depth="flat"
      className={cn(
        "p-6 flex flex-col gap-6 min-h-[320px] border transition-all",
        isLoading && "opacity-50 pointer-events-none"
      )}
    >
      {/* HEADER: Name & Status */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2 flex-1">
          <Heading 
            size="sm" 
            weight="bold" 
            className="truncate"
            style={{ color: 'var(--lpd-color-text-base, #0f172a)' }}
          >
            {strategy.name}
          </Heading>
          <div className="flex items-center gap-2">
            <LpdText 
              size="nano" 
              className="uppercase tracking-widest font-bold"
              style={{ color: 'var(--lpd-color-text-muted, #64748b)' }}
            >
              {strategy.exchange}
            </LpdText>
            <span 
              className="text-[10px]"
              style={{ color: 'var(--lpd-color-text-muted, #64748b)', opacity: 0.4 }}
            >
              •
            </span>
            <span 
              className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase border"
              style={{
                backgroundColor: modeIsPaper ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderColor: modeIsPaper ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: modeIsPaper ? '#3b82f6' : '#ef4444'
              }}
            >
              {strategy.mode === 'paper' ? '📝 Paper' : '💰 Live'}
            </span>
          </div>
        </div>

        <div 
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border"
          style={{
            borderColor: 'var(--lpd-color-border-technical, rgba(255, 255, 255, 0.05))',
            backgroundColor: 'var(--lpd-color-bg-subtle, #f1f5f9)'
          }}
        >
          <StatusPulse variant={statusConfig.pulse} size="xs" />
          <LpdText 
            size="nano" 
            weight="bold" 
            className="uppercase tracking-widest"
            style={{ color: statusConfig.color }}
          >
            {statusConfig.label}
          </LpdText>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Posiciones Abiertas', value: strategy.openPositions, unit: '' },
          { label: 'Riesgo', value: strategy.riskScore, unit: '/100' },
          { label: 'Drawdown', value: strategy.drawdown?.toFixed(2), unit: '%' },
          { label: 'P&L 30d', value: strategy.pnl30d?.toFixed(1), unit: '%' }
        ].map((metric, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg border"
            style={{
              borderColor: 'var(--lpd-color-border-technical, rgba(255, 255, 255, 0.05))',
              backgroundColor: 'var(--lpd-color-bg-subtle, #f1f5f9)'
            }}
          >
            <LpdText 
              size="nano" 
              className="uppercase tracking-widest mb-1.5"
              style={{ color: 'var(--lpd-color-text-muted, #64748b)' }}
            >
              {metric.label}
            </LpdText>
            <div className="flex items-baseline gap-1">
              <LpdText 
                weight="bold" 
                className="text-lg"
                style={{ color: 'var(--lpd-color-text-base, #0f172a)' }}
              >
                {metric.value ?? '-'}
              </LpdText>
              {metric.unit && (
                <LpdText 
                  size="nano"
                  style={{ color: 'var(--lpd-color-text-muted, #64748b)' }}
                >
                  {metric.unit}
                </LpdText>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* PAIRS DISPLAY */}
      {strategy.pairs.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {strategy.pairs.slice(0, 3).map(pair => (
            <span
              key={pair}
              className="px-2 py-1 rounded text-[10px] font-mono font-bold border"
              style={{
                backgroundColor: 'rgba(19, 91, 236, 0.1)',
                borderColor: 'rgba(19, 91, 236, 0.2)',
                color: 'var(--lpd-color-brand-primary, #135bec)'
              }}
            >
              {pair}
            </span>
          ))}
          {strategy.pairs.length > 3 && (
            <span 
              className="px-2 py-1 rounded text-[10px] font-bold"
              style={{ color: 'var(--lpd-color-text-muted, #64748b)' }}
            >
              +{strategy.pairs.length - 3} más
            </span>
          )}
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex gap-2 pt-2 mt-auto">
        {strategy.status === 'draft' && (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onActivate?.(strategy.id)}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Activar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBacktest?.(strategy.id)}
              className="flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
            </Button>
          </>
        )}

        {strategy.status === 'active' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPause?.(strategy.id)}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Pause className="w-4 h-4" />
              Pausar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBacktest?.(strategy.id)}
              className="flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
            </Button>
          </>
        )}

        {strategy.status === 'paused' && (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onActivate?.(strategy.id)}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Reanudar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClone?.(strategy.id)}
              className="flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </>
        )}

        {strategy.status === 'archived' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClone?.(strategy.id)}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Clonar
            </Button>
          </>
        )}

        <IconButton
          icon="more_vert"
          variant="ghost"
          size="sm"
          className="flex-shrink-0"
        />
      </div>
    </TechnicalSurface>
  );
};
