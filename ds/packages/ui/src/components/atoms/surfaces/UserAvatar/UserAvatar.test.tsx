import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserAvatar } from './index';
import React from 'react';

describe('UserAvatar Atom', () => {
  it('debe mostrar las iniciales correctas basadas en el nombre', () => {
    render(<UserAvatar name="Miller Vega" />);
    expect(screen.getByText('MV')).toBeInTheDocument();
  });

  it('debe mostrar una imagen si se proporciona la prop src', () => {
    const testSrc = "https://example.com/avatar.jpg";
    render(<UserAvatar src={testSrc} name="Miller Vega" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', testSrc);
  });

  it('debe mostrar un icono si no hay nombre ni src', () => {
    const { container } = render(<UserAvatar />);
    // Buscamos el SVG de Lucide (User icon)
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('debe renderizar el pulso de estado si withStatus es true', () => {
    const { container } = render(<UserAvatar withStatus />);
    // El pulso tiene el rol status (heredado de StatusPulse si lo tuviera, o buscamos por clase)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});
