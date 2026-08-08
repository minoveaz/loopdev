'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  LpdText, 
  Heading, 
  TechnicalSurface, 
  StatusPulse, 
  Icon, 
  MetricCard,
  Button
} from '@loopdev/ui';

export default function HealthOsDashboard() {
  const router = useRouter();

  return (
    <main className="h-full overflow-y-auto flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-32 custom-scrollbar">
      
      {/* 1. CLINICAL METRICS GRID */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard 
          label="Admitted Today" 
          value="48" 
          delta="+12%" 
          trend="up" 
          icon="group" 
          colorClassName="text-status-success"
        />
        <MetricCard 
          label="Active in Triage" 
          value="5" 
          trend="neutral" 
          icon="emergency" 
          colorClassName="text-status-warning"
        />
        <MetricCard 
          label="In Consultations" 
          value="8" 
          icon="medical_services" 
          colorClassName="text-status-info"
        />
        <MetricCard 
          label="Pending Sign-off" 
          value="14" 
          icon="edit_note" 
          colorClassName="text-innovation-purple"
        />
        <MetricCard 
          label="SLA Compliance" 
          value="96.4%" 
          delta="Optimal" 
          trend="up" 
          icon="schedule" 
          colorClassName="text-status-success"
        />
        <MetricCard 
          label="System Status" 
          value="Online" 
          icon="cloud_done" 
          colorClassName="text-status-success"
        />
      </section>

      {/* 2. OPERATIONAL AREAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Core clinical modules */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <TechnicalSurface variant="surface" className="p-6 flex flex-col gap-6 bg-shell-surface border-border-technical shadow-sm rounded-3xl">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <Heading size="sm" weight="bold" className="text-text-main tracking-tight">
                  Clinical Workspace Stations
                </Heading>
                <LpdText size="nano" className="text-text-muted font-mono">
                  ZONAMEDICA_CLINICAL_QUEUE
                </LpdText>
              </div>
              <StatusPulse variant="energy" size="xs" isAnimated />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <TechnicalSurface variant="surface" className="p-6 flex flex-col gap-4 border-border-technical bg-background-subtle hover:bg-shell-surface transition-colors rounded-2xl">
                <div className="p-3 bg-status-success/10 text-status-success rounded-xl w-fit">
                  <Icon name="calendar_month" size="sm" />
                </div>
                <div>
                  <Heading as="h4" size="sm" weight="bold" className="text-text-main">1. Agenda & Citas</Heading>
                  <p className="text-xs text-text-muted mt-1">Admisión y recepción de pacientes. Asignación automática de rutas según profesiograma.</p>
                </div>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => router.push('/health-os/agenda')}
                >
                  Abrir Agenda
                </Button>
              </TechnicalSurface>

              <TechnicalSurface variant="surface" className="p-6 flex flex-col gap-4 border-border-technical bg-background-subtle hover:bg-shell-surface transition-colors rounded-2xl">
                <div className="p-3 bg-status-warning/10 text-status-warning rounded-xl w-fit">
                  <Icon name="emergency" size="sm" />
                </div>
                <div>
                  <Heading as="h4" size="sm" weight="bold" className="text-text-main">2. Clasificación Triage</Heading>
                  <p className="text-xs text-text-muted mt-1">Evaluación de signos vitales y priorización asistencial según niveles obligatorios.</p>
                </div>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => router.push('/health-os/triage')}
                >
                  Abrir Triage
                </Button>
              </TechnicalSurface>

              <TechnicalSurface variant="surface" className="p-6 flex flex-col gap-4 border-border-technical bg-background-subtle hover:bg-shell-surface transition-colors rounded-2xl">
                <div className="p-3 bg-status-info/10 text-status-info rounded-xl w-fit">
                  <Icon name="rate_review" size="sm" />
                </div>
                <div>
                  <Heading as="h4" size="sm" weight="bold" className="text-text-main">3. Consultas HCE</Heading>
                  <p className="text-xs text-text-muted mt-1">Diligenciamiento de SOAP, códigos CIE-10 e inyección de firma para certificados.</p>
                </div>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => router.push('/health-os/consultations')}
                >
                  Ver Consultorio
                </Button>
              </TechnicalSurface>

            </div>
          </TechnicalSurface>
        </div>

        {/* Commercial / administrative summary */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <TechnicalSurface variant="surface" className="p-6 flex flex-col gap-6 bg-shell-surface border-border-technical shadow-sm rounded-3xl h-full">
            <div className="flex flex-col gap-1">
              <Heading size="xs" weight="bold" className="text-text-main uppercase tracking-tight">
                Billing & Contracts
              </Heading>
              <LpdText size="nano" className="text-text-muted font-mono">
                KAM_OPERATIONS_CONTROL
              </LpdText>
            </div>

            <div className="flex-1 flex flex-col gap-4 mt-2">
              <div className="flex justify-between items-center text-xs p-3 bg-background-subtle rounded-xl">
                <span className="text-text-muted font-semibold">Active Corporate Clients:</span>
                <span className="font-mono text-text-main font-black">24 Empresas</span>
              </div>
              <div className="flex justify-between items-center text-xs p-3 bg-background-subtle rounded-xl">
                <span className="text-text-muted font-semibold">Postpaid Outstanding:</span>
                <span className="font-mono text-text-main font-black">$12,450,000 COP</span>
              </div>
              <div className="flex justify-between items-center text-xs p-3 bg-background-subtle rounded-xl">
                <span className="text-text-muted font-semibold">RIPS Status (JSON 2275):</span>
                <span className="font-semibold text-status-success flex items-center gap-1">
                  <Icon name="check_circle" size="sm" /> Validado
                </span>
              </div>
            </div>

            <Button 
              variant="primary"
              className="w-full mt-2"
              onClick={() => router.push('/health-os/contracts')}
            >
              Gestionar Cuentas (KAM)
            </Button>
          </TechnicalSurface>
        </div>

      </div>

    </main>
  );
}
