'use client';

import { useRouter } from 'next/navigation';
import {
  Badge,
  Button,
  EmptyState,
  Heading,
  LpdText,
  ResponsiveTable,
  TechnicalSurface,
} from '@loopdev/ui';
import type { ResponsiveTableColumn, ResponsiveTableProps } from '@loopdev/ui';

import { useWorkbenchPrototype } from '@/suites/document-intelligence/workbench/workbench-context';
import type { PrototypeDocumentHistoryItem } from '@/suites/document-intelligence/workbench/types';

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  passport: 'Pasaporte',
  'spanish-dni': 'DNI español',
  'spanish-nie': 'NIE español',
  'national-id': 'Documento nacional',
  unknown: 'Sin clasificar',
};

function formatUpdatedAt(value: string) {
  return new Date(value).toLocaleString('es-ES');
}

function statusFor(item: PrototypeDocumentHistoryItem) {
  return {
    status: item.flowState === 'error' ? ('error' as const) : item.flowState === 'review' ? ('success' as const) : ('neutral' as const),
    label: item.flowState === 'error' ? 'Recuperable' : item.flowState === 'review' ? 'Revisado' : 'En preparación',
  };
}

function HistoryMobileRow({
  item,
  onOpen,
}: {
  item: PrototypeDocumentHistoryItem;
  onOpen: () => void;
}) {
  const status = statusFor(item);

  return (
    <article
      aria-label={item.fileName}
      className="border-border-subtle bg-background-subtle flex flex-col gap-3 rounded-lg border p-4"
    >
      <div className="min-w-0">
        <LpdText size="sm" weight="semibold" className="break-words">
          {item.fileName}
        </LpdText>
        <LpdText size="xs" className="text-text-muted mt-1">
          {item.mimeType} · {formatUpdatedAt(item.updatedAt)}
        </LpdText>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge status={status.status} variant="outline" showDot={false}>
          {status.label}
        </Badge>
        <Button variant="ghost" size="sm" onClick={onOpen}>
          Abrir
        </Button>
      </div>
    </article>
  );
}

function HistoryTable({
  rows,
  onOpen,
}: {
  rows: PrototypeDocumentHistoryItem[];
  onOpen: (item: PrototypeDocumentHistoryItem) => void;
}) {
  const columns: ResponsiveTableColumn<PrototypeDocumentHistoryItem>[] = [
    {
      key: 'fileName',
      header: 'Documento',
      render: (item) => (
        <div className="min-w-0">
          <LpdText size="sm" weight="semibold" className="break-words">
            {item.fileName}
          </LpdText>
          <LpdText size="xs" className="text-text-muted mt-1">
            {item.mimeType}
          </LpdText>
        </div>
      ),
      sortAccessor: (item) => item.fileName,
    },
    {
      key: 'documentType',
      header: 'Tipo / clasificación',
      render: (item) => DOCUMENT_TYPE_LABELS[item.documentType] ?? DOCUMENT_TYPE_LABELS.unknown,
    },
    {
      key: 'flowState',
      header: 'Estado',
      render: (item) => {
        const status = statusFor(item);
        return (
          <Badge status={status.status} variant="outline" showDot={false}>
            {status.label}
          </Badge>
        );
      },
    },
    {
      key: 'updatedAt',
      header: 'Actualizado',
      render: (item) => formatUpdatedAt(item.updatedAt),
      sortAccessor: (item) => item.updatedAt,
      className: 'whitespace-nowrap',
    },
  ];

  const renderMobileRow: NonNullable<
    ResponsiveTableProps<PrototypeDocumentHistoryItem>['renderMobileRow']
  > = (item) => <HistoryMobileRow item={item} onOpen={() => onOpen(item)} />;

  return (
    <ResponsiveTable
      surface={false}
      caption="Historial operativo de extracciones"
      columns={columns}
      rows={rows}
      getRowKey={(item) => item.id}
      rowActions={(item) => (
        <Button variant="ghost" size="sm" onClick={() => onOpen(item)}>
          Abrir
        </Button>
      )}
      renderMobileRow={renderMobileRow}
      mobileHeaders={{ record: 'Documento', status: 'Estado', actions: 'Acción' }}
      pageSize={0}
      className="[&_tbody_td]:py-4 [&_tbody_td]:align-top"
    />
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
        <div className="min-w-0 space-y-2">
          <p className="text-primary text-lpd-xs font-semibold uppercase tracking-[0.18em]">
            Document Intelligence
          </p>
          <Heading as="h1" size="2xl" weight="semibold" className="text-text-main mt-3">
            Extracciones operativas
          </Heading>
          <LpdText size="sm" className="text-text-muted block max-w-2xl leading-relaxed">
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
          <div className="min-w-0 space-y-1">
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
          <HistoryTable
            rows={history}
            onOpen={(item) => {
              loadDemoDocument(item.id);
              router.push(`/document-intelligence/${item.id}`);
            }}
          />
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
