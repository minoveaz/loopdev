import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TechnicalMenuItem } from './index';
import React from 'react';

describe('TechnicalMenuItem Atom', () => {
  it('debe renderizar el label correctamente', () => {
    render(
      <DropdownMenu.Root open={true}>
        <DropdownMenu.Content>
          <TechnicalMenuItem label="Test Item" />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('debe aplicar la clase de peligro para la variante danger', () => {
    const { container } = render(
      <DropdownMenu.Root open={true}>
        <DropdownMenu.Content>
          <TechnicalMenuItem label="Delete" variant="danger" />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
    const item = screen.getByText('Delete').closest('div');
    expect(item).toHaveClass('text-danger');
  });

  it('debe disparar el evento onClick al ser pulsado', () => {
    const mockClick = vi.fn();
    render(
      <DropdownMenu.Root open={true}>
        <DropdownMenu.Content>
          <TechnicalMenuItem label="Clickable" onClick={mockClick} />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
    
    fireEvent.click(screen.getByText('Clickable'));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('debe mostrar el atajo de teclado si se proporciona', () => {
    render(
      <DropdownMenu.Root open={true}>
        <DropdownMenu.Content>
          <TechnicalMenuItem label="Settings" shortcut="⌘S" />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
    expect(screen.getByText('⌘S')).toBeInTheDocument();
  });
});
