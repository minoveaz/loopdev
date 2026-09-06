/** @vitest-environment jsdom */
import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type * as PdfJs from 'pdfjs-dist/legacy/build/pdf.mjs';

vi.mock('pdfjs-dist/legacy/build/pdf.mjs', async (importOriginal) => {
  const actual = await importOriginal<typeof PdfJs>();
  return {
    ...actual,
    getDocument: vi.fn(),
  };
});

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

import { DocumentViewer } from './DocumentViewer';
import { DOCUMENT_VIEWER_FIXTURE_LABELS, createDocumentViewerFixture } from './fixtures';

describe('DocumentViewer PDF fallback', () => {
  const createObjectURL = vi.fn(() => 'blob:document-viewer-fallback');
  const revokeObjectURL = vi.fn();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows an actionable terminal error when PDF.js and iframe fallback fail', async () => {
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL });
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    );
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 640,
      height: 480,
      top: 0,
      left: 0,
      right: 640,
      bottom: 480,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    vi.mocked(pdfjsLib.getDocument).mockImplementation(() => {
      throw new Error('forced PDF.js failure');
    });

    render(
      <DocumentViewer
        document={createDocumentViewerFixture('application/pdf')}
        labels={DOCUMENT_VIEWER_FIXTURE_LABELS}
      />,
    );

    const iframe = await screen.findByTitle(DOCUMENT_VIEWER_FIXTURE_LABELS.pdfFallbackTitle);
    expect(document.querySelector('[data-document-viewer-pdf-canvas="true"]')).toBeNull();

    await act(async () => {
      iframe.dispatchEvent(new ErrorEvent('error', { error: new Error('forced iframe failure') }));
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(screen.getByText(DOCUMENT_VIEWER_FIXTURE_LABELS.pdfRenderError)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: DOCUMENT_VIEWER_FIXTURE_LABELS.download }),
    ).toHaveAttribute('href', 'blob:document-viewer-fallback');
    expect(document.querySelector('[data-document-viewer-pdf-canvas="true"]')).toBeNull();
  });
});
