import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { IdentityBar } from './index';
import React from 'react';

describe('IdentityBar Atom', () => {
  it('debe renderizar el componente correctamente', () => {
    const { container } = render(<IdentityBar />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('debe aplicar la orientación vertical por defecto', () => {
    const { container } = render(<IdentityBar />);
    expect(container.firstChild).toHaveClass('w-0.5');
    expect(container.firstChild).toHaveClass('h-6');
  });

  it('debe cambiar a orientación horizontal', () => {
    const { container } = render(<IdentityBar orientation="horizontal" />);
    expect(container.firstChild).toHaveClass('h-0.5');
    expect(container.firstChild).toHaveClass('w-6');
  });

  it('debe aplicar el color inyectado', () => {
    const testColor = 'rgb(255, 0, 0)';
    const { container } = render(<IdentityBar color={testColor} />);
    expect(container.firstChild).toHaveStyle({ backgroundColor: testColor });
  });
});
