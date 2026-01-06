import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommandBarTrigger } from './index';
import React from 'react';

describe('CommandBarTrigger Atom', () => {
  it('debe mostrar el placeholder y el atajo en modo "full"', () => {
    render(<CommandBarTrigger onOpen={() => {}} />);
    expect(screen.getByText('Search or type a command...')).toBeInTheDocument();
    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });

  it('debe ocultar el placeholder y el atajo en modo "icon"', () => {
    render(<CommandBarTrigger mode="icon" onOpen={() => {}} />);
    expect(screen.queryByText('Search or type a command...')).not.toBeInTheDocument();
    expect(screen.queryByText('⌘K')).not.toBeInTheDocument();
  });

  it('debe disparar el callback onOpen al hacer clic', () => {
    const mockOpen = vi.fn();
    render(<CommandBarTrigger onOpen={mockOpen} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOpen).toHaveBeenCalledTimes(1);
  });

  it('debe tener siempre el icono de búsqueda', () => {
    const { container } = render(<CommandBarTrigger onOpen={() => {}} />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    // Lucide-react puede no añadir el data-lucide, verificamos la clase
    expect(svgElement?.classList.contains('lucide-search')).toBe(true);
  });
});
