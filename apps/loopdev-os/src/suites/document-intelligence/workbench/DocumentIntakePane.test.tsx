/** @vitest-environment jsdom */
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DocumentIntakePane } from './DocumentIntakePane';

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

describe('DocumentIntakePane', () => {
  it('delegates document rendering to the shared viewer and returns to front when back is removed', () => {
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: vi.fn(() => 'blob:document-side'),
      revokeObjectURL: vi.fn(),
    });
    const { rerender } = render(<DocumentIntakePane />);

    expect(screen.getByRole('button', { name: 'Ajustar' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reverso' }));
    expect(screen.getByRole('button', { name: 'Reverso' })).toHaveAttribute('aria-pressed', 'true');

    contextValue = {
      ...contextValue,
      documentFiles: { front: frontFile, back: null },
    };
    rerender(<DocumentIntakePane />);

    expect(screen.queryByRole('button', { name: 'Reverso' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Anverso' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByLabelText('Seleccionar anverso')).toBeInTheDocument();
  });

  it('keeps the intake allowlist and rejects unsupported files before the context', () => {
    contextValue = {
      ...contextValue,
      documentLoaded: false,
      documentFiles: { front: null, back: null },
    };
    render(<DocumentIntakePane />);

    const input = screen.getByLabelText('Seleccionar documento');
    expect(input).toHaveAttribute('accept', 'image/jpeg,image/png,application/pdf');
    fireEvent.change(input, {
      target: { files: [new File(['text'], 'notes.txt', { type: 'text/plain' })] },
    });
    expect(screen.getByRole('alert')).toHaveTextContent(/JPEG\/PNG.*PDF/i);
  });
});
