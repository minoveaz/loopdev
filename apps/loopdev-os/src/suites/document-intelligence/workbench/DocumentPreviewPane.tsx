'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge, Button, Icon, IconButton, LpdText, TechnicalSurface } from '@loopdev/ui';

import { ALLOWED_DOCUMENT_MIME_TYPES, validateDocumentFile } from './file-validation';
import { useWorkbenchPrototype } from './workbench-context';
import type { DocumentSide } from './types';

const ALLOWED_MIME_CAPTION = 'JPEG, PNG o PDF · máx. 10 MB · almacenamiento temporal';
const ZOOM_STEPS = [1, 1.25, 1.5, 2, 2.5, 3] as const;

interface CropDialogProps {
  file: File;
  previewUrl: string;
  onCancel: () => void;
  onApply: (file: File) => void;
}

function CropDialog({ file, previewUrl, onCancel, onApply }: CropDialogProps) {
  const [cropScale, setCropScale] = useState(0.86);

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
      open
      aria-labelledby="crop-document-title"
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

function PdfCanvasPreview({
  file,
  previewUrl,
  title,
}: {
  file: File;
  previewUrl: string;
  title: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setViewport({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!viewport.width || !viewport.height || !canvasRef.current) return;
    let cancelled = false;
    let destroyLoadingTask: (() => void) | undefined;
    setRenderError(false);

    const render = async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
        const loadingTask = pdfjsLib.getDocument({ data: await file.arrayBuffer() });
        destroyLoadingTask = () => loadingTask.destroy();
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        if (cancelled || !canvasRef.current) return;
        const baseViewport = page.getViewport({ scale: 1 });
        const scale = Math.min(
          Math.max(viewport.width - 32, 1) / baseViewport.width,
          Math.max(viewport.height - 32, 1) / baseViewport.height,
        );
        const pageViewport = page.getViewport({ scale: Math.max(scale, 0.1) });
        const devicePixelRatio = window.devicePixelRatio || 1;
        const canvas = canvasRef.current;
        canvas.width = Math.ceil(pageViewport.width * devicePixelRatio);
        canvas.height = Math.ceil(pageViewport.height * devicePixelRatio);
        canvas.style.width = `${pageViewport.width}px`;
        canvas.style.height = `${pageViewport.height}px`;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('PDF canvas context unavailable');
        await page.render({
          canvas,
          canvasContext: context,
          viewport: pageViewport,
          transform: [devicePixelRatio, 0, 0, devicePixelRatio, 0, 0],
        }).promise;
      } catch {
        if (!cancelled) setRenderError(true);
      }
    };

    void render();
    return () => {
      cancelled = true;
      destroyLoadingTask?.();
    };
  }, [file, viewport]);

  return (
    <div ref={viewportRef} className="flex h-full min-h-[260px] w-full items-center justify-center">
      {renderError ? (
        <iframe
          src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          title={title}
          className="border-border-subtle bg-surface-elevated h-full min-h-[260px] w-full max-w-xl rounded-lg border"
        />
      ) : (
        <canvas
          ref={canvasRef}
          aria-label={title}
          className="bg-surface-elevated block rounded-lg shadow-sm"
        />
      )}
    </div>
  );
}

function getFileExtension(mimeType: string | null) {
  return mimeType === 'application/pdf' ? 'PDF' : 'imagen';
}

export function DocumentPreviewPane() {
  const {
    documentLoaded,
    documentFiles,
    loadDemoDocument,
    selectDocumentFile,
    startExtraction,
    flowState,
  } = useWorkbenchPrototype();
  const [side, setSide] = useState<DocumentSide>('front');
  const [rotation, setRotation] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragOrigin = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const current = documentFiles[side];
  const currentFile = current?.file ?? null;
  const previewUrl = useMemo(
    () => (currentFile ? URL.createObjectURL(currentFile) : null),
    [currentFile],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const resetView = () => {
    setZoomIndex(0);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  };

  const acceptFile = (file: File) => {
    const validationError = validateDocumentFile(file);
    if (validationError) {
      setFileError(validationError);
      return;
    }
    setFileError(null);
    resetView();
    selectDocumentFile(file, side);
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
      if (!imageType) throw new Error('No image found');
      const blob = await items.find((item) => item.types.includes(imageType))?.getType(imageType);
      if (!blob) throw new Error('No image found');
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

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!currentFile || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    dragOrigin.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPan({
      x: dragOrigin.current.panX + event.clientX - dragOrigin.current.x,
      y: dragOrigin.current.panY + event.clientY - dragOrigin.current.y,
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    setIsDragging(false);
  };

  const openInTab = () => {
    if (previewUrl) window.open(previewUrl, '_blank', 'noopener,noreferrer');
  };

  const isPdf = current?.mimeType === 'application/pdf';

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
    <TechnicalSurface variant="surface" className="flex h-full min-h-0 flex-col rounded-xl">
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_DOCUMENT_MIME_TYPES.join(',')}
        onChange={onInputChange}
        className="sr-only"
        aria-label={`Seleccionar ${side === 'front' ? 'anverso' : 'reverso'}`}
      />
      <div className="border-border-subtle flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2">
        <div className="flex min-w-0 items-center gap-2">
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
          <Badge status="neutral" variant="outline" showDot={false}>
            {currentFile
              ? `${getFileExtension(current?.mimeType ?? null)} · ${Math.round((current?.size ?? 0) / 1024)} KB`
              : 'Fixture'}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <IconButton
            icon="zoom_out"
            size="md"
            variant="ghost"
            ariaLabel="Alejar documento"
            onClick={() => setZoomIndex((value) => Math.max(value - 1, 0))}
            disabled={!currentFile}
          />
          <Button variant="ghost" size="sm" onClick={resetView} disabled={!currentFile}>
            {Math.round(ZOOM_STEPS[zoomIndex] * 100)}%
          </Button>
          <IconButton
            icon="zoom_in"
            size="md"
            variant="ghost"
            ariaLabel="Ampliar documento"
            onClick={() => setZoomIndex((value) => Math.min(value + 1, ZOOM_STEPS.length - 1))}
            disabled={!currentFile}
          />
          <IconButton
            icon="rotate_right"
            size="md"
            variant="ghost"
            ariaLabel="Girar 90 grados"
            onClick={() => setRotation((value) => (value + 90) % 360)}
            disabled={!currentFile}
          />
          <IconButton
            icon="open_in_new"
            size="md"
            variant="ghost"
            ariaLabel="Abrir en pestaña nueva"
            onClick={openInTab}
            disabled={!previewUrl}
          />
        </div>
      </div>

      <div
        className={`bg-surface-light dark:bg-surface-dark relative flex min-h-[280px] flex-1 items-center justify-center overflow-hidden p-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        {previewUrl && currentFile ? (
          <div
            className="flex origin-center items-center justify-center"
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) rotate(${rotation}deg) scale(${ZOOM_STEPS[zoomIndex]})`,
            }}
          >
            {isPdf ? (
              <PdfCanvasPreview
                file={currentFile}
                previewUrl={previewUrl}
                title={currentFile.name}
              />
            ) : (
              <img
                src={previewUrl}
                alt={currentFile.name}
                draggable={false}
                className="block max-h-[calc(100vh-300px)] max-w-full select-none rounded-lg object-contain shadow-sm"
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <Icon name="document_scanner" size="lg" className="text-primary/60" />
            <LpdText size="xs" className="text-text-muted">
              Vista previa del fixture de demostración
            </LpdText>
          </div>
        )}
        {currentFile ? (
          <LpdText
            size="nano"
            className="bg-surface-elevated/80 text-text-muted pointer-events-none absolute bottom-2 right-3 rounded px-2 py-1"
          >
            Arrastra para mover
          </LpdText>
        ) : null}
      </div>

      <div className="border-border-subtle flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            startIcon="upload_file"
            onClick={() => inputRef.current?.click()}
          >
            Subir {side === 'front' ? 'anverso' : 'reverso'}
          </Button>
          {currentFile && !isPdf ? (
            <Button variant="ghost" size="sm" startIcon="crop" onClick={() => setCropOpen(true)}>
              Recortar
            </Button>
          ) : null}
        </div>
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
            Simular error
          </Button>
        </div>
      </div>
      {fileError ? (
        <p role="alert" className="text-lpd-xs text-danger px-4 pb-3">
          {fileError}
        </p>
      ) : null}
      {cropOpen && currentFile && previewUrl ? (
        <CropDialog
          file={currentFile}
          previewUrl={previewUrl}
          onCancel={() => setCropOpen(false)}
          onApply={(file) => {
            setCropOpen(false);
            acceptFile(file);
          }}
        />
      ) : null}
    </TechnicalSurface>
  );
}
