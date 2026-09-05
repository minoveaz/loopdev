/** @vitest-environment jsdom */
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DocumentPreviewPane } from './DocumentPreviewPane';
import { WorkbenchPrototypeProvider } from './workbench-context';

describe('DocumentPreviewPane', () => {
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
    fireEvent.click(screen.getByRole('button', { name: 'Abrir en pestaña nueva' }));
    expect(screen.getByRole('button', { name: 'Abrir en pestaña nueva' })).toHaveClass('h-8', 'w-8');
    expect(open).toHaveBeenCalledWith('blob:document-preview', '_blank', 'noopener,noreferrer');
  });
});
