'use client';

import React, { useState } from 'react';
import { 
  LpdText, 
  Heading, 
  TechnicalSurface, 
  Icon, 
  Button,
  StatusPulse
} from '@loopdev/ui';
import { useSalesCrm } from '../context';

export default function CustomersDirectory() {
  const { leads, openLeadInspector } = useSalesCrm();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter won or proposal stage customers as they are actual active / pre-active clients
  const activeCustomers = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalContractedVal = leads.filter(l => l.stage === 'won').reduce((acc, l) => acc + l.dealValue, 0);

  return (
    <main className="h-full overflow-y-auto flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-32 custom-scrollbar">
      
      {/* Header Panel */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-shell-surface p-6 rounded-3xl border border-border-technical">
        <div className="flex flex-col gap-1">
          <Heading size="lg" weight="bold" className="text-text-main tracking-tight uppercase">
            Directorio de Clientes
          </Heading>
          <LpdText size="nano" className="text-text-muted font-mono tracking-widest uppercase">
            CLIENT_ONBOARDING_DIRECTORY
          </LpdText>
        </div>
        
        {/* Search Input */}
        <div className="flex items-center gap-3 bg-background-canvas px-4 py-2.5 rounded-xl border border-border-technical w-full md:w-80">
          <Icon name="search" size="sm" className="text-text-muted" />
          <input 
            type="text" 
            placeholder="Buscar por cliente, empresa, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-xs text-text-main placeholder:text-text-muted w-full"
          />
        </div>
      </section>

      {/* Directory Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-background-canvas p-5 rounded-2xl border border-border-technical flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Total Cuentas Activas</span>
            <span className="text-2xl font-bold font-mono text-text-main">{leads.filter(l => l.stage === 'won').length} Empresas</span>
          </div>
          <div className="p-3 bg-status-success/10 text-status-success rounded-xl border border-status-success/20">
            <Icon name="business" size="sm" />
          </div>
        </div>
        <div className="bg-background-canvas p-5 rounded-2xl border border-border-technical flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Facturación Anualizada</span>
            <span className="text-2xl font-bold font-mono text-status-success">${(totalContractedVal / 1000000).toFixed(2)}M COP</span>
          </div>
          <div className="p-3 bg-status-info/10 text-status-info rounded-xl border border-status-info/20">
            <Icon name="payments" size="sm" />
          </div>
        </div>
        <div className="bg-background-canvas p-5 rounded-2xl border border-border-technical flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">SLA de Soporte Promedio</span>
            <span className="text-2xl font-bold font-mono text-text-main">99.8% Cumplimiento</span>
          </div>
          <div className="p-3 bg-innovation-purple/10 text-innovation-purple rounded-xl border border-innovation-purple/20">
            <Icon name="check_circle" size="sm" />
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCustomers.length === 0 ? (
          <div className="col-span-full py-16 text-center text-text-muted flex flex-col items-center justify-center gap-3">
            <Icon name="search_off" size="md" className="opacity-40" />
            <span className="text-xs font-mono uppercase tracking-wider">No se encontraron clientes coincidentes</span>
          </div>
        ) : (
          activeCustomers.map((customer) => (
            <TechnicalSurface 
              key={customer.id} 
              variant="surface"
              onClick={() => openLeadInspector(customer.id)}
              className="p-6 bg-background-canvas hover:bg-shell-surface border border-border-technical hover:border-primary/50 rounded-3xl flex flex-col gap-4 transition-all duration-300 cursor-pointer shadow-xl group"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-0.5">
                  <Heading as="h4" size="sm" weight="bold" className="text-text-main group-hover:text-primary transition-colors">{customer.name}</Heading>
                  <span className="text-xs text-text-muted font-medium">{customer.company}</span>
                </div>
                <div className="p-2 bg-shell-surface text-text-muted rounded-xl border border-border-technical">
                  <Icon name="person" size="sm" />
                </div>
              </div>

              <div className="flex flex-col gap-2 bg-shell-surface/30 p-4 rounded-2xl border border-border-technical text-xs font-mono">
                <div className="flex justify-between text-text-muted">
                  <span>Email:</span>
                  <span className="text-text-main">{customer.email}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Tel:</span>
                  <span className="text-text-main">{customer.phone}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Valor Cuenta:</span>
                  <span className="text-status-success font-bold">${customer.dealValue.toLocaleString()} COP</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-2 border-t border-border-technical pt-3">
                <span className={`text-[9px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full border ${
                  customer.stage === 'won' 
                    ? 'bg-status-success/10 text-status-success border-status-success/20'
                    : 'bg-status-info/10 text-status-info border-status-info/20'
                }`}>
                  {customer.stage === 'won' ? 'Cuenta Activa' : `Fase: ${customer.stage}`}
                </span>
                <span className="text-[10px] text-text-muted font-mono flex items-center gap-1.5">
                  <StatusPulse variant={customer.status === 'active' ? 'success' : 'energy'} size="xs" />
                  {customer.status.toUpperCase()}
                </span>
              </div>
            </TechnicalSurface>
          ))
        )}
      </section>

    </main>
  );
}
