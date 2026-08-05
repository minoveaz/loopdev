'use client';

import React, { useState, useMemo } from 'react';
import { 
  TechnicalSurface, 
  LpdText, 
  Icon, 
  Button, 
  cn, 
  Input, 
  Select,
  TechnicalStatusBadge,
  TechnicalIndicator,
  StatusPulse
} from '@loopdev/ui';
import { Lead } from '../context';

interface LeadHistoryProps {
  leads: Lead[];
  onViewDetails: (leadId: string) => void;
}

const ITEMS_PER_PAGE = 8;

export const LeadHistory: React.FC<LeadHistoryProps> = ({ leads, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<'all' | Lead['stage']>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter leads based on search term and stage filter
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesStage = stageFilter === 'all' || lead.stage === stageFilter;
      const matchesSearch = !searchTerm || 
        lead.name.toLowerCase().includes(lowerSearch) ||
        lead.company.toLowerCase().includes(lowerSearch) ||
        lead.notes.toLowerCase().includes(lowerSearch);

      return matchesStage && matchesSearch;
    });
  }, [leads, searchTerm, stageFilter]);

  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = useMemo(() => {
    return filteredLeads.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [filteredLeads, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const stageLabels: Record<Lead['stage'], string> = {
    lead: 'Nuevo Lead',
    contacted: 'Contactado',
    proposal: 'Propuesta',
    negotiation: 'Negociación',
    won: 'Ganado',
    lost: 'Perdido',
    rejected: 'Rechazado',
    discarded: 'Descartado'
  };

  const stageSeverityMap: Record<Lead['stage'], 'info' | 'warning' | 'danger' | 'success' | 'innovation' | 'neutral' | 'primary'> = {
    lead: 'neutral',
    contacted: 'info',
    proposal: 'innovation',
    negotiation: 'warning',
    won: 'success',
    lost: 'danger',
    rejected: 'danger',
    discarded: 'neutral',
  };

  return (
    <TechnicalSurface 
      variant="surface" 
      depth="flat" 
      className="p-6 border border-border-technical/60 rounded-3xl shadow-sm flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2 border-b border-border-technical pb-4 select-none">
        <h2 className="text-lg font-bold text-text-main uppercase tracking-tight">Historial de Leads</h2>
        <LpdText size="sm" className="text-text-muted">
          Listado y auditoría completa de los tratos comerciales del CRM.
        </LpdText>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end text-xs mt-3 mb-4">
        {/* Search */}
        <div>
          <Input
            placeholder="Buscar por contacto, compañía..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            startIcon={<Icon name="search" size="sm" className="text-text-muted" />}
            size="sm"
            fullWidth
          />
        </div>

        {/* Stage Filter */}
        <Select 
          value={stageFilter} 
          onChange={e => {
            setStageFilter(e.target.value as any);
            setCurrentPage(1);
          }} 
          size="sm"
        >
          <option value="all" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">Todos los estados</option>
          <option value="lead" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">Nuevo Lead</option>
          <option value="contacted" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">Contactado</option>
          <option value="proposal" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">Propuesta</option>
          <option value="negotiation" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">Negociación</option>
          <option value="won" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">Ganado (Cerrado)</option>
          <option value="lost" className="bg-surface-light dark:bg-surface-dark text-text-main dark:text-white">Perdido (Cerrado)</option>
        </Select>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-border-technical/50 rounded-2xl bg-shell-canvas/20">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border-technical bg-shell-canvas/60 select-none">
              <th className="p-4 font-bold text-text-muted uppercase tracking-wider text-[10px]">Contacto</th>
              <th className="p-4 font-bold text-text-muted uppercase tracking-wider text-[10px]">Compañía</th>
              <th className="p-4 font-bold text-text-muted uppercase tracking-wider text-[10px]">Valor de Trato</th>
              <th className="p-4 font-bold text-text-muted uppercase tracking-wider text-[10px]">Etapa</th>
              <th className="p-4 font-bold text-text-muted uppercase tracking-wider text-[10px]">Puntaje IA</th>
              <th className="p-4 font-bold text-text-muted uppercase tracking-wider text-[10px]">Telemetría</th>
              <th className="p-4 font-bold text-text-muted uppercase tracking-wider text-[10px] text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-technical/30">
            {paginatedLeads.map(lead => {
              const isSanitas = lead.company.toLowerCase().includes('sanitas') || lead.company.toLowerCase().includes('logística');
              const isStale = lead.stage === 'contacted' && (() => {
                const lastActivityDate = new Date(lead.lastContactDate);
                const now = new Date();
                const diffDays = Math.ceil(Math.abs(now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));
                return diffDays > 5;
              })();

              return (
                <tr 
                  key={lead.id} 
                  className="hover:bg-white/[0.02] dark:hover:bg-white/[0.02] border-b border-border-technical/20 transition-all duration-300 group"
                >
                  <td className="p-4 font-bold text-text-main">{lead.name}</td>
                  <td className="p-4 text-text-muted font-mono">{lead.company}</td>
                  <td className="p-4 text-text-main font-mono">${lead.dealValue.toLocaleString()} COP</td>
                  <td className="p-4">
                    <TechnicalStatusBadge 
                      label={stageLabels[lead.stage]} 
                      severity={stageSeverityMap[lead.stage]}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 font-mono font-bold text-primary">
                      <span>{lead.aiScore}%</span>
                      <StatusPulse 
                        variant={lead.aiScore >= 80 ? 'success' : lead.aiScore >= 50 ? 'energy' : 'danger'} 
                        size="xs" 
                        isAnimated={lead.aiScore >= 80} 
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 select-none">
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
                      {lead.relatedQuotesCount && lead.relatedQuotesCount > 0 ? (
                        <TechnicalIndicator 
                          variant="counter" 
                          value={lead.relatedQuotesCount}
                          tooltip={`${lead.name} tiene ${lead.relatedQuotesCount} presupuestos relacionados`}
                        />
                      ) : null}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => onViewDetails(lead.id)} 
                      className="text-primary hover:text-primary/80 font-mono font-bold uppercase tracking-wider text-[10px]"
                    >
                      [ Ver Ficha ]
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-text-muted italic select-none">
                  No se encontraron leads registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-2 border-t border-border-technical/30 pt-4 select-none">
          <LpdText size="xs" className="text-text-muted font-mono">
            PÁGINA {currentPage} DE {totalPages} ({filteredLeads.length} REGISTROS)
          </LpdText>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => goToPage(currentPage - 1)} 
              disabled={currentPage === 1}
              className="border-border-technical text-text-muted rounded-xl"
            >
              Anterior
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => goToPage(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="border-border-technical text-text-muted rounded-xl"
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </TechnicalSurface>
  );
};
