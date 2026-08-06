'use client';

import React, { useMemo } from 'react';
import { TechnicalSurface, Icon, TechnicalIndicator, cn } from '@loopdev/ui';
import { Lead } from '../context';
import { isLeadStale } from '../utils/leadActivity';

export interface PipelineCardProps {
  lead: Lead;
  onClick: () => void;
  isDragging?: boolean;
}

export const PipelineCard: React.FC<PipelineCardProps> = ({ lead, onClick, isDragging }) => {
  const isSanitas = lead.company === 'Sanitas' || lead.company === 'Logística Continental';
  const displayCompany = isSanitas ? 'Sanitas' : 'Adeslas';

  const lastActivity = lead.history?.length ? lead.history[lead.history.length - 1] : null;
  const actorName = lastActivity?.actor.split(' ')[0] || 'Sistema';
  const formattedDate = lastActivity
    ? (() => {
        const d = new Date(lastActivity.date);
        return `${d.getDate()}/${d.getMonth() + 1}`;
      })()
    : '';

  /**
   * STALE LOGIC (From CRM Mock)
   * A lead is stale if:
   * 1. It is in 'contacted' stage
   * 2. AND has had no activity for more than 5 days
   */
  const isStale = useMemo(() => isLeadStale(lead), [lead]);

  return (
    <TechnicalSurface
      variant="surface"
      depth="flat"
      onClick={onClick}
      className={cn(
        'p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between h-full min-h-[120px]',
        isDragging && 'opacity-50',
        isSanitas
          ? 'bg-[#00548F] text-white'
          : 'bg-white text-slate-800 border-l-4 border-l-[#0095DA]',
      )}
    >
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start mb-1.5">
          <h3
            className={cn(
              'text-sm font-bold truncate pr-2',
              isSanitas ? 'text-white' : 'text-slate-800',
            )}
          >
            {lead.name}
          </h3>
          <div
            className={cn(
              'text-[10px] font-bold px-1 py-0.5 rounded',
              lead.aiScore >= 80
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/20 text-rose-400',
            )}
          >
            {lead.aiScore}
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <span
            className={cn(
              'text-[10px] font-bold px-1.5 py-0.5 rounded w-fit',
              isSanitas ? 'bg-white/20' : 'bg-blue-50 text-blue-700',
            )}
          >
            {displayCompany}
          </span>
          <p className={cn('text-xs opacity-70', isSanitas ? 'text-white' : 'text-slate-500')}>
            {lead.interestedPlan || 'Más Salud'}
          </p>
        </div>
      </div>

      <div
        className={cn(
          'mt-4 mb-2 flex items-center gap-2',
          isSanitas ? 'text-white/40' : 'text-slate-200',
        )}
      >
        <div className={cn('h-px flex-1', isSanitas ? 'bg-white/20' : 'bg-slate-100')}></div>
        <div className="flex items-center gap-1.5 select-none opacity-80">
          <Icon
            name="vital_signs"
            size="sm"
            className={cn('w-4 h-3', isSanitas ? 'text-white' : 'text-slate-400')}
          />
          <span
            className={cn(
              'text-[8px] font-black uppercase tracking-[0.2em]',
              isSanitas ? 'text-white' : 'text-slate-400',
            )}
          >
            Actividad
          </span>
        </div>
        <div className={cn('h-px flex-1', isSanitas ? 'bg-white/20' : 'bg-slate-100')}></div>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex flex-col min-w-0">
          <span
            className={cn('text-[10px] font-bold', isSanitas ? 'text-white' : 'text-slate-700')}
          >
            {actorName}
          </span>
          <span
            className={cn('text-[10px] opacity-50', isSanitas ? 'text-white' : 'text-slate-400')}
          >
            {formattedDate}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {isStale && (
            <TechnicalIndicator
              variant="stale"
              brandMode={isSanitas ? 'sanitas' : 'adeslas'}
              tooltip="Lead estancado: Sin actividad reciente (+5 días)"
            />
          )}
          {lead.hasGeneratedPdf && (
            <TechnicalIndicator
              variant="pdf"
              brandMode={isSanitas ? 'sanitas' : 'adeslas'}
              tooltip="Presupuesto generado"
            />
          )}
          {lead.hasAiAssistance && (
            <TechnicalIndicator
              variant="ai"
              brandMode={isSanitas ? 'sanitas' : 'adeslas'}
              tooltip="Generar Presupuesto con IA"
            />
          )}
          {lead.relatedQuotesCount && lead.relatedQuotesCount > 1 && (
            <TechnicalIndicator
              variant="counter"
              value={lead.relatedQuotesCount}
              tooltip={`${lead.name} tiene ${lead.relatedQuotesCount} presupuestos relacionados`}
            />
          )}
        </div>
      </div>
    </TechnicalSurface>
  );
};
