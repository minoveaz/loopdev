/** @vitest-environment jsdom */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const row = {
  id: 'document-1',
  fileName: 'dni-frontal.png',
  mimeType: 'image/png',
  documentType: 'spanish-dni' as const,
  flowState: 'review' as const,
  provider: 'fixture' as const,
  updatedAt: '2026-09-05T12:00:00.000Z',
};

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/suites/document-intelligence/workbench/workbench-context', () => ({
  useWorkbenchPrototype: () => ({
    history: [row],
    loadDemoDocument: vi.fn(),
    resetWorkbench: vi.fn(),
  }),
}));

import DocumentIntelligenceHomePage from './page';

describe('Document Intelligence history table', () => {
  it('keeps document metadata in distinct accessible columns with an open action', () => {
    render(<DocumentIntelligenceHomePage />);

    expect(
      screen.getByRole('table', { name: 'Historial operativo de extracciones' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Documento' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Tipo / clasificación' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Estado' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Actualizado' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Abrir' })).toHaveLength(2);
    expect(screen.getByText('DNI español')).toBeInTheDocument();
  });

  it('renders a semantic mobile row without relying on horizontal overflow', () => {
    render(<DocumentIntelligenceHomePage />);

    expect(screen.getByRole('article', { name: 'dni-frontal.png' })).toHaveTextContent('image/png');
    expect(screen.getByRole('article', { name: 'dni-frontal.png' })).toHaveTextContent('Revisado');
  });
});
