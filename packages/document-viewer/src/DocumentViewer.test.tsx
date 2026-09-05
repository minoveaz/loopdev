/** @vitest-environment jsdom */
import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DocumentViewer } from './DocumentViewer';
import { calculateDocumentFit } from './engines';
import {
  DOCUMENT_VIEWER_FIXTURE_LABELS,
  createDocumentViewerFixture,
  createDocumentViewerFixtures,
} from './fixtures';

describe('DocumentViewer', () => {
  const createObjectURL = vi.fn(() => 'blob:document-viewer');
  const revokeObjectURL = vi.fn();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses explicit fit modes without hidden scale multipliers', () => {
    expect(calculateDocumentFit(612, 792, 360, 500, 'contain').scale).toBeCloseTo(0.5359, 3);
    expect(calculateDocumentFit(612, 792, 360, 500, 'width').scale).toBeCloseTo(0.5359, 3);
    expect(calculateDocumentFit(612, 792, 360, 500, 'actual').scale).toBe(1);
  });

  it('provides PDF, JPEG and PNG fixture documents', () => {
    const fixtures = createDocumentViewerFixtures();
    expect(fixtures.pdf.file.size).toBeGreaterThan(100);
    expect(fixtures.jpeg.file.size).toBeGreaterThan(100);
    expect(fixtures.png.file.size).toBeGreaterThan(50);
    expect(fixtures.jpeg.file.type).toBe('image/jpeg');
    expect(fixtures.png.file.type).toBe('image/png');
  });

  it('renders the native image engine and complete inspection toolbar', () => {
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL });
    const open = vi.fn();
    vi.stubGlobal('open', open);

    render(
      <DocumentViewer
        document={createDocumentViewerFixture()}
        labels={DOCUMENT_VIEWER_FIXTURE_LABELS}
      />,
    );

    expect(document.querySelector('[data-document-viewer="true"]')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /document-viewer-fixture/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Alejar documento' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ampliar documento' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Girar 90 grados' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir en pestaña nueva' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Ancho' }));
    expect(screen.getByRole('button', { name: 'Ancho' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Abrir en pestaña nueva' }));
    expect(open).toHaveBeenCalledWith('blob:document-viewer', '_blank', 'noopener,noreferrer');
  });

  it('revokes object URLs when the document changes and on unmount', () => {
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL });
    const { rerender, unmount } = render(
      <DocumentViewer
        document={createDocumentViewerFixture()}
        labels={DOCUMENT_VIEWER_FIXTURE_LABELS}
      />,
    );

    rerender(
      <DocumentViewer
        document={createDocumentViewerFixture('image/png')}
        labels={DOCUMENT_VIEWER_FIXTURE_LABELS}
      />,
    );
    unmount();
    expect(revokeObjectURL).toHaveBeenCalled();
  });

  it('uses the consumer crop label for the optional manual crop action', () => {
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL });
    const onCrop = vi.fn();
    render(
      <DocumentViewer
        document={createDocumentViewerFixture()}
        labels={DOCUMENT_VIEWER_FIXTURE_LABELS}
        onCrop={onCrop}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Recortar documento' }));
    expect(onCrop).toHaveBeenCalledOnce();
  });

  it('passes axe for the shared viewer surface', async () => {
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL });
    const { container } = render(
      <DocumentViewer
        document={createDocumentViewerFixture()}
        labels={DOCUMENT_VIEWER_FIXTURE_LABELS}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
