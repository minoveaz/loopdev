import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SuiteHeader } from './index';
import React from 'react';

describe('SuiteHeader Composite', () => {
  it('debe renderizar correctamente los tres slots', () => {
    render(
      <SuiteHeader 
        leftSlot={<div data-testid="left">Left</div>}
        centerSlot={<div data-testid="center">Center</div>}
        rightSlot={<div data-testid="right">Right</div>}
      />
    );

    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('center')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
  });

  it('debe aplicar el estado de inercia cuando isInert es true', () => {
    render(<SuiteHeader isInert={true} leftSlot="Left" centerSlot="Center" rightSlot="Right" />);
    const banner = screen.getByRole('banner', { hidden: true });
    expect(banner).toHaveAttribute('aria-hidden', 'true');
    expect(banner).toHaveClass('pointer-events-none');
  });

  it('debe mantener la altura fija de 56px', () => {
    const { container } = render(<SuiteHeader leftSlot="-" centerSlot="-" rightSlot="-" />);
    expect(container.firstChild).toHaveStyle({ height: '56px' });
  });

  it('debe aplicar la clase de fondo y borde por defecto', () => {
    const { container } = render(<SuiteHeader leftSlot="-" centerSlot="-" rightSlot="-" />);
    expect(container.firstChild).toHaveClass('bg-white/80');
    expect(container.firstChild).toHaveClass('border-black/5');
  });
});
