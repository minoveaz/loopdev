'use client';

import React from 'react';
import { LpdText, BlueprintBackground, TechnicalCard } from '../../../atoms';
import { SuiteHomeLayoutProps } from './types';
import { SuiteHomeHero } from './SuiteHomeHero';
import { SystemNoticeRail } from '../../utilities/SystemNoticeRail';
import { SuiteHomeQuickStart } from './SuiteHomeQuickStart';
import { SuiteHomeInsights } from './SuiteHomeInsights';
import { SuiteHomeModules } from './SuiteHomeModules';
import { ActivityFeed } from '../../utilities/ActivityFeed';

/**
 * @component SuiteHomeLayout
 * @description Chasis Maestro de Suite (v3.9).
 * Impone un orden industrial basado en un grid de 12 columnas con cabeceras unificadas.
 */
export const SuiteHomeLayout: React.FC<SuiteHomeLayoutProps & { status?: string }> = (props) => {
  const { 
    title, 
    subtitle, 
    contextLine,
    icon,
    tone,
    status,
    notices = [],
    quickActions = [],
    metrics = [],
    modules = [],
    activity = [],
    userState = 'active',
    onViewActivityAll,
    modulesTitle = 'Suite Modules',
    insightsTitle = 'Key Metrics',
    className = ''
  } = props;

  // Helper para Títulos de Sección (ADN Industrial)
  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center justify-between mb-6">
      <LpdText size="xs" weight="bold" className="text-text-muted uppercase tracking-widest">
        {`// ${title}`}
      </LpdText>
    </div>
  );

  // 1. Lógica de Prioridad Dinámica
  const renderActivationLayer = () => {
    const quickStart = (
      <div className="flex flex-col">
        <SectionHeader title="Quick Start" />
        <SuiteHomeQuickStart actions={quickActions} />
      </div>
    );
    const insights = (
      <div className="flex flex-col">
        <SectionHeader title={insightsTitle} />
        <SuiteHomeInsights metrics={metrics} />
      </div>
    );

    if (userState === 'new') {
      return (
        <>
          <div className="col-span-12 xl:col-span-8">{quickStart}</div>
          <div className="col-span-12 xl:col-span-4">{insights}</div>
        </>
      );
    }

    return (
      <>
        <div className="col-span-12 xl:col-span-4">{insights}</div>
        <div className="col-span-12 xl:col-span-8">{quickStart}</div>
      </>
    );
  };

  // 2. Helper para renderizar el feed con el envoltorio industrial
  const renderActivityCard = (gridClasses: string) => (
    <aside className={gridClasses}>
      <SectionHeader title="Recent Activity" />
      <TechnicalCard variant="interactive" className="p-6 shadow-sm">
        <ActivityFeed 
          items={activity as any} 
          onViewAll={onViewActivityAll}
        />
      </TechnicalCard>
    </aside>
  );

  return (
    <div className={`relative flex flex-col w-full h-full bg-shell-canvas ${className}`}>
      {/* 0. ATMÓSFERA: Grilla Técnica de 40px */}
      <BlueprintBackground variant="monochrome" className="fixed inset-0" intensity="high" />
      
      <div className="relative z-10 flex flex-col flex-1 min-h-0">
        {/* 1. ORIENTACIÓN: Hero & Gobernanza */}
        <SuiteHomeHero 
          title={title} 
          subtitle={subtitle} 
          contextLine={contextLine}
          icon={icon}
          tone={tone}
          status={status}
        />
        
        {/* GOBERNANZA OPERATIVA (New SystemNoticeRail) */}
        <SystemNoticeRail 
          notices={notices} 
          className="mt-2"
        />

        {/* 2. CENTRO DE COMANDO (Área Principal) */}
        <main className="flex-1 px-8 py-10 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1600px] mx-auto flex flex-col gap-16">
            
            {/* SECCIÓN A: ACTIVACIÓN (Métricas y Acciones) */}
            <section className="grid grid-cols-12 gap-8 items-start">
              {renderActivationLayer()}
            </section>

            {/* SECCIÓN B: OPERACIÓN (Módulos y Memoria) */}
            <section className="grid grid-cols-12 gap-12 items-start">
              
              {/* Bloque Izquierdo: Módulos (8 cols en XL) */}
              <div className="col-span-12 xl:col-span-8 flex flex-col gap-10">
                <div className="flex flex-col">
                  <SectionHeader title={modulesTitle} />
                  <SuiteHomeModules modules={modules} />
                </div>
                
                {/* MODO TABLET/LAPTOP: Timeline al final del bloque de módulos */}
                <div className="hidden lg:block xl:hidden">
                  {renderActivityCard("col-span-12")}
                </div>
              </div>

              {/* Bloque Derecho: Actividad (4 cols en XL) */}
              {renderActivityCard("hidden xl:block xl:col-span-4 sticky top-8")}

              {/* MODO MOBILE: Timeline al final de todo */}
              <div className="col-span-12 lg:hidden mt-8">
                {renderActivityCard("col-span-12")}
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
};