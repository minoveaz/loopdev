'use client';

import React, { useState, useMemo } from 'react';
import { 
  LpdText, 
  Heading, 
  TechnicalSurface, 
  Button,
  KanbanBoard,
  cn
} from '@loopdev/ui';
import { useSalesCrm, Lead, type LeadLabel } from '../context';
import { PipelineFilters } from '../components/PipelineFilters';
import { PipelineCard } from '../components/PipelineCard';
import { LeadHistory } from '../components/LeadHistory';
import { QuotationForm } from '../components/QuotationForm';

export default function PipelineKanban() {
  const { leads, openLeadInspector, updateLeadStage, addLead } = useSalesCrm();
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'pipeline' | 'history'>('pipeline');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState<'all' | 'Sanitas' | 'Adeslas'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | string>('all');
  const [timeFilter, setTimeFilter] = useState<'7d' | '14d' | '30d' | 'all'>('30d');
  const [assigneeFilter, setAssigneeFilter] = useState<string[]>([]);
  const [labelFilter, setLabelFilter] = useState<LeadLabel[]>([]);



  const stages: Array<{ id: Lead['stage']; title: string; bgClass: string; headerClass: string }> = [
    { id: 'lead', title: 'Nuevo Lead', bgClass: 'bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/40 shadow-sm', headerClass: 'border-l-2 border-slate-400 pl-2' },
    { id: 'contacted', title: 'Contactado', bgClass: 'bg-blue-50/40 dark:bg-blue-950/15 border border-blue-100/30 dark:border-blue-900/30 shadow-sm', headerClass: 'border-l-2 border-blue-500 pl-2' },
    { id: 'proposal', title: 'Propuesta', bgClass: 'bg-purple-50/40 dark:bg-purple-950/15 border border-purple-100/30 dark:border-purple-900/30 shadow-sm', headerClass: 'border-l-2 border-purple-500 pl-2' },
    { id: 'negotiation', title: 'Negociación', bgClass: 'bg-amber-50/40 dark:bg-amber-950/15 border border-amber-100/30 dark:border-amber-900/30 shadow-sm', headerClass: 'border-l-2 border-amber-500 pl-2' },
    { id: 'won', title: 'Ganado', bgClass: 'bg-emerald-50/40 dark:bg-emerald-950/15 border border-emerald-100/30 dark:border-emerald-900/30 shadow-sm', headerClass: 'border-l-2 border-emerald-500 pl-2' },
    { id: 'rejected', title: 'Rechazado', bgClass: 'bg-rose-50/40 dark:bg-rose-950/15 border border-rose-100/30 dark:border-rose-900/30 shadow-sm', headerClass: 'border-l-2 border-rose-500 pl-2' },
    { id: 'discarded', title: 'Descartado', bgClass: 'bg-slate-100/40 dark:bg-slate-900/15 border border-slate-200/30 dark:border-slate-800/30 shadow-sm', headerClass: 'border-l-2 border-slate-400 pl-2' }
  ];

  // Client-side filtering logic
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // 1. Search filter
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        lead.name.toLowerCase().includes(lowerSearch) ||
        lead.company.toLowerCase().includes(lowerSearch) ||
        lead.notes.toLowerCase().includes(lowerSearch);

      // 2. Company filter
      const matchesCompany = companyFilter === 'all' || 
        lead.company.toLowerCase() === companyFilter.toLowerCase();

      // 3. Time filter (Leads creados / lastContactDate)
      let matchesTime = true;
      if (timeFilter !== 'all') {
        const contactDate = new Date(lead.lastContactDate);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate.getTime() - contactDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (timeFilter === '7d') matchesTime = diffDays <= 7;
        else if (timeFilter === '14d') matchesTime = diffDays <= 14;
        else if (timeFilter === '30d') matchesTime = diffDays <= 30;
      }

      // 4. Assignee filter
      const matchesAssignee = assigneeFilter.length === 0 || assigneeFilter.includes(lead.assignee);

      // 5. Label filter
      const matchesLabel = labelFilter.length === 0 || labelFilter.some(l => lead.labels.includes(l));

      return matchesSearch && matchesCompany && matchesTime && matchesAssignee && matchesLabel;
    });
  }, [leads, searchTerm, companyFilter, timeFilter, assigneeFilter, labelFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setCompanyFilter('all');
    setSourceFilter('all');
    setTimeFilter('30d');
    setAssigneeFilter([]);
    setLabelFilter([]);
  };

  const handleCreateLead = (leadData: Omit<Lead, 'id' | 'aiScore' | 'aiInsights' | 'history'>) => {
    addLead(leadData);
    setShowAddForm(false);
  };

  return (
    <main className="h-full overflow-hidden flex flex-col gap-6 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-16">
      
      {/* Header Panel */}
      <TechnicalSurface 
        variant="surface" 
        depth="raised" 
        className="rounded-3xl border border-slate-200 dark:border-white/5 shrink-0 overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 w-full h-full">
          <div className="flex flex-col gap-1">
            <Heading size="lg" weight="bold" className="text-slate-900 dark:text-white tracking-tight uppercase">
              Embudo de Ventas (Pipeline)
            </Heading>
            <LpdText size="nano" className="text-slate-500 dark:text-slate-400 font-mono tracking-widest uppercase">
              KANBAN_DEAL_BOARD_FLOW
            </LpdText>
          </div>
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => setShowAddForm(!showAddForm)}
            className="whitespace-nowrap flex-shrink-0"
          >
            <span className="flex items-center gap-2 justify-center">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              <span>Nuevo Lead</span>
            </span>
          </Button>
        </div>
      </TechnicalSurface>

      {/* Add Lead Form (QuotationForm) */}
      <QuotationForm 
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleCreateLead}
      />

      {/* Sub-navigation Tabs */}
      <div className="flex border-b border-border-technical/60 shrink-0 gap-2">
        <button 
          onClick={() => setActiveTab('pipeline')} 
          className={cn(
            "px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2",
            activeTab === 'pipeline' 
              ? 'text-primary border-primary' 
              : 'text-text-muted border-transparent hover:text-text-main'
          )}
        >
          Pipeline
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          className={cn(
            "px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2",
            activeTab === 'history' 
              ? 'text-primary border-primary' 
              : 'text-text-muted border-transparent hover:text-text-main'
          )}
        >
          Historial de Leads
        </button>
      </div>

      {activeTab === 'pipeline' ? (
        <>
          {/* Filters Bar */}
          <PipelineFilters
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            companyFilter={companyFilter}
            onCompanyFilterChange={setCompanyFilter}
            sourceFilter={sourceFilter}
            onSourceFilterChange={setSourceFilter}
            timeFilter={timeFilter}
            onTimeFilterChange={setTimeFilter}
            assigneeFilter={assigneeFilter}
            onAssigneeFilterChange={setAssigneeFilter}
            labelFilter={labelFilter}
            onLabelFilterChange={setLabelFilter}
            onClearFilters={clearFilters}
          />

          {/* Kanban Board Container */}
          <div className="flex-1 overflow-hidden">
            <KanbanBoard<Lead>
              columns={stages}
              items={filteredLeads}
              getColumnId={(l) => l.stage}
              getItemId={(l) => l.id}
              onCardDrop={async (itemId, targetColumnId) => {
                updateLeadStage(itemId, targetColumnId as Lead['stage']);
              }}
              getColumnMetrics={(columnId, items) => {
                const filtered = items.filter((l) => l.stage === columnId);
                const totalValue = filtered.reduce((acc, l) => acc + l.dealValue, 0);
                return {
                  count: filtered.length,
                  valueLabel: `$${(totalValue / 1000).toFixed(0)}k COP`,
                };
              }}
              renderCard={(lead) => (
                <PipelineCard 
                  lead={lead} 
                  onClick={() => openLeadInspector(lead.id)} 
                />
              )}
            />
          </div>
        </>
      ) : (
        <LeadHistory leads={leads} onViewDetails={openLeadInspector} />
      )}

    </main>
  );
}
