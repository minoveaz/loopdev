import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TechnicalDropdown, TechnicalDropdownItem } from './index';
import React from 'react';

describe('TechnicalDropdown Atom', () => {
  it('debe renderizar el disparador correctamente', () => {
    render(
      <TechnicalDropdown trigger={<button>Menu Trigger</button>}>
        <TechnicalDropdownItem>Item 1</TechnicalDropdownItem>
      </TechnicalDropdown>
    );
    expect(screen.getByText('Menu Trigger')).toBeInTheDocument();
  });

  it('debe disparar el evento onClick al seleccionar un item', () => {
    const mockClick = vi.fn();
    // Forzamos el menú abierto para el test
    render(
      <TechnicalDropdown trigger={<button>Open</button>} open={true}>
        <TechnicalDropdownItem onClick={mockClick}>Action</TechnicalDropdownItem>
      </TechnicalDropdown>
    );

    const item = screen.getByText('Action');
    fireEvent.click(item);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('debe aplicar la clase de deshabilitado correctamente', () => {
    render(
      <TechnicalDropdown trigger={<button>Open</button>} open={true}>
        <TechnicalDropdownItem disabled={true}>Locked</TechnicalDropdownItem>
      </TechnicalDropdown>
    );

    const item = screen.getByText('Locked').closest('div');
    expect(item).toHaveClass('opacity-40');
    expect(item).toHaveClass('cursor-not-allowed');
  });
});
