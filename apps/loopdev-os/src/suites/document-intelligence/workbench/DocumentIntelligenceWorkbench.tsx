'use client';

import { useState } from 'react';
import { Button, EmptyState, TechnicalSurface } from '@loopdev/ui';

import { DocumentIntakePane } from './DocumentIntakePane';
import { ExtractionReviewForm } from './ExtractionReviewForm';
import { UsageCostPanel } from './UsageCostPanel';
import { useWorkbenchPrototype } from './workbench-context';
import type { WorkbenchTab } from './types';

const WORKBENCH_TABS: Array<{ id: WorkbenchTab; label: string }> = [
  { id: 'fields', label: 'Datos extraídos' },
  { id: 'usage', label: 'Uso y coste' },
];

/**
 * Composición RecordWorkspace del Document Intelligence Workbench (prototipo
 * navegable de Fase 0, guiado por fixtures). Regiones: header (ModuleHeader
 * vía shell), tabs locales, record (preview + revisión) e inspector
 * contextual (ModuleContextPanel vía shell).
 */
export function DocumentIntelligenceWorkbench() {
  const { flowState, error, retryExtraction, resetWorkbench } = useWorkbenchPrototype();
  const [activeTab, setActiveTab] = useState<WorkbenchTab>('fields');

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {flowState === 'processing' ? (
        <TechnicalSurface
          variant="surface"
          className="flex min-h-[320px] flex-1 items-center justify-center rounded-xl"
        >
          <EmptyState
            variant="ai"
            isLoading
            icon="document_scanner"
            title="Extrayendo datos del documento"
            description="El documento se procesa en servidor. Ningún dato sale del perímetro del tenant."
            loadingMessages={[
              'Preparando documento…',
              'Clasificando tipo de documento…',
              'Extrayendo campos de identidad…',
              'Normalizando resultados…',
            ]}
          />
        </TechnicalSurface>
      ) : null}

      {flowState === 'error' && error ? (
        <TechnicalSurface
          variant="surface"
          className="flex min-h-[320px] flex-1 items-center justify-center rounded-xl"
        >
          <EmptyState
            status="error"
            variant="card"
            icon="error"
            title="No se pudo completar la extracción"
            description={`Error ${error.status}. ${error.message}`}
            action={
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button variant="primary" size="sm" startIcon="refresh" onClick={retryExtraction}>
                  Reintentar
                </Button>
                <Button variant="outline" size="sm" onClick={resetWorkbench}>
                  Cambiar documento
                </Button>
                <Button variant="ghost" size="sm" onClick={resetWorkbench}>
                  Extraer nuevo
                </Button>
              </div>
            }
          />
        </TechnicalSurface>
      ) : null}

      {flowState === 'preparation' || flowState === 'review' ? (
        <div
          className={
            flowState === 'preparation'
              ? 'min-h-0 flex-1'
              : 'grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-2'
          }
        >
          <DocumentIntakePane />

          {flowState === 'review' ? (
            <TechnicalSurface variant="surface" className="flex min-h-0 flex-col rounded-xl">
              <div
                role="tablist"
                aria-label="Secciones de la extracción"
                className="border-border-subtle flex gap-1 border-b px-4 pt-3"
              >
                {WORKBENCH_TABS.map((tab) => (
                  <Button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    variant={activeTab === tab.id ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>

              <div
                role="tabpanel"
                aria-label={WORKBENCH_TABS.find((tab) => tab.id === activeTab)?.label}
                className="min-h-0 flex-1 overflow-y-auto p-4"
              >
                {activeTab === 'fields' ? <ExtractionReviewForm /> : null}
                {activeTab === 'usage' ? <UsageCostPanel /> : null}
              </div>
            </TechnicalSurface>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
