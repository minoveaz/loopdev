import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserMenu } from './index';
import { USER_MENU_FIXTURES } from './fixtures';
import React from 'react';

describe('UserMenu Composite', () => {
  const props = USER_MENU_FIXTURES.admin;

  it('debe renderizar el avatar como disparador', () => {
    render(<UserMenu {...props} />);
    // El disparador contiene las iniciales del usuario
    expect(screen.getByText('MV')).toBeInTheDocument();
  });

  it('debe tener el rol de botón para el disparador del menú', () => {
    render(<UserMenu {...props} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('debe renderizar el pulso de presencia en el avatar', () => {
    const { container } = render(<UserMenu {...props} />);
    // Verificamos que el StatusPulse esté presente mediante su clase de animación
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});
