'use client';

import { Badge, Divider, LpdText } from '@loopdev/ui';

import { useWorkbenchPrototype } from './workbench-context';

function UsageRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <LpdText size="xs" className="text-text-muted">
        {label}
      </LpdText>
      <LpdText size="xs" weight="semibold" className="tabular-nums">
        {value}
      </LpdText>
    </div>
  );
}

/**
 * Visibilidad de uso y coste de la extracción. En el fixture todos los valores
 * son cero; con el provider real mostrará los tokens y el coste estimado que
 * devuelve la Edge Function.
 */
export function UsageCostPanel() {
  const { result } = useWorkbenchPrototype();

  if (!result) return null;

  const { usage } = result;

  return (
    <div className="flex flex-col gap-3" aria-label="Uso y coste de la extracción">
      <div className="flex items-center justify-between gap-4">
        <LpdText size="xs" className="text-text-muted">
          Proveedor
        </LpdText>
        <Badge
          status={result.provider === 'fixture' ? 'neutral' : 'primary'}
          variant="outline"
          showDot={false}
        >
          {result.provider === 'fixture' ? 'Fixture' : 'Gemini'}
        </Badge>
      </div>
      <Divider />
      <UsageRow label="Tokens de entrada" value={usage.promptTokens.toLocaleString('es-ES')} />
      <UsageRow label="Tokens de salida" value={usage.outputTokens.toLocaleString('es-ES')} />
      <UsageRow label="Tokens totales" value={usage.totalTokens.toLocaleString('es-ES')} />
      <Divider />
      <UsageRow
        label="Coste estimado"
        value={usage.estimatedCostUsd === 0 ? '—' : `$${usage.estimatedCostUsd.toFixed(5)}`}
      />
      <LpdText size="nano" className="text-text-muted">
        El provider de fixtures no consume tokens ni genera coste.
      </LpdText>
    </div>
  );
}
