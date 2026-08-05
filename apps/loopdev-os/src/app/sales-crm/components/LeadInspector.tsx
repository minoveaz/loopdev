'use client';

import React, { useState } from 'react';
import { 
  InspectorPanel, 
  LpdText, 
  Heading, 
  TechnicalSurface, 
  Divider, 
  Icon, 
  Button, 
  StatusPulse,
  Input,
  TechnicalStatusBadge
} from '@loopdev/ui';
import { useSalesCrm } from '../context';

export function LeadInspector() {
  const { selectedLead, isInspectorOpen, closeInspector, updateLeadStage, updateLead, triggerAiBudget } = useSalesCrm();
  const [activeTab, setActiveTab] = useState<'details' | 'ai' | 'history'>('details');
  const [newNote, setNewNote] = useState('');

  if (!isInspectorOpen || !selectedLead) return null;

  const stageSeverityMap: Record<import('../context').Lead['stage'], 'info' | 'warning' | 'danger' | 'success' | 'innovation' | 'neutral' | 'primary'> = {
    lead: 'neutral',
    contacted: 'info',
    proposal: 'innovation',
    negotiation: 'warning',
    won: 'success',
    lost: 'danger',
    rejected: 'danger',
    discarded: 'neutral',
  };

  const stageLabelMap: Record<import('../context').Lead['stage'], string> = {
    lead: 'Nuevo Lead',
    contacted: 'Contactado',
    proposal: 'Propuesta',
    negotiation: 'Negociación',
    won: 'Ganado',
    lost: 'Perdido',
    rejected: 'Rechazado',
    discarded: 'Descartado'
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const updatedLead = {
      ...selectedLead,
      notes: `${newNote}\n\n${selectedLead.notes}`,
      history: [...selectedLead.history, {
      date: new Date().toISOString().split('T')[0],
      action: 'Nota agregada: ' + newNote,
      actor: 'Elena Gómez (Sales)'
      }]
    };
    updateLead(updatedLead);
    setNewNote('');
  };

  // Dynamic telemetry calculations based on AI score for richer insights
  const aiTelemetry = {
    emailSentiment: Math.round(selectedLead.aiScore * 0.9 + 5),
    responseTime: Math.round(selectedLead.aiScore * 0.8 + 15),
    budgetFit: Math.round(selectedLead.aiScore * 0.85 + 10),
    roleAuthority: Math.round(selectedLead.aiScore * 0.75 + 20)
  };

  return (
    <InspectorPanel 
      title={selectedLead.name} 
      subtitle={selectedLead.company} 
      onClose={closeInspector}
    >
      <div className="flex flex-col gap-6 h-full text-slate-200">
        
        {/* Stage Badge & AI Score Summary */}
        <div className="flex justify-between items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
          <div className="flex flex-col gap-1">
            <LpdText size="nano" className="text-slate-400 uppercase tracking-widest mb-1 animate-pulse">Estado Actual</LpdText>
            <TechnicalStatusBadge 
              label={stageLabelMap[selectedLead.stage]} 
              severity={stageSeverityMap[selectedLead.stage]}
              withPulse={selectedLead.stage === 'lead' || selectedLead.stage === 'negotiation'}
            />
          </div>
          <div className="flex items-center gap-3 border-l border-white/5 pl-4">
            <div className="flex flex-col items-end gap-0.5">
              <LpdText size="nano" className="text-slate-400 uppercase tracking-widest">AI Win Probability</LpdText>
              <div className="flex items-center gap-1.5 font-mono">
                <span className={`text-sm font-bold ${selectedLead.aiScore >= 80 ? 'text-emerald-400' : selectedLead.aiScore >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {selectedLead.aiScore}%
                </span>
                <StatusPulse 
                  variant={selectedLead.aiScore >= 80 ? 'success' : selectedLead.aiScore >= 50 ? 'energy' : 'danger'} 
                  size="xs" 
                  isAnimated={selectedLead.aiScore >= 80} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-white/5">
          {(['details', 'ai', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'details' ? 'Detalles' : tab === 'ai' ? 'AI Insights' : 'Historial'}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto animate-in fade-in duration-300">
          {activeTab === 'details' && (
            <div className="flex flex-col gap-6">
              
              {/* Contact Information */}
              <div className="flex flex-col gap-3">
                <Heading size="xs" weight="bold" className="text-slate-400 uppercase tracking-wider">Contacto</Heading>
                <div className="flex flex-col gap-2.5 bg-slate-900/30 p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-mono text-slate-200">{selectedLead.email}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Teléfono:</span>
                    <span className="font-mono text-slate-200">{selectedLead.phone}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Último Contacto:</span>
                    <span className="font-mono text-slate-200">{selectedLead.lastContactDate}</span>
                  </div>
                  <div className="flex justify-between text-xs border-t border-white/5 pt-2 mt-1">
                    <span className="text-slate-400">Valor Estimado:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      ${selectedLead.dealValue.toLocaleString()} COP
                    </span>
                  </div>
                </div>
              </div>

              {/* Modify Lead Stage */}
              <div className="flex flex-col gap-3">
                <Heading size="xs" weight="bold" className="text-slate-400 uppercase tracking-wider">Cambiar Etapa</Heading>
                <div className="grid grid-cols-3 gap-2">
                  {(['lead', 'contacted', 'proposal', 'negotiation', 'won', 'lost'] as const).map((stage) => (
                    <button
                      key={stage}
                      onClick={() => updateLeadStage(selectedLead.id, stage)}
                      className={`text-[9px] uppercase tracking-wider py-2 px-1 rounded-lg border font-bold transition-all ${
                        selectedLead.stage === stage
                          ? 'bg-primary text-white border-primary'
                          : 'bg-slate-950/40 text-slate-400 border-white/5 hover:border-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Note Section */}
              <div className="flex flex-col gap-3">
                <Heading size="xs" weight="bold" className="text-slate-400 uppercase tracking-wider">Bitácora de Notas</Heading>
                <div className="flex flex-col gap-2">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Escribe una actualización o nota..."
                    rows={3}
                    className="w-full bg-slate-950/40 text-slate-200 text-xs p-3 rounded-xl border border-white/5 focus:outline-none focus:border-primary/50 resize-none font-sans"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddNote}
                    className="self-end border-white/10 hover:bg-slate-900 text-slate-300"
                  >
                    Registrar Nota
                  </Button>
                </div>
                {selectedLead.notes && (
                  <div className="bg-slate-950/20 p-4 rounded-xl border border-white/5 text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto">
                    {selectedLead.notes}
                  </div>
                )}
              </div>

            </div>
          )}

          {activeTab === 'ai' && (
            <div className="flex flex-col gap-6">
              
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex gap-3 items-start">
                <div className="p-2 bg-primary/10 text-primary rounded-xl shrink-0">
                  <Icon name="sparkles" size="sm" />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-xs font-bold text-slate-200">Recomendaciones de Copiloto IA</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Sugerencias generadas dinámicamente con base en los correos y el histórico de interacciones.
                  </p>
                </div>
              </div>

              {/* AI Telemetry Gauges */}
              <div className="flex flex-col gap-4">
                <Heading size="xs" weight="bold" className="text-slate-400 uppercase tracking-wider">Métricas de Adherencia (Telemetría IA)</Heading>
                <div className="flex flex-col gap-4 bg-slate-900/30 p-4 rounded-2xl border border-white/5 font-mono text-xs">
                  {/* Gauge 1: Sentiment */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400">ANALYZER_SENTIMENT_RATIO:</span>
                      <span className="text-emerald-400 font-bold">{aiTelemetry.emailSentiment}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${aiTelemetry.emailSentiment}%` }} />
                    </div>
                  </div>

                  {/* Gauge 2: Response Speed */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400">SYS_RESPONSE_LATENCY_FIT:</span>
                      <span className="text-primary font-bold">{aiTelemetry.responseTime}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${aiTelemetry.responseTime}%` }} />
                    </div>
                  </div>

                  {/* Gauge 3: Budget Match */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400">BUDGET_THRESHOLD_MATCH:</span>
                      <span className="text-amber-400 font-bold">{aiTelemetry.budgetFit}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${aiTelemetry.budgetFit}%` }} />
                    </div>
                  </div>

                  {/* Gauge 4: Role Authority */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400">DECISION_MAKER_SCORE:</span>
                      <span className="text-purple-400 font-bold">{aiTelemetry.roleAuthority}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full transition-all duration-1000" style={{ width: `${aiTelemetry.roleAuthority}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Heading size="xs" weight="bold" className="text-slate-400 uppercase tracking-wider">Insights del Negocio</Heading>
                <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 text-xs leading-relaxed text-slate-300 italic font-sans">
                  &quot;{selectedLead.aiInsights}&quot;
                </div>
              </div>

              {/* Action Trigger for PDF / AI Budget Generator */}
              <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
                <Heading size="xs" weight="bold" className="text-slate-400 uppercase tracking-wider">Acciones Inteligentes</Heading>
                <Button 
                  variant="primary" 
                  fullWidth
                  onClick={() => {
                    closeInspector();
                    triggerAiBudget(selectedLead.id);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold flex items-center justify-center gap-2 py-3 rounded-xl border-none font-sans"
                >
                  <Icon name="auto_awesome" size="sm" className="fill-current" /> Generar Presupuesto con IA
                </Button>
              </div>

            </div>
          )}

          {activeTab === 'history' && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <Heading size="xs" weight="bold" className="text-slate-400 uppercase tracking-wider">Auditoría Operacional</Heading>
                <span className="text-[9px] font-mono text-slate-500">TTY: /dev/pts/4</span>
              </div>
              
              {/* Terminal Timeline Container */}
              <div className="bg-black/95 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono text-xs">
                {/* Terminal top bar */}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 border-b border-white/5 select-none">
                  <div className="w-2 h-2 rounded-full bg-rose-500/70" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/70" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/70" />
                  <span className="text-[9px] text-slate-500 font-bold ml-1.5 uppercase">AUDIT_TRAIL_LOG</span>
                </div>
                
                {/* Terminal Body */}
                <div className="p-4 flex flex-col gap-2.5 max-h-[300px] overflow-y-auto custom-scrollbar select-text bg-[#030712]">
                  {selectedLead.history.map((item, idx) => {
                    const actorFormatted = item.actor.toUpperCase().replace(/\s+/g, '_').substring(0, 15);
                    return (
                      <div key={idx} className="flex flex-col gap-0.5 border-b border-white/[0.02] pb-2 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between text-[9px] text-slate-500">
                          <span className="text-primary font-bold">[{item.date}]</span>
                          <span className="text-amber-500 font-bold">SRC: {actorFormatted}</span>
                        </div>
                        <div className="text-slate-300 pl-2 border-l border-primary/20 leading-relaxed font-sans text-xs">
                          {item.action}
                        </div>
                      </div>
                    );
                  })}
                  {selectedLead.history.length === 0 && (
                    <div className="text-slate-600 italic text-center py-4">
                      BUFFER_EMPTY: NO LOGS DETECTED
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Inspector Actions */}
        <div className="flex gap-3 border-t border-white/5 pt-4 mt-auto">
          <Button 
            variant="primary" 
            fullWidth 
            onClick={() => updateLeadStage(selectedLead.id, 'won')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white border-none py-3 font-bold"
          >
            Marcar Como Ganado
          </Button>
          <Button 
            variant="outline" 
            fullWidth 
            onClick={() => updateLeadStage(selectedLead.id, 'lost')}
            className="border-rose-500/20 text-rose-400 hover:bg-rose-500/10 py-3 font-bold"
          >
            Perder Trato
          </Button>
        </div>

      </div>
    </InspectorPanel>
  );
}
