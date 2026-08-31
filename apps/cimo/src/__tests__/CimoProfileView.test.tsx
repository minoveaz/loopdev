import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CimoProfileView } from '../components/CimoProfileView';
import { getAthleteProfileById } from '../data/mockAthletes';

describe('CimoProfileView (Capa 1, 2 & 5: Pasaporte Deportivo, Ficha Técnica y Resiliencia)', () => {
  const ownUser = getAthleteProfileById('alexrivera');
  const otherUser = getAthleteProfileById('sofia-diaz');

  it('renders own profile with [Editar Perfil] button and stats grid', () => {
    const onEdit = vi.fn();

    render(
      <CimoProfileView
        user={ownUser}
        isOwnProfile={true}
        onEditProfile={onEdit}
      />
    );

    expect(screen.getByText('Alex Rivera')).toBeDefined();
    expect(screen.getByText('Tus Entrenos Activos y Liderados')).toBeDefined();

    const editBtn = screen.getByRole('button', { name: /Editar Perfil/i });
    expect(editBtn).toBeDefined();

    fireEvent.click(editBtn);
    expect(onEdit).toHaveBeenCalled();
  });

  it('renders another athlete profile with [Contactar] button instead of [Editar]', () => {
    render(
      <CimoProfileView
        user={otherUser}
        isOwnProfile={false}
      />
    );

    expect(screen.getByText('Sofía Díaz')).toBeDefined();
    expect(screen.queryByRole('button', { name: /Editar Perfil/i })).toBeNull();
    expect(screen.getByRole('button', { name: /Contactar/i })).toBeDefined();
  });

  it('switches to Deportes tab to view weekly schedule and technical sheet', () => {
    render(
      <CimoProfileView
        user={ownUser}
        isOwnProfile={true}
      />
    );

    const sportsTab = screen.getByRole('button', { name: /Deportes & Ritmos/i });
    fireEvent.click(sportsTab);

    expect(screen.getByText('Tus Deportes y Marcas de Ritmo')).toBeDefined();
    expect(screen.getByText('Estilo Social & Preferencias de Crew')).toBeDefined();
  });

  it('switches to Insignias tab and displays athlete badges', () => {
    render(
      <CimoProfileView
        user={ownUser}
        isOwnProfile={true}
      />
    );

    const badgesTab = screen.getByRole('button', { name: /Insignias/i });
    fireEvent.click(badgesTab);

    expect(screen.getByText('Capitán Fundador')).toBeDefined();
    expect(screen.getByText('Constancia de Oro')).toBeDefined();
    expect(screen.getByText('Puntualidad 100%')).toBeDefined();
  });

  it('handles broken cover image with fallback onError without crashing', () => {
    const brokenUser = {
      ...ownUser,
      coverUrl: 'https://invalid-broken-url.example/broken.jpg',
    };

    render(
      <CimoProfileView
        user={brokenUser}
        isOwnProfile={true}
      />
    );

    const coverImg = screen.getByAltText('Cover') as HTMLImageElement;
    expect(coverImg).toBeDefined();

    // Trigger onError
    fireEvent.error(coverImg);
    expect(coverImg.src).toContain('unsplash.com');
  });
});
