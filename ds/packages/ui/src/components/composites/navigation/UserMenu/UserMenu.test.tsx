import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { UserMenu } from './index';

const userProps = {
  userName: 'Ada Lovelace',
  userEmail: 'ada@example.com',
  userRole: 'Admin',
  onLogout: vi.fn(),
};

describe('UserMenu', () => {
  it('renders an accessible user menu trigger', () => {
    render(<UserMenu {...userProps} />);

    expect(screen.getByRole('button', { name: 'Abrir menú de usuario' })).toBeInTheDocument();
  });

  it('has no accessibility violations before opening', async () => {
    const { container } = render(<UserMenu {...userProps} />);

    expect(await axe(container)).toHaveNoViolations();
  });
  it('shows the active tenant in the profile menu', () => {
    render(<UserMenu {...userProps} tenantName="LoopDev Workspace" />);

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Abrir menú de usuario' }));

    expect(screen.getByText('LoopDev Workspace')).toBeInTheDocument();
  });

  it('opens the contextual profile flow directly from the avatar when configured', () => {
    const onAvatarClick = vi.fn();
    render(<UserMenu {...userProps} onAvatarClick={onAvatarClick} />);

    fireEvent.click(screen.getByRole('button', { name: 'Open profile' }));

    expect(onAvatarClick).toHaveBeenCalledOnce();
    expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument();
  });
});

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
