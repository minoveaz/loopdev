'use client';

import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

import type {
  DocumentFitMode,
  DocumentFitResult,
  DocumentViewerDocument,
  DocumentViewerLabels,
} from './types';

const PDF_WORKER_URL = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.mjs',
  import.meta.url,
).toString();
const PDF_CMAP_URL = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`;

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;
}

export function calculateDocumentFit(
  pageWidth: number,
  pageHeight: number,
  containerWidth: number,
  containerHeight: number,
  fitMode: DocumentFitMode,
  padding = 32,
): DocumentFitResult {
  const availableWidth = Math.max(containerWidth - padding, 1);
  const availableHeight = Math.max(containerHeight - padding, 1);
  const safePageWidth = Math.max(pageWidth, 1);
  const safePageHeight = Math.max(pageHeight, 1);
  const scale =
    fitMode === 'actual'
      ? 1
      : fitMode === 'width'
        ? availableWidth / safePageWidth
        : Math.min(availableWidth / safePageWidth, availableHeight / safePageHeight);

  return {
    scale,
    width: pageWidth * scale,
    height: pageHeight * scale,
  };
}

function useElementSize(elementRef: RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      setSize({
        width: Math.max(rect.width, element.clientWidth),
        height: Math.max(rect.height, element.clientHeight),
      });
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef]);

  return size;
}

function PdfCanvasEngine({
  document,
  url,
  fitMode,
  labels,
}: {
  document: DocumentViewerDocument;
  url: string;
  fitMode: DocumentFitMode;
  labels: DocumentViewerLabels;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = useElementSize(viewportRef);
  const [renderError, setRenderError] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    if (!size.width || !size.height || !canvasRef.current) return;

    let cancelled = false;
    let loadingTask: ReturnType<typeof pdfjsLib.getDocument> | undefined;
    let renderTask: { cancel: () => void; promise: Promise<unknown> } | undefined;
    setRenderError(false);
    setIframeError(false);

    const render = async () => {
      try {
        const fileData = new Uint8Array(await document.file.arrayBuffer());
        if (cancelled) return;
        loadingTask = pdfjsLib.getDocument({
          data: fileData,
          cMapUrl: PDF_CMAP_URL,
          cMapPacked: true,
        });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        if (cancelled || !canvasRef.current) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const pageFit = calculateDocumentFit(
          baseViewport.width,
          baseViewport.height,
          size.width,
          size.height,
          fitMode,
        );
        const devicePixelRatio = window.devicePixelRatio || 1;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('PDF canvas context unavailable');

        const pageViewport = page.getViewport({ scale: pageFit.scale });
        canvas.width = Math.ceil(pageViewport.width * devicePixelRatio);
        canvas.height = Math.ceil(pageViewport.height * devicePixelRatio);
        canvas.style.width = `${pageViewport.width}px`;
        canvas.style.height = `${pageViewport.height}px`;
        renderTask = page.render({
          canvas,
          canvasContext: context,
          viewport: pageViewport,
          transform: [devicePixelRatio, 0, 0, devicePixelRatio, 0, 0],
        });
        await renderTask.promise;
      } catch {
        if (!cancelled) setRenderError(true);
      }
    };

    void render();
    return () => {
      cancelled = true;
      renderTask?.cancel();
      void loadingTask?.destroy();
    };
  }, [document, fitMode, size.height, size.width]);

  return (
    <div ref={viewportRef} className="flex h-full min-h-[260px] w-full items-center justify-center">
      {renderError ? (
        iframeError ? (
          <div
            role="alert"
            className="bg-surface-elevated text-text-muted flex h-full min-h-[260px] w-full flex-col items-center justify-center gap-3 rounded-lg border p-6 text-center"
          >
            <p className="text-text-main text-sm font-semibold">{labels.pdfRenderError}</p>
            <p className="text-xs">{labels.pdfFallbackDescription}</p>
            <a
              href={url}
              download={document.name}
              className="text-primary focus-visible:ring-primary/40 rounded-md px-3 py-2 text-sm font-semibold underline focus-visible:outline-none focus-visible:ring-2"
            >
              {labels.download}
            </a>
          </div>
        ) : (
          <iframe
            src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
            title={labels.pdfFallbackTitle}
            onError={() => setIframeError(true)}
            className="border-border-subtle bg-surface-elevated h-full min-h-[260px] w-full rounded-lg border"
          />
        )
      ) : (
        <canvas
          ref={canvasRef}
          aria-label={document.name}
          data-document-viewer-pdf-canvas="true"
          className="bg-surface-elevated block rounded-lg shadow-sm"
        />
      )}
    </div>
  );
}

export function DocumentEngine({
  document,
  url,
  fitMode,
  labels,
}: {
  document: DocumentViewerDocument;
  url: string;
  fitMode: DocumentFitMode;
  labels: DocumentViewerLabels;
}) {
  if (document.mimeType === 'application/pdf') {
    return <PdfCanvasEngine document={document} url={url} fitMode={fitMode} labels={labels} />;
  }

  const imageClassName =
    fitMode === 'width'
      ? 'block h-auto w-full select-none rounded-lg object-contain shadow-sm'
      : fitMode === 'actual'
        ? 'block max-h-none max-w-none select-none rounded-lg object-contain shadow-sm'
        : 'block max-h-full max-w-full select-none rounded-lg object-contain shadow-sm';

  return (
    <img
      src={url}
      alt={labels.imageAlt?.(document.name) ?? document.name}
      draggable={false}
      className={imageClassName}
      data-document-viewer-image="true"
    />
  );
}
