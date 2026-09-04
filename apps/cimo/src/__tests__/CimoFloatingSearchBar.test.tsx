import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CimoFloatingSearchBar } from '../components/CimoFloatingSearchBar';

describe('CimoFloatingSearchBar (Capa 2 & 3: Búsqueda Airbnb, Interacción y Teclado)', () => {
  it('renders the floating capsule with 4 key filters: Sport, When, Zone and Level', () => {
    render(
      <CimoFloatingSearchBar
        selectedSport="Todos"
        selectedDay="Cualquier día"
        selectedZone="Toda la ciudad"
        selectedLevel="Cualquier nivel"
        onSelectSport={vi.fn()}
        onSelectDay={vi.fn()}
        onSelectZone={vi.fn()}
        onSelectLevel={vi.fn()}
        onSearch={vi.fn()}
      />,
    );

    expect(screen.getByText('Deporte')).toBeDefined();
    expect(screen.getByText('Cuándo')).toBeDefined();
    expect(screen.getByText('Ciudad')).toBeDefined();
    expect(screen.getByText('Nivel')).toBeDefined();
  });

  it('opens sport dropdown, selects a sport and closes dropdown', () => {
    const onSelectSport = vi.fn();

    render(
      <CimoFloatingSearchBar
        selectedSport="Todos"
        selectedDay="Cualquier día"
        selectedZone="Toda la ciudad"
        selectedLevel="Cualquier nivel"
        onSelectSport={onSelectSport}
        onSelectDay={vi.fn()}
        onSelectZone={vi.fn()}
        onSelectLevel={vi.fn()}
        onSearch={vi.fn()}
      />,
    );

    // Click on Deporte capsule segment
    const sportSegment = screen.getByText('Deporte');
    fireEvent.click(sportSegment);

    // Check dropdown options
    expect(screen.getByText('Disciplinas disponibles en CIMO')).toBeDefined();
    const allSportsOption = screen.getByRole('button', { name: /Todos los deportes/i });
    expect(allSportsOption).toBeDefined();

    fireEvent.click(allSportsOption);
    expect(onSelectSport).toHaveBeenCalledWith('Todos');
  });

  it('closes open dropdowns when pressing Escape key', () => {
    render(
      <CimoFloatingSearchBar
        selectedSport="Todos"
        selectedDay="Cualquier día"
        selectedZone="Toda la ciudad"
        selectedLevel="Cualquier nivel"
        onSelectSport={vi.fn()}
        onSelectDay={vi.fn()}
        onSelectZone={vi.fn()}
        onSelectLevel={vi.fn()}
        onSearch={vi.fn()}
      />,
    );

    // Open dropdown
    const sportSegment = screen.getByText('Deporte');
    fireEvent.click(sportSegment);
    expect(screen.getByText('Disciplinas disponibles en CIMO')).toBeDefined();

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });

    // Dropdown is closed
    expect(screen.queryByText('Disciplinas disponibles en CIMO')).toBeNull();
  });
});
