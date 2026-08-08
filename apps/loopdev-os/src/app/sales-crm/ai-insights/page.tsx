'use client';

import React from 'react';
import { 
  LpdText, 
  Heading, 
  TechnicalSurface, 
  Icon, 
  Button
} from '@loopdev/ui';
import { useSalesCrm } from '../context';

export default function AiInsights() {
  const { leads, openLeadInspector } = useSalesCrm();

  const activeLeads = leads
    .filter(l => l.stage !== 'won' && l.stage !== 'lost')
    .sort((a, b) => b.aiScore - a.aiScore);

  return (
    <main className="h-full overflow-y-auto flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-32 custom-scrollbar">
      
      {/* Header Panel */}
      <section className="flex justify-between items-center bg-slate-900/40 p-6 rounded-3xl border border-white/5">
        <div className="flex flex-col gap-1">
          <Heading size="lg" weight="bold" className="text-white tracking-tight uppercase flex items-center gap-2">
            Puntuación Predictiva IA <Icon name="sparkles" size="sm" className="text-primary animate-pulse" />
          </Heading>
          <LpdText size="nano" className="text-slate-400 font-mono tracking-widest uppercase">
            NEURAL_DEAL_SCORING_ENGINE
          </LpdText>
        </div>
      </section>

      {/* Model explanation card */}
      <TechnicalSurface variant="surface" className="p-6 bg-slate-950/40 border border-white/5 rounded-3xl flex flex-col gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20">
            <Icon name="psychology" size="sm" />
          </div>
          <div>
            <Heading as="h3" size="sm" weight="bold" className="text-white uppercase tracking-wider">¿Cómo funciona el scoring predictivo?</Heading>
            <p className="text-xs text-slate-400 mt-0.5">
              Nuestro modelo evalúa más de 15 variables en tiempo real, incluyendo frecuencia de emails, cargos de interlocutores, descargas de recursos (Whitepapers, Specs) e histórico de conversiones del sector.
            </p>
          </div>
        </div>
      </TechnicalSurface>

      {/* Leads List with detailed signals */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-2">
          <Heading size="sm" weight="bold" className="text-white tracking-tight uppercase">
            Clasificación de Probabilidad de Cierre
          </Heading>
          <LpdText size="nano" className="font-mono text-slate-400 tracking-widest uppercase opacity-85">
            RANKED_PROBABILITY_MATRIX
          </LpdText>
        </div>

        <div className="flex flex-col gap-4">
          {activeLeads.map((lead) => (
            <TechnicalSurface
              key={lead.id}
              onClick={() => openLeadInspector(lead.id)}
              className="p-6 bg-slate-950/40 hover:bg-slate-900/50 border border-white/5 hover:border-primary/50 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer transition-all duration-300 shadow-xl group"
            >
              <div className="flex items-center gap-4">
                {/* Score badge */}
                <div className={`w-16 h-16 rounded-2xl border flex flex-col items-center justify-center font-mono shrink-0 ${
                  lead.aiScore >= 80 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : lead.aiScore >= 50 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  <span className="text-lg font-black">{lead.aiScore}%</span>
                  <span className="text-[8px] uppercase tracking-wider font-bold">Prob.</span>
                </div>

                <div className="flex flex-col gap-1">
                  <Heading as="h4" size="sm" weight="bold" className="text-slate-100 group-hover:text-primary transition-colors">{lead.name}</Heading>
                  <span className="text-xs text-slate-400">{lead.company} · Valor: <span className="text-emerald-400 font-bold">${lead.dealValue.toLocaleString()} COP</span></span>
                </div>
              </div>

              {/* Signals and insights */}
              <div className="flex-1 max-w-xl text-xs text-slate-300 italic md:border-l border-white/5 md:pl-6">
                &quot;{lead.aiInsights}&quot;
              </div>

              {/* Status and Action */}
              <div className="flex items-center gap-4 self-end md:self-auto shrink-0">
                <div className="flex flex-col items-end gap-1 font-mono text-[10px]">
                  <span className="text-slate-400">FASE: <span className="text-slate-200 font-bold uppercase">{lead.stage}</span></span>
                  <span className="text-slate-400">CONTACTO: <span className="text-slate-200">{lead.lastContactDate}</span></span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    openLeadInspector(lead.id);
                  }}
                  className="border-white/10 text-slate-300 font-bold"
                >
                  Analizar Ficha
                </Button>
              </div>

            </TechnicalSurface>
          ))}
        </div>
      </section>

    </main>
  );
}
