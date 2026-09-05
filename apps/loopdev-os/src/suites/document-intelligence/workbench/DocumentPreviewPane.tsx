'use client';

import { useState } from 'react';
import { Badge, Button, Icon, IconButton, LpdText, TechnicalSurface } from '@loopdev/ui';

import { useWorkbenchPrototype } from './workbench-context';

const ALLOWED_MIME_CAPTION = 'JPEG, PNG o PDF · máx. 10 MB · almacenamiento temporal';
const ZOOM_STEPS = [1, 1.5, 2] as const;

/**
 * Zona de preparación y preview del documento. Prototipo de Fase 0: el visor
 * real (zoom/crop/rotación sobre imagen o PDF) es un gap documentado; aquí se
 * representa con un placeholder interactivo para validar la composición.
 */
export function DocumentPreviewPane() {
  const { documentLoaded, loadDemoDocument, startExtraction, flowState } = useWorkbenchPrototype();
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [rotation, setRotation] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(0);

  if (!documentLoaded) {
    return (
      <TechnicalSurface
        variant="surface"
        className="border-border-subtle flex h-full min-h-[320px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-8 text-center"
      >
        <span aria-hidden="true" className="text-primary/70">
          <Icon name="upload_file" size="lg" />
        </span>
        <div className="space-y-1">
          <LpdText size="sm" weight="semibold">
            Arrastra un documento aquí
          </LpdText>
          <LpdText size="xs" className="text-text-muted">
            {ALLOWED_MIME_CAPTION}
          </LpdText>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button variant="primary" size="sm" startIcon="description" onClick={loadDemoDocument}>
            Usar documento de demostración
          </Button>
          <Button variant="outline" size="sm" startIcon="content_paste" onClick={loadDemoDocument}>
            Pegar desde portapapeles
          </Button>
        </div>
        <LpdText size="nano" className="text-text-muted">
          Prototipo: la subida real a almacenamiento temporal llega en la Fase 2.
        </LpdText>
      </TechnicalSurface>
    );
  }

  return (
    <TechnicalSurface variant="surface" className="flex h-full min-h-0 flex-col rounded-xl">
      <div className="border-border-subtle flex items-center justify-between gap-2 border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <div role="group" aria-label="Cara del documento" className="flex gap-1">
            <Button
              variant={side === 'front' ? 'primary' : 'ghost'}
              size="sm"
              aria-pressed={side === 'front'}
              onClick={() => setSide('front')}
            >
              Anverso
            </Button>
            <Button
              variant={side === 'back' ? 'primary' : 'ghost'}
              size="sm"
              aria-pressed={side === 'back'}
              onClick={() => setSide('back')}
            >
              Reverso
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <IconButton
            icon="rotate_right"
            size="sm"
            variant="ghost"
            ariaLabel="Rotar documento"
            onClick={() => setRotation((value) => (value + 90) % 360)}
          />
          <IconButton
            icon="zoom_in"
            size="sm"
            variant="ghost"
            ariaLabel="Ampliar documento"
            onClick={() => setZoomIndex((value) => (value + 1) % ZOOM_STEPS.length)}
          />
          <Badge status="neutral" variant="outline" showDot={false}>
            {Math.round(ZOOM_STEPS[zoomIndex] * 100)}%
          </Badge>
        </div>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark flex min-h-[280px] flex-1 items-center justify-center overflow-hidden p-6">
        <div
          className="border-border-subtle bg-surface-elevated flex aspect-[8/5] w-full max-w-md flex-col items-center justify-center gap-3 rounded-lg border shadow-sm transition-transform duration-300"
          style={{
            transform: `rotate(${rotation}deg) scale(${ZOOM_STEPS[zoomIndex]})`,
          }}
          aria-label={`Vista previa del documento, ${side === 'front' ? 'anverso' : 'reverso'}`}
        >
          <span aria-hidden="true" className="text-primary/60">
            <Icon name="document_scanner" size="lg" />
          </span>
          <LpdText size="xs" className="text-text-muted">
            {side === 'front' ? 'Anverso' : 'Reverso'} · documento de demostración
          </LpdText>
        </div>
      </div>

      <div className="border-border-subtle flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3">
        <LpdText size="nano" className="text-text-muted">
          Visor documental definitivo pendiente (gap G2 del track).
        </LpdText>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            size="sm"
            startIcon="document_scanner"
            isLoading={flowState === 'processing'}
            onClick={() => startExtraction('success')}
          >
            Iniciar extracción
          </Button>
          <Button variant="ghost" size="sm" onClick={() => startExtraction('error')}>
            Simular error del proveedor
          </Button>
        </div>
      </div>
    </TechnicalSurface>
  );
}
