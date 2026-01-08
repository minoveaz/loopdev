import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TechnicalLabel } from './index';
import React from 'react';

describe('TechnicalLabel Atom', () => {
  it('debe renderizar el contenido correctamente', () => {
    render(<TechnicalLabel>Test Label</TechnicalLabel>);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('debe aplicar la transformación a mayúsculas por defecto', () => {
    const { container } = render(<TechnicalLabel>lowercase</TechnicalLabel>);
    expect(container.firstChild).toHaveClass('uppercase');
  });

  it('debe aplicar el tracking extendido por defecto', () => {
    const { container } = render(<TechnicalLabel>Test</TechnicalLabel>);
    expect(container.firstChild).toHaveClass('tracking-[0.3em]');
  });

  it('debe aplicar la variante de color primaria', () => {
    const { container } = render(<TechnicalLabel variant="primary">Active</TechnicalLabel>);
    expect(container.firstChild).toHaveClass('text-primary');
  });

  it('debe usar el tamaño nano por defecto', () => {
    const { container } = render(<TechnicalLabel>Nano</TechnicalLabel>);
    expect(container.firstChild).toHaveClass('text-[8px]');
  });
});
