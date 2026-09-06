'use client';

import { Button, Heading, TechnicalSurface } from '@loopdev/ui';
import type { LeadConversionResult } from './api';

type OpportunityResultPanelProps = {
  result:
    { kind: 'success'; conversion: LeadConversionResult } | { kind: 'conflict'; message: string };
  onClose: () => void;
  onRetry?: () => void;
};

export function OpportunityResultPanel({ result, onClose, onRetry }: OpportunityResultPanelProps) {
  const isConflict = result.kind === 'conflict';
  const stageLabel =
    !isConflict && result.conversion.opportunity.stageKey === 'qualified'
      ? 'Cualificado'
      : 'Etapa actual';

  return (
    <TechnicalSurface
      variant="surface"
      radius="sm"
      border="technical"
      className="space-y-3 p-4"
      role={isConflict ? 'alert' : 'status'}
      aria-live={isConflict ? 'assertive' : 'polite'}
    >
      <div>
        <Heading as="h2" size="base" weight="semibold">
          {isConflict
            ? 'No se pudo convertir el Lead'
            : result.conversion.outcome === 'created'
              ? 'Opportunity creada'
              : 'Opportunity existente reutilizada'}
        </Heading>
        <p className="text-text-muted mt-1 text-sm">
          {isConflict
            ? result.message
            : result.conversion.outcome === 'created'
              ? 'La Opportunity quedó vinculada al mismo Lead y Contacto.'
              : 'La conversión idempotente devolvió la Opportunity existente sin duplicarla.'}
        </p>
      </div>
      {!isConflict ? (
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-text-muted">Producto/interés</dt>
            <dd className="text-text-main font-medium">{result.conversion.opportunity.name}</dd>
          </div>
          <div>
            <dt className="text-text-muted">Etapa</dt>
            <dd className="text-text-main font-medium">{stageLabel}</dd>
          </div>
        </dl>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {isConflict && onRetry ? (
          <Button type="button" size="sm" variant="secondary" onClick={onRetry}>
            Reintentar
          </Button>
        ) : null}
        <Button type="button" size="sm" variant="ghost" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </TechnicalSurface>
  );
}
