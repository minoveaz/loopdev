'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge, Button, Icon, LpdText, TechnicalSurface } from '@loopdev/ui';
import {
  DocumentViewer,
  type DocumentViewerDocument,
  type DocumentViewerLabels,
} from '@loopdev/document-viewer';

import { ALLOWED_DOCUMENT_MIME_TYPES, validateDocumentFile } from './file-validation';
import { useWorkbenchPrototype } from './workbench-context';
import type { DocumentSide } from './types';

const ALLOWED_MIME_CAPTION = 'JPEG, PNG o PDF · máx. 10 MB · almacenamiento temporal';

const DOCUMENT_VIEWER_LABELS: DocumentViewerLabels = {
  toolbarLabel: 'Controles de vista previa',
  fitGroupLabel: 'Modo de ajuste',
  fitContain: 'Ajustar',
  fitWidth: 'Ancho',
  fitActual: 'Tamaño real',
  zoomOut: 'Alejar documento',
  zoomIn: 'Ampliar documento',
  resetZoom: (percentage) => `${percentage}%`,
  rotate: 'Girar 90 grados',
  crop: 'Recortar documento',
  openInNewTab: 'Abrir en pestaña nueva',
  pdfBadge: 'PDF',
  imageBadge: 'Imagen',
  panHint: 'Arrastra para mover',
  pdfFallbackTitle: 'Vista previa del PDF',
  pdfFallbackDescription: 'Descarga el documento para abrirlo con el visor del sistema.',
  pdfRenderError: 'No se pudo mostrar la vista previa del PDF.',
  download: 'Descargar documento',
  imageAlt: (name) => `Vista previa de ${name}`,
};

interface CropDialogProps {
  file: File;
  previewUrl: string;
  onCancel: () => void;
  onApply: (file: File) => void;
}

function CropDialog({ file, previewUrl, onCancel, onApply }: CropDialogProps) {
  const [cropScale, setCropScale] = useState(0.86);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
  }, []);

  const applyCrop = () => {
    const source = new Image();
    source.onload = () => {
      const width = Math.round(source.naturalWidth * cropScale);
      const height = Math.round(source.naturalHeight * cropScale);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) return;
      const x = Math.round((source.naturalWidth - width) / 2);
      const y = Math.round((source.naturalHeight - height) / 2);
      context.drawImage(source, x, y, width, height, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) onApply(new File([blob], file.name, { type: 'image/jpeg' }));
      }, 'image/jpeg');
    };
    source.src = previewUrl;
  };

  return (
    <dialog
      ref={dialogRef}
      open
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-document-title"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onCancel();
      }}
      className="fixed inset-0 z-40 m-0 h-full w-full bg-transparent p-4"
    >
      <div className="mx-auto flex h-full max-w-3xl items-center justify-center">
        <div className="border-border-subtle bg-surface-elevated flex max-h-full w-full flex-col overflow-hidden rounded-xl border shadow-lg">
          <div className="border-border-subtle border-b px-5 py-4">
            <h2 id="crop-document-title" className="text-lpd-sm text-text-main font-semibold">
              Recortar imagen
            </h2>
            <LpdText size="xs" className="text-text-muted">
              Ajusta el área central antes de continuar con la extracción.
            </LpdText>
          </div>
          <div className="bg-surface-dark relative flex min-h-[280px] flex-1 items-center justify-center overflow-hidden p-6">
            <img
              src={previewUrl}
              alt={`Vista previa para recortar: ${file.name}`}
              className="max-h-[55vh] max-w-full object-contain"
              style={{ clipPath: `inset(${Math.round((1 - cropScale) * 50)}%)` }}
            />
          </div>
          <div className="border-border-subtle flex flex-wrap items-center gap-4 border-t px-5 py-4">
            <label className="flex min-w-52 flex-1 items-center gap-3">
              <LpdText as="span" size="nano" className="text-text-muted">
                Área
              </LpdText>
              <input
                aria-label="Tamaño del recorte"
                type="range"
                min="0.55"
                max="1"
                step="0.01"
                value={cropScale}
                onChange={(event) => setCropScale(Number(event.target.value))}
                className="accent-primary w-full"
              />
            </label>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={applyCrop}>
                Aplicar recorte
              </Button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function DocumentIntakePane() {
  const {
    documentLoaded,
    documentFiles,
    loadDemoDocument,
    selectDocumentFile,
    startExtraction,
    flowState,
  } = useWorkbenchPrototype();
  const [side, setSide] = useState<DocumentSide>('front');
  const [fileError, setFileError] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropPreviewUrl, setCropPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeSide: DocumentSide = side === 'back' && !documentFiles.back ? 'front' : side;
  const current = documentFiles[activeSide];
  const currentDocument = useMemo<DocumentViewerDocument | null>(
    () =>
      current?.file && current.mimeType
        ? {
            file: current.file,
            name: current.name,
            mimeType: current.mimeType,
          }
        : null,
    [current],
  );

  useEffect(() => {
    if (side === 'back' && !documentFiles.back) setSide('front');
  }, [documentFiles.back, side]);

  useEffect(() => {
    setCropOpen(false);
  }, [activeSide, current?.file]);

  useEffect(() => {
    const mimeType = current?.mimeType;
    if (!cropOpen || !current?.file || !mimeType?.startsWith('image/')) {
      setCropPreviewUrl(null);
      return;
    }
    const previewUrl = URL.createObjectURL(current.file);
    setCropPreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [cropOpen, current?.file, current?.mimeType]);

  const acceptFile = (file: File) => {
    const validationError = validateDocumentFile(file);
    if (validationError) {
      setFileError(validationError);
      return;
    }
    setFileError(null);
    selectDocumentFile(file, activeSide);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) acceptFile(file);
    event.target.value = '';
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) acceptFile(file);
  };

  const pasteFromClipboard = async () => {
    try {
      if (!navigator.clipboard?.read) throw new Error('Clipboard API unavailable');
      const items = await navigator.clipboard.read();
      const imageType = items
        .flatMap((item) => item.types)
        .find((type) =>
          ALLOWED_DOCUMENT_MIME_TYPES.includes(
            type as (typeof ALLOWED_DOCUMENT_MIME_TYPES)[number],
          ),
        );
      if (!imageType) throw new Error('No supported document found');
      const blob = await items.find((item) => item.types.includes(imageType))?.getType(imageType);
      if (!blob) throw new Error('No document found');
      acceptFile(
        new File([blob], `clipboard.${imageType === 'application/pdf' ? 'pdf' : 'png'}`, {
          type: imageType,
        }),
      );
    } catch {
      setFileError(
        'No se pudo leer un documento desde el portapapeles. Usa el selector o arrastra un archivo.',
      );
    }
  };

  if (!documentLoaded) {
    return (
      <TechnicalSurface
        variant="surface"
        className="border-border-subtle flex h-full min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center sm:p-10"
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_DOCUMENT_MIME_TYPES.join(',')}
          onChange={onInputChange}
          className="sr-only"
          aria-label="Seleccionar documento"
        />
        <div className="flex w-full flex-1 items-center justify-center">
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-6 text-center">
            <span aria-hidden="true" className="text-primary/70">
              <Icon name="upload_file" size="xl" />
            </span>
            <div className="space-y-2">
              <LpdText size="lg" weight="semibold">
                Arrastra un documento aquí
              </LpdText>
              <LpdText size="sm" className="text-text-muted block leading-relaxed">
                {ALLOWED_MIME_CAPTION}
              </LpdText>
            </div>
            <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                variant="primary"
                size="sm"
                startIcon="description"
                className="w-full sm:w-auto"
                onClick={() => inputRef.current?.click()}
              >
                Seleccionar documento
              </Button>
              <Button
                variant="outline"
                size="sm"
                startIcon="content_paste"
                className="w-full sm:w-auto"
                onClick={() => void pasteFromClipboard()}
              >
                Pegar desde portapapeles
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => loadDemoDocument()}
              >
                Usar fixture
              </Button>
            </div>
            {fileError ? (
              <p role="alert" className="text-lpd-xs text-danger">
                {fileError}
              </p>
            ) : null}
            <LpdText size="xs" className="text-text-muted block leading-relaxed">
              La referencia se conserva solo durante esta sesión operativa.
            </LpdText>
          </div>
        </div>
      </TechnicalSurface>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_DOCUMENT_MIME_TYPES.join(',')}
        onChange={onInputChange}
        className="sr-only"
        aria-label={`Seleccionar ${activeSide === 'front' ? 'anverso' : 'reverso'}`}
      />
      <div className="border-border-subtle flex flex-wrap items-center justify-between gap-2">
        <div role="group" aria-label="Cara del documento" className="flex shrink-0 gap-1">
          <Button
            variant={activeSide === 'front' ? 'primary' : 'ghost'}
            size="sm"
            aria-pressed={activeSide === 'front'}
            onClick={() => setSide('front')}
          >
            Anverso
          </Button>
          {documentFiles.back ? (
            <Button
              variant={activeSide === 'back' ? 'primary' : 'ghost'}
              size="sm"
              aria-pressed={activeSide === 'back'}
              onClick={() => setSide('back')}
            >
              Reverso
            </Button>
          ) : null}
        </div>
        <Badge status="neutral" variant="outline" showDot={false} className="max-w-full truncate">
          {current ? `${current.mimeType} · ${Math.round(current.size / 1024)} KB` : 'Fixture'}
        </Badge>
      </div>

      {currentDocument ? (
        <DocumentViewer
          key={`${activeSide}-${currentDocument.name}-${currentDocument.file.lastModified}`}
          document={currentDocument}
          labels={DOCUMENT_VIEWER_LABELS}
          onCrop={() => setCropOpen(true)}
          cropLabel={DOCUMENT_VIEWER_LABELS.crop}
          className="min-h-0 flex-1"
        />
      ) : (
        <TechnicalSurface
          variant="surface"
          className="flex min-h-[280px] flex-1 items-center justify-center rounded-xl"
        >
          <LpdText size="xs" className="text-text-muted">
            Vista previa del fixture de demostración
          </LpdText>
        </TechnicalSurface>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          size="sm"
          startIcon="upload_file"
          className="w-full sm:w-auto"
          onClick={() => inputRef.current?.click()}
        >
          Subir {activeSide === 'front' ? 'anverso' : 'reverso'}
        </Button>
        <Button
          variant="primary"
          size="sm"
          startIcon="document_scanner"
          className="w-full sm:w-auto"
          isLoading={flowState === 'processing'}
          onClick={() => startExtraction('success')}
        >
          Iniciar extracción
        </Button>
      </div>
      {fileError ? (
        <p role="alert" className="text-lpd-xs text-danger">
          {fileError}
        </p>
      ) : null}
      {cropOpen && current?.file && cropPreviewUrl ? (
        <CropDialog
          file={current.file}
          previewUrl={cropPreviewUrl}
          onCancel={() => setCropOpen(false)}
          onApply={(file) => {
            setCropOpen(false);
            acceptFile(file);
          }}
        />
      ) : null}
    </div>
  );
}
