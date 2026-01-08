'use client';

import React from 'react';
import { LpdText, BlueprintBackground } from '../../../atoms';
import { SuiteHomeLayoutProps } from './types';
import { SuiteHomeHero } from './SuiteHomeHero';
import { SuiteHomeNotices } from './SuiteHomeNotices';
import { SuiteHomeQuickStart } from './SuiteHomeQuickStart';
import { SuiteHomeInsights } from './SuiteHomeInsights';
import { SuiteHomeModules } from './SuiteHomeModules';
import { ActivityFeed } from '../../utilities/ActivityFeed';

/**
 * @component SuiteHomeLayout
 * @description Chasis Maestro de Suite (v3.0).
 * Impone un orden industrial basado en un grid de 12 columnas.
 */
export const SuiteHomeLayout: React.FC<SuiteHomeLayoutProps> = (props) => {
  const { 
    title, 
    subtitle, 
    contextLine, 
    notices = [],
    quickActions = [],
    metrics = [],
    modules = [],
    activity = [],
    userState = 'active',
    onViewActivityAll,
    className = ''
  } = props;

  return (
    <div className={`relative flex flex-col w-full min-h-screen bg-shell-canvas ${className}`}>
      {/* 0. ATMÓSFERA: Grilla Técnica de 40px */}
      <BlueprintBackground variant="monochrome" className="fixed inset-0" intensity="high" />
      
      <div className="relative z-10 flex flex-col flex-1">
        {/* 1. ORIENTACIÓN: Hero & Gobernanza */}
        <SuiteHomeHero 
          title={title} 
          subtitle={subtitle} 
          contextLine={contextLine} 
        />
        <SuiteHomeNotices notices={notices} />

        {/* 2. CENTRO DE COMANDO (Área Principal) */}
        <main className="flex-1 px-8 py-10">
          <div className="max-w-[1600px] mx-auto flex flex-col gap-16">
            
            {/* SECCIÓN A: MÉTRICAS Y ACCIONES (ACTIVACIÓN) */}
            <section className="grid grid-cols-12 gap-8 items-start">
              <div className="col-span-12 lg:col-span-8">
                <SuiteHomeQuickStart actions={quickActions} />
              </div>
              <div className="col-span-12 lg:col-span-4">
                <SuiteHomeInsights metrics={metrics} />
              </div>
            </section>

            {/* SECCIÓN B: ESTACIONES Y MEMORIA (OPERACIÓN) */}
            <section className="grid grid-cols-12 gap-12 items-start">
              {/* Bloque Izquierdo: Módulos (8 cols) */}
              <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
                <SuiteHomeModules modules={modules} />
              </div>

              {/* Bloque Derecho: Actividad (4 cols) */}
              <aside className="col-span-12 xl:col-span-4 sticky top-8">
                <div className="p-6 bg-surface-elevated border border-border-technical rounded-2xl shadow-sm">
                  <ActivityFeed 
                    items={activity as any} 
                    title="System Activity" 
                    onViewAll={onViewActivityAll}
                  />
                </div>
              </aside>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
};