import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CimoCrewNetworkView } from '../components/CimoCrewNetworkView';

describe('CimoCrewNetworkView (Capa 1 & 2: Mi Crew, Squads y Conexiones)', () => {
  it('renders Bloque 1 (Tus Squads Habituales) and Bloque 2 (Tu Círculo Íntimo)', () => {
    render(<CimoCrewNetworkView onBackToExplore={vi.fn()} />);

    expect(screen.getByText('Mi Red de Crew')).toBeDefined();
    expect(screen.getByText('Tus Squads Habituales')).toBeDefined();
    expect(screen.getByText('Tu Círculo Íntimo de Compañeros')).toBeDefined();
    expect(screen.getByText('Retiro Morning Runners')).toBeDefined();
  });

  it('filters squads and connections by sport tabs (Running, Pádel, Hiking)', () => {
    render(<CimoCrewNetworkView onBackToExplore={vi.fn()} />);

    const padelFilterBtn = screen.getByRole('button', { name: /Pádel/i });
    fireEvent.click(padelFilterBtn);

    expect(screen.getByText('Cuarteto Pádel Chamartín')).toBeDefined();
  });

  it('navigates to Squad Hub when clicking Hub button on a squad', () => {
    const onNavigateSquad = vi.fn();

    render(<CimoCrewNetworkView onBackToExplore={vi.fn()} onNavigateToSquad={onNavigateSquad} />);

    const hubBtns = screen.getAllByRole('button', { name: /Hub/i });
    expect(hubBtns.length).toBeGreaterThan(0);

    fireEvent.click(hubBtns[0]);
    expect(onNavigateSquad).toHaveBeenCalledWith('retiro-morning-runners');
  });

  it('navigates to athlete profile when clicking athlete avatar', () => {
    const onNavigateProfile = vi.fn();

    render(
      <CimoCrewNetworkView onBackToExplore={vi.fn()} onNavigateToProfile={onNavigateProfile} />,
    );

    const sofiaDiazName = screen.getByText('Sofía Díaz');
    fireEvent.click(sofiaDiazName);

    expect(onNavigateProfile).toHaveBeenCalled();
  });
});
