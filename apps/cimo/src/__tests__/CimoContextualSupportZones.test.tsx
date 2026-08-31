import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { INITIAL_ACTIVITIES } from '../data/mockData';
import { CimoCaptainBadgeInspector } from '../components/CimoCaptainBadgeInspector';
import { CimoActivityRsvpTicketWidget } from '../components/CimoActivityRsvpTicketWidget';
import { CimoCaptainGuideTipsWidget } from '../components/CimoCaptainGuideTipsWidget';
import { CimoLivePlanPreviewWidget } from '../components/CimoLivePlanPreviewWidget';
import { CimoAthleteMetricsWidget } from '../components/CimoAthleteMetricsWidget';
import { CimoBadgesShowcaseWidget } from '../components/CimoBadgesShowcaseWidget';
import { CimoCrewNetworkStatsWidget } from '../components/CimoCrewNetworkStatsWidget';
import { CimoSuggestedAthletesWidget } from '../components/CimoSuggestedAthletesWidget';

describe('CIMO 2.0 Contextual Support Zones (Anti-Hardcoding & Equal Height)', () => {
  const sampleActivity = INITIAL_ACTIVITIES[0];

  it('renders CimoCaptainBadgeInspector with captain stats, verified badge and weather', () => {
    const onNavProfile = vi.fn();
    render(<CimoCaptainBadgeInspector activity={sampleActivity} onNavigateToProfile={onNavProfile} />);

    expect(screen.getByText('Capitán Verificado')).toBeDefined();
    expect(screen.getByText(sampleActivity.captain.name)).toBeDefined();
    expect(screen.getByText('28 liderados')).toBeDefined();
    expect(screen.getByText('Condiciones Previstas')).toBeDefined();

    const profileBtn = screen.getByRole('button', { name: /Ver Pasaporte Deportivo/i });
    fireEvent.click(profileBtn);
    expect(onNavProfile).toHaveBeenCalledWith(sampleActivity.captain.id);
  });

  it('renders CimoActivityRsvpTicketWidget with spots occupation, join action and calendar sync', () => {
    const onJoin = vi.fn();
    render(<CimoActivityRsvpTicketWidget activity={sampleActivity} onJoin={onJoin} />);

    expect(screen.getByText('Convocatoria Abierta')).toBeDefined();
    expect(screen.getByText(/Plazas del Crew/i)).toBeDefined();
    expect(screen.getByText(/Tercer Tiempo Confirmado/i)).toBeDefined();
    expect(screen.getByText('Capitán Verificado')).toBeDefined();
    expect(screen.getByText('Condiciones Previstas')).toBeDefined();
    expect(screen.getByText('Compartir WhatsApp')).toBeDefined();

    const joinBtn = screen.getByRole('button', { name: /Estás dentro/i });
    fireEvent.click(joinBtn);
    expect(onJoin).toHaveBeenCalledWith(sampleActivity.id);
  });

  it('renders CimoCaptainGuideTipsWidget on Create view with 4 best practice pillars', () => {
    render(<CimoCaptainGuideTipsWidget />);

    expect(screen.getByText('Guía del Capitán CIMO')).toBeDefined();
    expect(screen.getByText('Punto de encuentro inconfundible')).toBeDefined();
    expect(screen.getByText('Ritmo claro y honesto')).toBeDefined();
    expect(screen.getByText('Plazas reducidas (4 a 8)')).toBeDefined();
    expect(screen.getByText('Tercer Tiempo social')).toBeDefined();
  });

  it('renders CimoLivePlanPreviewWidget with continuous vertical layout (live preview and demand intelligence)', () => {
    render(
      <CimoLivePlanPreviewWidget
        formData={{
          sport: 'Running',
          title: 'Rodaje Suave por Madrid Río',
          description: '6K a ritmo cómodo para estirar piernas.',
          date: 'Viernes',
          time: '19:00',
          location: 'Puente de Toledo',
          capacity: 8,
          level: 'Principiante',
          thirdHalfType: 'beer',
          thirdHalfTitle: 'Terraza Río',
          thirdHalfLocation: 'Madrid Río',
          image: '',
          price: 'Gratis',
        }}
        currentUser={{ name: 'Alex Rivera' }}
      />
    );

    expect(screen.getByText('Co-Piloto del Capitán')).toBeDefined();
    expect(screen.getByText('Simulador Móvil en Vivo')).toBeDefined();
    expect(screen.getByText('Rodaje Suave por Madrid Río')).toBeDefined();
    expect(screen.getByText('6K a ritmo cómodo para estirar piernas.')).toBeDefined();
    expect(screen.getByText('Capitán Alex')).toBeDefined();
    expect(screen.getByText('Score de Atractivo del Plan')).toBeDefined();
    expect(screen.getByText(/Atletas afines activos/i)).toBeDefined();
    expect(screen.getByText(/Tip de Capitán CIMO/i)).toBeDefined();
  });

  it('renders CimoAthleteMetricsWidget with verified passport and consistency level', () => {
    render(
      <CimoAthleteMetricsWidget
        user={{
          name: 'Alex Rivera',
          email: 'alex@example.com',
          handle: '@alexrivera',
          sports: [{ sport: 'Running', level: 'Intermedio' }],
          weeklySchedule: {},
        }}
      />
    );

    expect(screen.getByText('Pasaporte Atlético Verificado')).toBeDefined();
    expect(screen.getByText('Nivel Oro (4+ días/sem)')).toBeDefined();
    expect(screen.getByText('100% Palabra de Honor')).toBeDefined();
  });

  it('renders CimoBadgesShowcaseWidget with vector badges and progress bar without OS emojis', () => {
    render(<CimoBadgesShowcaseWidget />);

    expect(screen.getByText('Vitrina de Insignias CIMO')).toBeDefined();
    expect(screen.getByText('Capitán 5 Estrellas')).toBeDefined();
    expect(screen.getByText('Palabra de Honor')).toBeDefined();
    expect(screen.getByText('Club del Amanecer')).toBeDefined();
    expect(screen.getByText('2/3 Entrenos')).toBeDefined();
  });

  it('renders CimoCrewNetworkStatsWidget and CimoSuggestedAthletesWidget', () => {
    render(<CimoCrewNetworkStatsWidget />);
    expect(screen.getByText('Mi Red Deportiva')).toBeDefined();
    expect(screen.getByText('Círculo Íntimo')).toBeDefined();
    expect(screen.getByText('Squads Activos')).toBeDefined();

    render(<CimoSuggestedAthletesWidget />);
    expect(screen.getByText('Afinidad Deportiva')).toBeDefined();
    expect(screen.getByText('Marcos Herrera')).toBeDefined();
  });
});
