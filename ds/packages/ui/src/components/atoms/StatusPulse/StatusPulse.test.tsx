import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { StatusPulse } from './index';
import React from 'react';

describe('StatusPulse Atom', () => {
  it('debe renderizar el componente correctamente', () => {
    const { container } = render(<StatusPulse />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('debe aplicar la variante de color correcta', () => {
    const { container } = render(<StatusPulse variant="energy" />);
    expect(container.firstChild).toHaveClass('bg-energy-yellow');
  });

  it('debe aplicar el tamaño correcto', () => {
    const { container } = render(<StatusPulse size="lg" />);
    expect(container.firstChild).toHaveClass('w-3');
    expect(container.firstChild).toHaveClass('h-3');
  });

  it('debe deshabilitar la animación cuando isAnimated es false', () => {
    const { container } = render(<StatusPulse isAnimated={false} />);
    expect(container.firstChild).not.toHaveClass('animate-pulse');
  });
});
