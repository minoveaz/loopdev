'use client';

import React, { useState } from 'react';
import {
  LpdText,
  Heading,
  TechnicalSurface,
  StatusPulse,
  Icon,
  MetricCard,
  Button,
  IndustrialMetric,
} from '@loopdev/ui';
import { useSalesCrm } from './context';
import { useRouter } from 'next/navigation';
import { isLeadStale } from './utils/leadActivity';

export default function SalesCrmDashboard() {
  const router = useRouter();
  const { leads, openLeadInspector } = useSalesCrm();
  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate metrics
  const totalPipeline = leads.reduce((acc, lead) => {
    if (lead.stage !== 'won' && lead.stage !== 'lost') {
      return acc + lead.dealValue;
    }
    return acc;
  }, 0);

  const openDealsCount = leads.filter((l) => l.stage !== 'won' && l.stage !== 'lost').length;
  const wonDealsValue = leads
    .filter((l) => l.stage === 'won')
    .reduce((acc, l) => acc + l.dealValue, 0);
  const avgAiScore = Math.round(leads.reduce((acc, l) => acc + l.aiScore, 0) / leads.length);

  // Calculate Revenue in Risk (stale leads: stage contacted & no contact for > 5 days)
  const staleLeads = leads.filter((lead) => isLeadStale(lead));
  const revenueInRisk = staleLeads.reduce((acc, l) => acc + l.dealValue, 0);

  // Filter high win probability deals
  const highProbabilityLeads = leads
    .filter((l) => l.stage !== 'won' && l.stage !== 'lost')
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 3);

  return (
    <main className="h-full overflow-y-auto flex flex-col gap-8 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-32 custom-scrollbar min-w-0">
      {/* Dashboard Header */}
      <section className="flex flex-col items-stretch gap-5 bg-shell-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6 rounded-3xl border border-border-technical shadow-sm min-w-0">
        <div className="flex flex-col gap-1">
          <Heading size="lg" weight="bold" className="text-text-main tracking-tight uppercase">
            Centro de Mando Comercial
          </Heading>
          <LpdText size="nano" className="text-text-muted font-mono tracking-widest uppercase">
            SAAS_CRM_PIPELINE_ORCHESTRATOR
          </LpdText>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => router.push('/sales-crm/pipeline')}
            className="border-border-technical hover:bg-background-subtle text-text-main font-bold flex-1 sm:flex-none"
          >
            Ver Kanban
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => router.push('/sales-crm/customers')}
            className="bg-primary hover:bg-primary/95 text-white font-bold flex-1 sm:flex-none"
          >
            Directorio Clientes
          </Button>
        </div>
      </section>

      {/* 1. HERO METRICS */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 select-none">
        <IndustrialMetric
          label="Pipeline Abierto"
          value={`$${(totalPipeline / 1000000).toFixed(2)}M`}
          secondaryValue={`${openDealsCount} TRATOS ACTIVOS`}
          trend="up"
        />
        <IndustrialMetric
          label="Revenue in Risk"
          value={`$${(revenueInRisk / 1000).toFixed(0)}k`}
          secondaryValue={`${staleLeads.length} TRATOS ESTANCADOS`}
          trend={revenueInRisk > 0 ? 'down' : 'neutral'}
          valueClassName={revenueInRisk > 0 ? 'text-rose-500' : 'text-text-main'}
        />
        <IndustrialMetric
          label="Ventas Cerradas"
          value={`$${(wonDealsValue / 1000000).toFixed(2)}M`}
          secondaryValue="OBJETIVO DE VENTAS Q3"
          trend="up"
        />
        <IndustrialMetric
          label="AI Win Average"
          value={`${avgAiScore}%`}
          secondaryValue="PROMEDIO DE PROBABILIDAD"
          trend="neutral"
        />
        <IndustrialMetric
          label="Tasa de Cierre"
          value="76.2%"
          secondaryValue="SLA ESTABLECIDO"
          trend="up"
        />
        <IndustrialMetric
          label="Engine AI"
          value="ACTIVO"
          secondaryValue="OPTIMIZATION ACTIVE"
          trend="up"
        />
      </section>

      {/* 2. ANALYTICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Deal distribution bar chart */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <TechnicalSurface
            variant="surface"
            className="p-6 flex flex-col gap-6 bg-shell-surface border border-border-technical shadow-sm rounded-3xl h-[450px]"
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <Heading
                  size="sm"
                  weight="bold"
                  className="text-text-main tracking-tight uppercase"
                >
                  Distribución de Tratos por Etapa
                </Heading>
                <LpdText size="nano" className="text-text-muted font-mono">
                  VALUE_DISTRIBUTION_CHART
                </LpdText>
              </div>
              <StatusPulse variant="energy" size="xs" isAnimated />
            </div>

            {/* Pure CSS Bar Chart */}
            <div className="flex-1 flex flex-col justify-between pt-8">
              <div className="flex h-48 items-end gap-6 px-4">
                {['lead', 'contacted', 'proposal', 'negotiation', 'won'].map((stage) => {
                  const stageLeads = leads.filter((l) => l.stage === stage);
                  const stageValue = stageLeads.reduce((acc, l) => acc + l.dealValue, 0);
                  const maxVal =
                    Math.max(
                      ...['lead', 'contacted', 'proposal', 'negotiation', 'won'].map((s) =>
                        leads.filter((l) => l.stage === s).reduce((acc, l) => acc + l.dealValue, 0),
                      ),
                    ) || 1;
                  const heightPercent = `${Math.max(10, Math.round((stageValue / maxVal) * 100))}%`;

                  return (
                    <div
                      key={stage}
                      className="flex-1 flex flex-col items-center gap-3 h-full justify-end group"
                    >
                      <div className="text-[10px] font-mono text-text-muted group-hover:text-primary font-bold transition-colors">
                        ${(stageValue / 1000).toFixed(0)}k
                      </div>
                      <div
                        className="w-full bg-background-subtle rounded-t-xl group-hover:bg-primary/90 transition-all duration-500 border border-border-technical shadow-inner"
                        style={{ height: heightPercent }}
                      >
                        <div className="w-full h-full bg-gradient-to-t from-background-canvas/80 to-transparent rounded-t-xl opacity-40" />
                      </div>
                      <div className="text-[10px] uppercase font-mono tracking-wider text-text-muted mt-1">
                        {stage} ({stageLeads.length})
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TechnicalSurface>
        </div>

        {/* AI High Probability Leads Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <TechnicalSurface
            variant="surface"
            className="p-6 flex flex-col gap-6 bg-shell-surface border border-border-technical shadow-sm rounded-3xl h-[450px]"
          >
            <div className="flex flex-col gap-1">
              <Heading size="xs" weight="bold" className="text-text-main uppercase tracking-tight">
                AI Smart Leads
              </Heading>
              <LpdText size="nano" className="text-text-muted font-mono">
                HIGH_PROBABILITY_DEALS_QUEUE
              </LpdText>
            </div>

            <div className="flex-1 flex flex-col gap-4 mt-2 overflow-y-auto custom-scrollbar pr-1">
              {highProbabilityLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => openLeadInspector(lead.id)}
                  className="flex justify-between items-center p-3.5 bg-background-subtle rounded-2xl border border-border-technical hover:border-primary/50 cursor-pointer hover:bg-shell-surface transition-all group"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-text-main group-hover:text-primary transition-colors">
                      {lead.name}
                    </span>
                    <span className="text-[10px] text-text-muted">{lead.company}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        ${(lead.dealValue / 1000).toFixed(0)}k
                      </span>
                      <span className="text-[9px] text-text-muted uppercase font-mono">
                        {lead.stage}
                      </span>
                    </div>
                    <div className="bg-primary/10 text-primary font-mono text-[10px] font-bold px-2 py-1 rounded-lg border border-primary/20 flex items-center gap-1">
                      {lead.aiScore}% <Icon name="bolt" size="sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full border-border-technical hover:bg-background-subtle text-text-main font-bold"
              onClick={() => router.push('/sales-crm/ai-insights')}
            >
              Ver Análisis Predictivo Completo
            </Button>
          </TechnicalSurface>
        </div>
      </div>

      {/* 3. RECENT DEALS TABLE */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-2">
          <Heading size="sm" weight="bold" className="text-text-main tracking-tight uppercase">
            Lista Completa de Oportunidades
          </Heading>
          <LpdText
            size="nano"
            className="font-mono text-text-muted tracking-widest uppercase opacity-85"
          >
            ALL_DEALS_INDEX
          </LpdText>
        </div>

        <TechnicalSurface
          variant="surface"
          className="bg-shell-surface border border-border-technical rounded-3xl overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-technical bg-background-subtle text-[10px] uppercase font-mono text-text-muted tracking-wider">
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">Contacto</th>
                  <th className="p-4">Compañía</th>
                  <th className="p-4">Valor del Trato</th>
                  <th className="p-4">Etapa</th>
                  <th className="p-4">AI Score</th>
                  <th className="p-4">Último Contacto</th>
                  <th className="p-4 pr-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-technical/50 text-xs text-text-main">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-background-subtle cursor-pointer transition-colors"
                    onClick={() => openLeadInspector(lead.id)}
                  >
                    <td className="p-4 pl-6 font-mono font-bold text-text-muted">{lead.id}</td>
                    <td className="p-4 font-bold text-text-main">{lead.name}</td>
                    <td className="p-4 text-text-muted">{lead.company}</td>
                    <td className="p-4 font-mono font-bold text-emerald-400">
                      ${lead.dealValue.toLocaleString()} COP
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                          lead.stage === 'won'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : lead.stage === 'lost'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : lead.stage === 'negotiation'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}
                      >
                        {lead.stage}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span
                          className={
                            lead.aiScore >= 80
                              ? 'text-emerald-400 font-bold'
                              : lead.aiScore >= 50
                                ? 'text-amber-400'
                                : 'text-rose-400'
                          }
                        >
                          {lead.aiScore}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-text-muted">{lead.lastContactDate}</td>
                    <td className="p-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openLeadInspector(lead.id)}
                        className="text-primary hover:bg-primary/10"
                      >
                        Ver Ficha
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TechnicalSurface>
      </section>
    </main>
  );
}
