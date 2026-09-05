'use client';

import { Badge, Divider, LpdText, TechnicalStatusBadge } from '@loopdev/ui';

import { useWorkbenchPrototype } from './workbench-context';
import type { WorkbenchFlowState } from './types';

const FLOW_STATE_LABELS: Record<WorkbenchFlowState, string> = {
  preparation: 'Preparación',
  processing: 'Procesando',
  review: 'Revisión',
  'review-with-warnings': 'Revisión con avisos',
  error: 'Error recuperable',
};

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  passport: 'Pasaporte',
  'spanish-dni': 'DNI español',
  'spanish-nie': 'NIE español',
  'national-id': 'Documento nacional de identidad',
  unknown: 'Desconocido',
};

/**
 * Contenido del `ModuleContextPanel` del workbench: estado del flujo,
 * clasificación, resumen de validación y uso/coste. La zona la posee la shell;
 * este componente solo aporta el contenido contextual del módulo.
 */
export function WorkbenchInspector() {
  const { flowState, result, error } = useWorkbenchPrototype();

  const warningCount = result?.validations.filter((validation) => !validation.valid).length ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <section aria-label="Estado del flujo" className="flex flex-col gap-2">
        <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest">
          Estado
        </LpdText>
        <TechnicalStatusBadge
          label={FLOW_STATE_LABELS[flowState]}
          severity={
            flowState === 'error'
              ? 'danger'
              : flowState === 'review-with-warnings'
                ? 'warning'
                : flowState === 'review'
                  ? 'success'
                  : 'info'
          }
          withPulse={flowState === 'processing'}
        />
        {error ? (
          <LpdText size="xs" className="text-text-muted">
            Error {error.status}: {error.message}
          </LpdText>
        ) : null}
      </section>

      <Divider />

      <section aria-label="Clasificación del documento" className="flex flex-col gap-2">
        <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest">
          Clasificación
        </LpdText>
        {result ? (
          <div className="flex items-center justify-between gap-3">
            <LpdText size="xs">{DOCUMENT_TYPE_LABELS[result.classification.type]}</LpdText>
            <Badge status="success" variant="outline" showDot={false}>
              {Math.round(result.classification.confidence * 100)}%
            </Badge>
          </div>
        ) : (
          <LpdText size="xs" className="text-text-muted">
            Sin clasificación todavía.
          </LpdText>
        )}
      </section>

      <Divider />

      <section aria-label="Resumen de validación" className="flex flex-col gap-2">
        <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest">
          Validación
        </LpdText>
        {result ? (
          <div className="flex items-center justify-between gap-3">
            <LpdText size="xs">
              {result.validations.length} reglas evaluadas
            </LpdText>
            <Badge
              status={warningCount > 0 ? 'error' : 'success'}
              variant="outline"
              showDot={false}
            >
              {warningCount > 0 ? `${warningCount} avisos` : 'Sin avisos'}
            </Badge>
          </div>
        ) : (
          <LpdText size="xs" className="text-text-muted">
            Las reglas deterministas se evalúan tras la extracción.
          </LpdText>
        )}
      </section>

      <Divider />

      <section aria-label="Uso y coste" className="flex flex-col gap-2">
        <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest">
          Uso y coste
        </LpdText>
        {result ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <LpdText size="xs" className="text-text-muted">
                Tokens
              </LpdText>
              <LpdText size="xs" weight="semibold" className="tabular-nums">
                {result.usage.totalTokens.toLocaleString('es-ES')}
              </LpdText>
            </div>
            <div className="flex items-center justify-between gap-3">
              <LpdText size="xs" className="text-text-muted">
                Coste estimado
              </LpdText>
              <LpdText size="xs" weight="semibold" className="tabular-nums">
                {result.usage.estimatedCostUsd === 0
                  ? '—'
                  : `$${result.usage.estimatedCostUsd.toFixed(5)}`}
              </LpdText>
            </div>
          </>
        ) : (
          <LpdText size="xs" className="text-text-muted">
            Disponible tras la extracción.
          </LpdText>
        )}
      </section>
    </div>
  );
}
