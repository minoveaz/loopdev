'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge, Button, Icon, IconButton, LpdText, TechnicalSurface } from '@loopdev/ui';

import { DOCUMENT_FIT_MODES, resolveDocumentViewerPreset } from './presets';
import { DocumentEngine } from './engines';
import type { DocumentFitMode, DocumentViewerProps } from './types';

export function DocumentViewer({
  document,
  labels,
  preset = 'document',
  className,
  initialFitMode,
  fitMode: controlledFitMode,
  onFitModeChange,
  onCrop,
  cropLabel,
}: DocumentViewerProps) {
  const resolvedPreset = resolveDocumentViewerPreset(preset);
  const initialMode = initialFitMode ?? resolvedPreset.defaultFitMode;
  const [internalFitMode, setInternalFitMode] = useState<DocumentFitMode>(initialMode);
  const [zoomIndex, setZoomIndex] = useState(() =>
    Math.max(
      resolvedPreset.zoomSteps.findIndex((step) => step === 1),
      0,
    ),
  );
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const dragOrigin = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const objectUrl = useObjectUrl(document.file);

  const activeFitMode = controlledFitMode ?? internalFitMode;
  const zoom = resolvedPreset.zoomSteps[zoomIndex] ?? 1;
  const percentage = Math.round(zoom * 100);
  const isPdf = document.mimeType === 'application/pdf';

  useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current.style.transform = `translate3d(${pan.x}px, ${pan.y}px, 0) rotate(${rotation}deg) scale(${zoom})`;
  }, [pan, rotation, zoom]);

  const resetView = () => {
    setZoomIndex(
      Math.max(
        resolvedPreset.zoomSteps.findIndex((step) => step === 1),
        0,
      ),
    );
    setRotation(0);
    setPan({ x: 0, y: 0 });
    updateFitMode(resolvedPreset.defaultFitMode);
  };

  const updateFitMode = (nextFitMode: DocumentFitMode) => {
    if (controlledFitMode === undefined) setInternalFitMode(nextFitMode);
    onFitModeChange?.(nextFitMode);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
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
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  };

  const fitLabels = useMemo(
    () => ({
      contain: labels.fitContain,
      width: labels.fitWidth,
      actual: labels.fitActual,
    }),
    [labels.fitActual, labels.fitContain, labels.fitWidth],
  );

  if (!objectUrl) {
    return null;
  }

  return (
    <TechnicalSurface
      variant="surface"
      className={`flex h-full min-h-0 flex-col rounded-xl ${className ?? ''}`}
      data-document-viewer="true"
    >
      <div className="border-border-subtle flex flex-wrap items-center gap-2 border-b px-3 py-2">
        <div
          role="toolbar"
          aria-label={labels.toolbarLabel}
          className="flex min-w-0 flex-1 flex-wrap items-center gap-1"
        >
          <div role="group" aria-label={labels.fitGroupLabel} className="flex items-center gap-1">
            {DOCUMENT_FIT_MODES.map((mode) => (
              <Button
                key={mode}
                type="button"
                variant={activeFitMode === mode ? 'primary' : 'ghost'}
                size="sm"
                aria-pressed={activeFitMode === mode}
                onClick={() => updateFitMode(mode)}
              >
                {fitLabels[mode]}
              </Button>
            ))}
          </div>
          <IconButton
            icon="zoom_out"
            size="md"
            variant="ghost"
            ariaLabel={labels.zoomOut}
            className="h-10 w-10 sm:h-8 sm:w-8"
            onClick={() => setZoomIndex((value) => Math.max(value - 1, 0))}
            disabled={zoomIndex === 0}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-10 min-w-[56px] whitespace-nowrap px-2 sm:h-8"
            aria-label={labels.resetZoom(percentage)}
            onClick={resetView}
          >
            {labels.resetZoom(percentage)}
          </Button>
          <IconButton
            icon="zoom_in"
            size="md"
            variant="ghost"
            ariaLabel={labels.zoomIn}
            className="h-10 w-10 sm:h-8 sm:w-8"
            onClick={() =>
              setZoomIndex((value) => Math.min(value + 1, resolvedPreset.zoomSteps.length - 1))
            }
            disabled={zoomIndex === resolvedPreset.zoomSteps.length - 1}
          />
          <IconButton
            icon="rotate_right"
            size="md"
            variant="ghost"
            ariaLabel={labels.rotate}
            className="h-10 w-10 sm:h-8 sm:w-8"
            onClick={() => setRotation((value) => (value + 90) % 360)}
          />
          {onCrop && !isPdf ? (
            <IconButton
              icon="crop"
              size="md"
              variant="ghost"
              ariaLabel={cropLabel ?? labels.crop}
              className="h-10 w-10 sm:h-8 sm:w-8"
              onClick={onCrop}
            />
          ) : null}
          <IconButton
            icon="open_in_new"
            size="md"
            variant="ghost"
            ariaLabel={labels.openInNewTab}
            className="h-10 w-10 sm:h-8 sm:w-8"
            onClick={() => window.open(objectUrl, '_blank', 'noopener,noreferrer')}
          />
        </div>
        <Badge status="neutral" variant="outline" showDot={false} className="max-w-full truncate">
          {isPdf ? labels.pdfBadge : labels.imageBadge}
        </Badge>
      </div>

      <div
        className={`bg-surface-light dark:bg-surface-dark relative flex min-h-[280px] flex-1 items-center justify-center overflow-hidden p-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} touch-none`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        data-document-viewer-viewport="true"
      >
        <div
          ref={contentRef}
          className="flex h-full w-full min-w-0 origin-center items-center justify-center"
        >
          <DocumentEngine
            document={document}
            url={objectUrl}
            fitMode={activeFitMode}
            labels={labels}
          />
        </div>
        <LpdText
          size="nano"
          className="bg-surface-elevated/80 text-text-muted pointer-events-none absolute bottom-2 right-3 rounded px-2 py-1"
        >
          {labels.panHint}
        </LpdText>
        <Icon name={isPdf ? 'picture_as_pdf' : 'image'} size="sm" className="sr-only" />
      </div>
    </TechnicalSurface>
  );
}

function useObjectUrl(file: File) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const nextUrl = URL.createObjectURL(file);
    setUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);

  return url;
}
