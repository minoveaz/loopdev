'use client';

import { useState } from 'react';
import {
  Badge,
  Button,
  EmptyState,
  Icon,
  LpdText,
  TechnicalCard,
  TechnicalSurface,
} from '@loopdev/ui';

import { DocumentPreviewPane } from './DocumentPreviewPane';
import { ExtractionReviewForm } from './ExtractionReviewForm';
import { UsageCostPanel } from './UsageCostPanel';
import { ValidationSummaryList } from './ValidationSummaryList';
import { useWorkbenchPrototype } from './workbench-context';
import type { WorkbenchTab } from './types';

const WORKBENCH_TABS: Array<{ id: WorkbenchTab; label: string }> = [
  { id: 'fields', label: 'Datos extraídos' },
  { id: 'validation', label: 'Validación' },
  { id: 'usage', label: 'Uso y coste' },
];

/**
 * Composición RecordWorkspace del Document Intelligence Workbench (prototipo
 * navegable de Fase 0, guiado por fixtures). Regiones: header (ModuleHeader
 * vía shell), tabs locales, record (preview + revisión) e inspector
 * contextual (ModuleContextPanel vía shell).
 */
export function DocumentIntelligenceWorkbench() {
  const { flowState, result, error, retryExtraction, resetWorkbench } = useWorkbenchPrototype();
  const [activeTab, setActiveTab] = useState<WorkbenchTab>('fields');

  const warningCount = result?.validations.filter((validation) => !validation.valid).length ?? 0;

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

      {flowState === 'preparation' || flowState === 'review' || flowState === 'review-with-warnings' ? (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-2">
          <DocumentPreviewPane />

          {flowState === 'preparation' ? (
            <TechnicalSurface
              variant="surface"
              className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-xl p-8 text-center"
            >
              <span aria-hidden="true" className="text-text-muted">
                <Icon name="fact_check" size="lg" />
              </span>
              <LpdText size="sm" weight="semibold">
                Revisión de campos
              </LpdText>
              <LpdText size="xs" className="text-text-muted max-w-sm">
                Tras la extracción podrás revisar y editar cada campo antes de aprobar. Los campos
                no legibles se muestran vacíos, nunca inventados.
              </LpdText>
            </TechnicalSurface>
          ) : (
            <TechnicalSurface variant="surface" className="flex min-h-0 flex-col rounded-xl">
              {flowState === 'review-with-warnings' ? (
                <TechnicalCard
                  variant="flat"
                  className="m-4 mb-0 flex items-start gap-3 border-l-2 border-l-amber-500 p-3"
                  role="status"
                >
                  <span aria-hidden="true" className="text-amber-500">
                    <Icon name="warning" size="sm" />
                  </span>
                  <div>
                    <LpdText size="xs" weight="semibold">
                      {warningCount} {warningCount === 1 ? 'aviso requiere' : 'avisos requieren'} tu
                      revisión
                    </LpdText>
                    <LpdText size="nano" className="text-text-muted">
                      Revisa los campos marcados antes de aprobar la extracción.
                    </LpdText>
                  </div>
                </TechnicalCard>
              ) : null}

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
                    {tab.id === 'validation' && warningCount > 0 ? (
                      <Badge status="error" variant="solid" showDot={false} className="ml-1">
                        {warningCount}
                      </Badge>
                    ) : null}
                  </Button>
                ))}
              </div>

              <div
                role="tabpanel"
                aria-label={WORKBENCH_TABS.find((tab) => tab.id === activeTab)?.label}
                className="min-h-0 flex-1 overflow-y-auto p-4"
              >
                {activeTab === 'fields' ? <ExtractionReviewForm /> : null}
                {activeTab === 'validation' ? <ValidationSummaryList /> : null}
                {activeTab === 'usage' ? <UsageCostPanel /> : null}
              </div>
            </TechnicalSurface>
          )}
        </div>
      ) : null}
    </div>
  );
}
