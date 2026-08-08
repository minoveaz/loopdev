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
          colorClassName="text-emerald-600" 
        />
        <MetricCard 
          label="Active in Triage" 
          value="5" 
          trend="neutral" 
          icon="emergency" 
          colorClassName="text-amber-500" 
        />
        <MetricCard 
          label="In Consultations" 
          value="8" 
          icon="medical_services" 
          colorClassName="text-blue-500" 
        />
        <MetricCard 
          label="Pending Sign-off" 
          value="14" 
          icon="edit_note" 
          colorClassName="text-purple-500" 
        />
        <MetricCard 
          label="SLA Compliance" 
          value="96.4%" 
          delta="Optimal" 
          trend="up" 
          icon="schedule" 
          colorClassName="text-emerald-600" 
        />
        <MetricCard 
          label="System Status" 
          value="Online" 
          icon="cloud_done" 
          colorClassName="text-emerald-600" 
        />
      </section>

      {/* 2. OPERATIONAL AREAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Core clinical modules */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <TechnicalSurface variant="surface" className="p-6 flex flex-col gap-6 bg-white border border-slate-100 shadow-sm rounded-3xl">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <Heading size="sm" weight="bold" className="text-slate-800 tracking-tight">
                  Clinical Workspace Stations
                </Heading>
                <LpdText size="nano" className="text-slate-400 font-mono">
                  ZONAMEDICA_CLINICAL_QUEUE
                </LpdText>
              </div>
              <StatusPulse variant="energy" size="xs" isAnimated />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <TechnicalSurface variant="surface" className="p-6 flex flex-col gap-4 border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors rounded-2xl">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
                  <Icon name="calendar_month" size="sm" />
                </div>
                <div>
                  <Heading as="h4" size="sm" weight="bold" className="text-slate-800">1. Agenda & Citas</Heading>
                  <p className="text-xs text-slate-500 mt-1">Admisión y recepción de pacientes. Asignación automática de rutas según profesiograma.</p>
                </div>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => router.push('/health-os/agenda')}
                >
                  Abrir Agenda
                </Button>
              </TechnicalSurface>

              <TechnicalSurface variant="surface" className="p-6 flex flex-col gap-4 border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors rounded-2xl">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit">
                  <Icon name="emergency" size="sm" />
                </div>
                <div>
                  <Heading as="h4" size="sm" weight="bold" className="text-slate-800">2. Clasificación Triage</Heading>
                  <p className="text-xs text-slate-500 mt-1">Evaluación de signos vitales y priorización asistencial según niveles obligatorios.</p>
                </div>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => router.push('/health-os/triage')}
                >
                  Abrir Triage
                </Button>
              </TechnicalSurface>

              <TechnicalSurface variant="surface" className="p-6 flex flex-col gap-4 border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors rounded-2xl">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit">
                  <Icon name="rate_review" size="sm" />
                </div>
                <div>
                  <Heading as="h4" size="sm" weight="bold" className="text-slate-800">3. Consultas HCE</Heading>
                  <p className="text-xs text-slate-500 mt-1">Diligenciamiento de SOAP, códigos CIE-10 e inyección de firma para certificados.</p>
                </div>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white"
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
          <TechnicalSurface variant="surface" className="p-6 flex flex-col gap-6 bg-white border border-slate-100 shadow-sm rounded-3xl h-full">
            <div className="flex flex-col gap-1">
              <Heading size="xs" weight="bold" className="text-slate-800 uppercase tracking-tight">
                Billing & Contracts
              </Heading>
              <LpdText size="nano" className="text-slate-400 font-mono">
                KAM_OPERATIONS_CONTROL
              </LpdText>
            </div>

            <div className="flex-1 flex flex-col gap-4 mt-2">
              <div className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600 font-semibold">Active Corporate Clients:</span>
                <span className="font-mono text-slate-800 font-black">24 Empresas</span>
              </div>
              <div className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600 font-semibold">Postpaid Outstanding:</span>
                <span className="font-mono text-slate-800 font-black">$12,450,000 COP</span>
              </div>
              <div className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600 font-semibold">RIPS Status (JSON 2275):</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <Icon name="check_circle" size="sm" /> Validado
                </span>
              </div>
            </div>

            <Button 
              variant="primary"
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
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
