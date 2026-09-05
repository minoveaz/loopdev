'use client';

import { useState } from 'react';
import {
  AIFeedbackSurface,
  Button,
  EmptyState,
  LogoSpinner,
  LpdText,
  TechnicalSurface,
} from '@loopdev/ui';

import { DocumentIntakePane } from './DocumentIntakePane';
import { ExtractionReviewForm } from './ExtractionReviewForm';
import { UsageCostPanel } from './UsageCostPanel';
import { useWorkbenchPrototype } from './workbench-context';
import type { WorkbenchTab } from './types';

const WORKBENCH_TABS: Array<{ id: WorkbenchTab; label: string }> = [
  { id: 'fields', label: 'Datos extraídos' },
  { id: 'validation', label: 'Validaciones' },
  { id: 'usage', label: 'Uso y coste' },
];

const PROCESSING_STEPS = [
  { id: 'prepare', label: 'Preparar documento', description: 'Validando el archivo temporal', typingMessage: 'Validando el archivo temporal', durationMs: 1400 },
  { id: 'classify', label: 'Clasificar documento', description: 'Identificando el tipo documental', typingMessage: 'Identificando el tipo documental', durationMs: 1800 },
  { id: 'extract', label: 'Extraer identidad', description: 'Leyendo campos y evidencias', typingMessage: 'Leyendo campos y evidencias', durationMs: 2600 },
  { id: 'normalize', label: 'Normalizar resultado', description: 'Preparando la revisión manual', typingMessage: 'Preparando la revisión manual', durationMs: 1600 },
];

/**
 * Composición RecordWorkspace del Document Intelligence Workbench (prototipo
 * navegable de Fase 0, guiado por fixtures). Regiones: header (ModuleHeader
 * vía shell), tabs locales, record (preview + revisión) e inspector
 * contextual (ModuleContextPanel vía shell).
 */
export function DocumentIntelligenceWorkbench() {
  const {
    flowState,
    error,
    retryExtraction,
    resetWorkbench,
    openContextPanel,
    markProcessingVisualComplete,
  } = useWorkbenchPrototype();
  const [activeTab, setActiveTab] = useState<WorkbenchTab>('fields');

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {flowState === 'processing' ? (
        <AIFeedbackSurface
          title="Extrayendo datos del documento"
          description="El documento se procesa en servidor. Ningún dato sale del perímetro del tenant."
          status="processing"
          statusLabel="PROCESANDO"
          activeMessage="Analizando el documento"
          autoAdvance
          stepDurationMs={1800}
          icon="document_scanner"
          steps={PROCESSING_STEPS}
          onComplete={markProcessingVisualComplete}
        />
      ) : null}

      {flowState === 'loading-results' ? (
        <TechnicalSurface
          variant="surface"
          className="flex h-full min-h-[420px] w-full flex-1 items-center justify-center rounded-xl"
          role="status"
          aria-live="polite"
          aria-label="Preparando los datos extraídos"
        >
          <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <LogoSpinner size={64} speed="normal" />
            <LpdText size="xs" className="text-text-muted font-mono uppercase tracking-[0.18em]">
              Preparando los datos extraídos
            </LpdText>
          </div>
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
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id === 'validation') openContextPanel();
                    }}
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
                {activeTab === 'validation' ? (
                  <div className="flex min-h-[220px] items-center justify-center text-center">
                    <div>
                      <LpdText as="h3" size="sm" className="text-text-main font-semibold">
                        Validaciones de la extracción
                      </LpdText>
                      <LpdText size="sm" className="text-text-muted mt-2 max-w-md">
                        El detalle contextual de la extracción se muestra en el panel lateral.
                      </LpdText>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={openContextPanel}
                      >
                        Abrir contexto
                      </Button>
                    </div>
                  </div>
                ) : null}
                {activeTab === 'usage' ? <UsageCostPanel /> : null}
              </div>
            </TechnicalSurface>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
