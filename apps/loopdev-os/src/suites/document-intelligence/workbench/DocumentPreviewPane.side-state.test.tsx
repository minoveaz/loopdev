/** @vitest-environment jsdom */
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DocumentPreviewPane } from './DocumentPreviewPane';

const frontFile = {
  file: new File(['front'], 'front.png', { type: 'image/png' }),
  name: 'front.png',
  mimeType: 'image/png' as const,
  size: 5,
  side: 'front' as const,
};

const backFile = {
  file: new File(['back'], 'back.png', { type: 'image/png' }),
  name: 'back.png',
  mimeType: 'image/png' as const,
  size: 4,
  side: 'back' as const,
};

let contextValue: Record<string, unknown> = {
  documentLoaded: true,
  documentFiles: { front: frontFile, back: backFile },
  loadDemoDocument: vi.fn(),
  selectDocumentFile: vi.fn(),
  startExtraction: vi.fn(),
  flowState: 'preparation',
};

vi.mock('./workbench-context', () => ({
  useWorkbenchPrototype: () => contextValue,
}));

describe('DocumentPreviewPane side state', () => {
  it('returns to anverso when the active reverso is removed', () => {
    const createObjectURL = vi.fn(() => 'blob:document-side');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL });

    const { rerender } = render(<DocumentPreviewPane />);

    fireEvent.click(screen.getByRole('button', { name: 'Reverso' }));
    expect(screen.getByRole('button', { name: 'Reverso' })).toHaveAttribute('aria-pressed', 'true');

    contextValue = {
      ...contextValue,
      documentFiles: { front: frontFile, back: null },
    };
    rerender(<DocumentPreviewPane />);

    expect(screen.queryByRole('button', { name: 'Reverso' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Anverso' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByLabelText('Seleccionar anverso')).toBeInTheDocument();
  });
});
