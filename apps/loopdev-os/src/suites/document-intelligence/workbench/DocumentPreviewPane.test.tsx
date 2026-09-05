/** @vitest-environment jsdom */
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  calculatePdfPageFit,
  calculatePdfAutoFitScale,
  detectPdfContentBounds,
  DocumentPreviewPane,
  PDF_FALLBACK_CLASS_NAME,
  PDF_INITIAL_SCALE_CAP,
  PDF_PREVIEW_DOWNLOAD_LABEL,
  PDF_PREVIEW_ERROR_TITLE,
} from './DocumentPreviewPane';
import { WorkbenchPrototypeProvider } from './workbench-context';

describe('DocumentPreviewPane', () => {
  it('fits the PDF page to the available viewport without collapsing to a thumbnail', () => {
    const fit = calculatePdfPageFit(612, 792, 360, 500);

    expect(fit.scale).toBeCloseTo(0.5359, 3);
    expect(fit.width).toBeCloseTo(328, 0);
    expect(fit.height).toBeCloseTo(424.5, 0);
    expect(fit.height / fit.width).toBeCloseTo(792 / 612, 3);
    expect(fit.height).toBeGreaterThan(400);
  });

  it('separates the PDF visual base fit from the user zoom percentage', () => {
    const fit = calculatePdfAutoFitScale(0.2, 240, 640, 600, 700);

    expect(fit.baseFitScale).toBe(0.2);
    expect(fit.autoFitScale).toBeGreaterThan(fit.baseFitScale);
    expect(fit.userZoom).toBe(1);
    expect(fit.width).toBeGreaterThan(240);
    expect(PDF_INITIAL_SCALE_CAP).toBe(2.5);
    expect(DocumentPreviewPane.toString()).toContain('pdfAutoFitScale');
  });

  it('keeps the PDF fallback surface full-size when PDF.js cannot render', () => {
    expect(PDF_FALLBACK_CLASS_NAME).toContain('w-full');
    expect(PDF_FALLBACK_CLASS_NAME).not.toContain('max-w-xl');
  });

  it('auto-crops only PDFs with clearly excessive whitespace around visible content', () => {
    const width = 100;
    const height = 100;
    const data = new Uint8ClampedArray(width * height * 4).fill(255);
    for (let y = 40; y < 60; y += 1) {
      for (let x = 40; x < 60; x += 1) {
        const index = (y * width + x) * 4;
        data[index] = 20;
        data[index + 1] = 20;
        data[index + 2] = 20;
        data[index + 3] = 255;
      }
    }

    const cropped = detectPdfContentBounds({ data, width, height }, 245, 4);
    expect(cropped.autoCropped).toBe(true);
    expect(cropped.left).toBe(36);
    expect(cropped.top).toBe(36);
    expect(cropped.right).toBe(64);
    expect(cropped.bottom).toBe(64);

    const normal = detectPdfContentBounds(
      { data: new Uint8ClampedArray(width * height * 4).fill(255), width, height },
      245,
      4,
    );
    expect(normal.autoCropped).toBe(false);
    expect(normal.right).toBe(width);
    expect(normal.bottom).toBe(height);
  });

  it('provides an actionable download boundary when both PDF previews fail', () => {
    expect(PDF_PREVIEW_DOWNLOAD_LABEL).toBe('Descargar documento');
    expect(PDF_PREVIEW_ERROR_TITLE).toContain('vista previa del PDF');
  });

  it('keeps the transformed document wrapper full-width for PDF viewport measurement', () => {
    const source = DocumentPreviewPane.toString();
    expect(source).toContain('flex w-full min-w-0 origin-center');
  });

  it('centers the empty intake group and keeps actions responsive without overflow', () => {
    render(
      <WorkbenchPrototypeProvider>
        <DocumentPreviewPane />
      </WorkbenchPrototypeProvider>,
    );

    const title = screen.getByText('Arrastra un documento aquí');
    const group = title.parentElement?.parentElement;
    const centeringWrapper = group?.parentElement;

    expect(title).toHaveClass('text-lpd-lg');
    expect(screen.getByText(/JPEG, PNG.*PDF/i)).toHaveClass('text-lpd-sm');
    expect(group).toHaveClass('mx-auto', 'max-w-2xl', 'text-center');
    expect(centeringWrapper).toHaveClass('w-full', 'flex-1', 'items-center', 'justify-center');
    expect(screen.getByRole('button', { name: /Seleccionar documento/ })).toHaveClass('w-full');
    expect(screen.getByRole('button', { name: /Pegar desde portapapeles/ })).toHaveClass('w-full');
    expect(screen.getByRole('button', { name: 'Usar fixture' })).toHaveClass('w-full');
  });

  it('validates MIME and size before accepting a document', () => {
    render(
      <WorkbenchPrototypeProvider>
        <DocumentPreviewPane />
      </WorkbenchPrototypeProvider>,
    );

    const input = screen.getByLabelText('Seleccionar documento');
    expect(input).toHaveAttribute('accept', 'image/jpeg,image/png,application/pdf');
    fireEvent.change(input, {
      target: { files: [new File(['text'], 'notes.txt', { type: 'text/plain' })] },
    });
    expect(screen.getByRole('alert')).toHaveTextContent(/JPEG\/PNG.*PDF/i);
  });

  it('does not render a reverso control when the document has no second side', () => {
    render(
      <WorkbenchPrototypeProvider>
        <DocumentPreviewPane />
      </WorkbenchPrototypeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Usar fixture' }));

    expect(screen.getByRole('button', { name: 'Anverso' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByRole('button', { name: 'Reverso' })).not.toBeInTheDocument();
  });

  it('renders real uploaded image controls and opens its object URL in a new tab', () => {
    const open = vi.fn();
    vi.stubGlobal('open', open);
    const createObjectURL = vi.fn(() => 'blob:document-preview');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL });

    render(
      <WorkbenchPrototypeProvider>
        <DocumentPreviewPane />
      </WorkbenchPrototypeProvider>,
    );

    fireEvent.change(screen.getByLabelText('Seleccionar documento'), {
      target: { files: [new File(['image'], 'front.png', { type: 'image/png' })] },
    });
    expect(screen.getByText(/IMAGEN/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Alejar documento' })).toHaveClass('h-8', 'w-8');
    expect(screen.getByRole('button', { name: 'Ampliar documento' })).toHaveClass('h-8', 'w-8');
    expect(screen.getByRole('button', { name: 'Girar 90 grados' })).toHaveClass('h-8', 'w-8');
    expect(screen.getByRole('button', { name: 'Recortar documento' })).toHaveClass('h-8', 'w-8');
    expect(screen.getByRole('button', { name: 'Recortar documento' })).toHaveAttribute(
      'title',
      'Recortar documento',
    );
    expect(screen.queryByRole('button', { name: /Simular error/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar extracción/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Abrir en pestaña nueva' }));
    expect(screen.getByRole('button', { name: 'Abrir en pestaña nueva' })).toHaveClass('h-8', 'w-8');
    expect(open).toHaveBeenCalledWith('blob:document-preview', '_blank', 'noopener,noreferrer');
  });

  it('keeps the loaded preview toolbar in two responsive rows', () => {
    const createObjectURL = vi.fn(() => 'blob:document-preview');
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL: vi.fn() });

    render(
      <WorkbenchPrototypeProvider>
        <DocumentPreviewPane />
      </WorkbenchPrototypeProvider>,
    );

    fireEvent.change(screen.getByLabelText('Seleccionar documento'), {
      target: { files: [new File(['image'], 'front.png', { type: 'image/png' })] },
    });

    expect(document.querySelector('[data-preview-toolbar-row="document-selector"]')).toBeTruthy();
    expect(document.querySelector('[data-preview-toolbar-row="document-controls"]')).toBeTruthy();
    const controls = document.querySelector('[data-preview-toolbar-row="document-controls"]');
    expect(controls).toHaveClass(
      'grid-cols-[minmax(44px,1fr)_minmax(56px,1.25fr)_repeat(4,minmax(44px,1fr))]',
      'divide-x',
      'sm:flex',
    );
    const zoomReset = screen.getByRole('button', { name: '100%' });
    expect(zoomReset).toHaveTextContent('100%');
    expect(zoomReset).not.toHaveClass('truncate');
    expect(zoomReset).toHaveClass('min-w-0', 'overflow-visible', 'whitespace-nowrap');
    expect(screen.getByRole('button', { name: 'Alejar documento' })).toHaveClass('h-11', 'w-full');
    expect(screen.getByRole('button', { name: 'Abrir en pestaña nueva' })).toHaveClass(
      'h-11',
      'w-full',
    );
    expect(screen.getByRole('button', { name: /Iniciar extracción/ })).toHaveClass('w-full');
  });

  it('does not expose image crop controls for PDF documents', () => {
    const createObjectURL = vi.fn(() => 'blob:document-pdf');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL });
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    );

    render(
      <WorkbenchPrototypeProvider>
        <DocumentPreviewPane />
      </WorkbenchPrototypeProvider>,
    );

    fireEvent.change(screen.getByLabelText('Seleccionar documento'), {
      target: { files: [new File(['pdf'], 'document.pdf', { type: 'application/pdf' })] },
    });

    expect(screen.queryByRole('button', { name: 'Recortar documento' })).not.toBeInTheDocument();
  });
});
