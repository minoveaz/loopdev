import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SidebarIdentity } from './index';
import React from 'react';

describe('SidebarIdentity Composite', () => {
  const mockLogo = <div data-testid="mock-logo">Logo</div>;

  it('debe mostrar el nombre de la suite en modo expandido', () => {
    render(<SidebarIdentity name="Marketing Studio" logo={mockLogo} isRail={false} />);
    expect(screen.getByText('Marketing Studio')).toBeInTheDocument();
  });

  it('debe ocultar el nombre de la suite en modo Rail', () => {
    render(<SidebarIdentity name="Marketing Studio" logo={mockLogo} isRail={true} />);
    expect(screen.queryByText('Marketing Studio')).not.toBeInTheDocument();
  });

  it('debe mostrar el logo siempre', () => {
    render(<SidebarIdentity name="Test" logo={mockLogo} />);
    expect(screen.getByTestId('mock-logo')).toBeInTheDocument();
  });

  it('debe disparar el callback al hacer clic', () => {
    const mockClick = vi.fn();
    render(<SidebarIdentity name="Test" logo={mockLogo} onClick={mockClick} />);
    
    // El logoWrapper tiene el click
    const trigger = screen.getByTestId('mock-logo').parentElement;
    fireEvent.click(trigger!);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
