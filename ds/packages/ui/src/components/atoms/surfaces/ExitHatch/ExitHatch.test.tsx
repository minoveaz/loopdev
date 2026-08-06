import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExitHatch } from './index';
import React from 'react';

describe('ExitHatch Atom', () => {
  it('debe renderizar el label correctamente en modo expandido', () => {
    render(<ExitHatch label="Back to OS" onClick={() => {}} />);
    expect(screen.getByText('Back to OS')).toBeInTheDocument();
  });

  it('debe ocultar el label en modo Rail', () => {
    render(<ExitHatch label="Exit" isRail={true} onClick={() => {}} />);
    expect(screen.queryByText('Exit')).not.toBeInTheDocument();
  });

  it('debe disparar el callback onClick al ser pulsado', () => {
    const mockClick = vi.fn();
    render(<ExitHatch label="Exit" onClick={mockClick} />);
    
    fireEvent.click(screen.getByRole('link'));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('debe tener el icono de Lucide por defecto', () => {
    const { container } = render(<ExitHatch label="Test" onClick={() => {}} />);
    // El icono ArrowLeft de Lucide tiene el atributo data-lucide="arrow-left" o similar
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
