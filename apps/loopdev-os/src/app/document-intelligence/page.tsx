'use client';

import { useRouter } from 'next/navigation';
import { Badge, Button, EmptyState, Heading, LpdText, TechnicalSurface } from '@loopdev/ui';

import { useWorkbenchPrototype } from '@/suites/document-intelligence/workbench/workbench-context';
import type { PrototypeDocumentHistoryItem } from '@/suites/document-intelligence/workbench/types';

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  passport: 'Pasaporte',
  'spanish-dni': 'DNI español',
  'spanish-nie': 'NIE español',
  'national-id': 'Documento nacional',
  unknown: 'Sin clasificar',
};

function HistoryRow({ item, onOpen }: { item: PrototypeDocumentHistoryItem; onOpen: () => void }) {
  return (
    <li className="border-border-subtle flex flex-wrap items-center justify-between gap-3 border-b px-4 py-4 last:border-b-0">
      <div className="min-w-0">
        <LpdText size="sm" weight="semibold" className="truncate">
          {item.fileName}
        </LpdText>
        <LpdText size="xs" className="text-text-muted">
          {DOCUMENT_TYPE_LABELS[item.documentType] ?? DOCUMENT_TYPE_LABELS.unknown} ·{' '}
          {new Date(item.updatedAt).toLocaleString('es-ES')}
        </LpdText>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          status={
            item.flowState === 'error'
              ? 'error'
              : item.flowState === 'review'
                ? 'success'
                : 'neutral'
          }
          variant="outline"
          showDot={false}
        >
          {item.flowState === 'error'
            ? 'Recuperable'
            : item.flowState === 'review'
              ? 'Revisado'
              : 'En preparación'}
        </Badge>
        <Button variant="ghost" size="sm" onClick={onOpen}>
          Abrir
        </Button>
      </div>
    </li>
  );
}

export default function DocumentIntelligenceHomePage() {
  const router = useRouter();
  const { history, loadDemoDocument, resetWorkbench } = useWorkbenchPrototype();

  const openNewExtraction = () => {
    resetWorkbench();
    router.push('/document-intelligence/new');
  };

  return (
    <div className="bg-shell-canvas flex min-h-full flex-1 flex-col gap-6 p-6 sm:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-primary text-lpd-xs font-semibold uppercase tracking-[0.18em]">
            Document Intelligence
          </p>
          <Heading as="h1" size="2xl" weight="semibold" className="text-text-main mt-3">
            Extracciones operativas
          </Heading>
          <LpdText size="sm" className="text-text-muted mt-2 max-w-2xl">
            Prepara un documento, revisa los campos extraídos y decide cómo continuar. La lista
            conserva el estado operativo local; el historial permanente pertenece a una fase futura.
          </LpdText>
        </div>
        <Button
          variant="primary"
          size="md"
          startIcon="document_scanner"
          onClick={openNewExtraction}
        >
          Nueva extracción
        </Button>
      </div>

      <TechnicalSurface variant="surface" className="w-full overflow-hidden rounded-xl">
        <div className="border-border-subtle flex items-center justify-between gap-3 border-b px-4 py-3">
          <div>
            <LpdText size="sm" weight="semibold">
              Historial operativo
            </LpdText>
            <LpdText size="nano" className="text-text-muted">
              Fixtures y sesiones recientes de este navegador
            </LpdText>
          </div>
          <Badge status="neutral" variant="outline" showDot={false}>
            {history.length}
          </Badge>
        </div>
        {history.length > 0 ? (
          <ul aria-label="Historial operativo de extracciones">
            {history.map((item) => (
              <HistoryRow
                key={item.id}
                item={item}
                onOpen={() => {
                  loadDemoDocument(item.id);
                  router.push(`/document-intelligence/${item.id}`);
                }}
              />
            ))}
          </ul>
        ) : (
          <EmptyState
            variant="ghost"
            icon="document_scanner"
            title="Todavía no hay extracciones"
            description="Carga un documento o recorre el fixture para iniciar una revisión."
            action={
              <Button variant="primary" size="sm" onClick={openNewExtraction}>
                Iniciar flujo
              </Button>
            }
          />
        )}
      </TechnicalSurface>
    </div>
  );
}
