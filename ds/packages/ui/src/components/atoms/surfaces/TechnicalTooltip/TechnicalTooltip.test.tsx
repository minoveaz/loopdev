import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TechnicalTooltip } from './index';
import React from 'react';

describe('TechnicalTooltip Atom', () => {
  it('debe renderizar el disparador correctamente', () => {
    render(
      <TechnicalTooltip content="Info">
        <button>Hover me</button>
      </TechnicalTooltip>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('debe mostrar el contenido después del hover', async () => {
    const user = userEvent.setup();
    render(
      <TechnicalTooltip content="Metadata_Technical" delayDuration={0}>
        <button>Trigger</button>
      </TechnicalTooltip>
    );

    const trigger = screen.getByText('Trigger');
    await user.hover(trigger);

    // Esperamos a que Radix renderice el Portal
    await waitFor(() => {
      expect(screen.getAllByText('Metadata_Technical')[0]).toBeInTheDocument();
    });
  });

  it('debe contener los brackets de identidad', async () => {
    const user = userEvent.setup();
    render(
      <TechnicalTooltip content="Test" delayDuration={0} open={true}>
        <button>Trigger</button>
      </TechnicalTooltip>
    );

    // Verificamos la presencia de los brackets { y }
    // Radix duplica el contenido para lectores de pantalla, usamos getAll
    expect(screen.getAllByText('{')[0]).toBeInTheDocument();
    expect(screen.getAllByText('}')[0]).toBeInTheDocument();
  });
});
