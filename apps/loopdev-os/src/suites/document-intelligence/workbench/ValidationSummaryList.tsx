'use client';

import { Badge, EmptyState, LpdText } from '@loopdev/ui';

import { WORKBENCH_FIELD_LABELS } from './fixtures';
import { useWorkbenchPrototype } from './workbench-context';

/**
 * Resumen de validaciones deterministas fijas (checksums DNI/NIE, caducidad,
 * coherencia, mayoría de edad). No configurable en esta entrega.
 */
export function ValidationSummaryList() {
  const { result } = useWorkbenchPrototype();

  if (!result) return null;

  if (result.validations.length === 0) {
    return (
      <EmptyState
        variant="ghost"
        icon="verified"
        title="Sin validaciones"
        description="No hay reglas aplicables a este tipo de documento."
      />
    );
  }

  return (
    <ul className="flex flex-col gap-3" aria-label="Resultados de validación">
      {result.validations.map((validation, index) => (
        <li
          key={`${validation.field}-${index}`}
          className="border-border-subtle flex items-start gap-3 rounded-lg border p-3"
        >
          <Badge
            status={validation.valid ? 'success' : 'error'}
            variant="outline"
            showDot
            className="mt-0.5 shrink-0"
          >
            {validation.valid ? 'Válido' : 'Aviso'}
          </Badge>
          <div className="min-w-0">
            <LpdText size="xs" weight="semibold">
              {WORKBENCH_FIELD_LABELS[validation.field] ?? validation.field}
            </LpdText>
            <LpdText size="xs" className="text-text-muted">
              {validation.message}
            </LpdText>
          </div>
        </li>
      ))}
    </ul>
  );
}
