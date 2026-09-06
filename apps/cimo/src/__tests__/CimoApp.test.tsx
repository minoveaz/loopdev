import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '../App';

describe('CIMO 2.0 Dedicated Views Integration', () => {
  beforeEach(() => {
    window.location.hash = '#/app/home';
  });
  it('renders CIMO 2.0 floating search bar, curated feed sections and athlete stats', () => {
    render(<App />);

    // Airbnb Style Floating Search Bar
    expect(screen.getByText('Deporte')).toBeDefined();
    expect(screen.getByText('Cuándo')).toBeDefined();
    expect(screen.getByText('Ciudad')).toBeDefined();

    // Curated Feed Surface Header
    expect(screen.getByText('Explorar Entrenamientos')).toBeDefined();
    expect(screen.getByText('Comunidad Deportiva Madrid')).toBeDefined();

    // Strava Style Athlete Profile Card (Left column)
    expect(screen.getByText('Constancia Semanal')).toBeDefined();
    expect(screen.getByText('Sé Capitán CIMO')).toBeDefined();

    // Strava Style Community Widgets (Right column)
    expect(screen.getByText('Tus Próximos Entrenos')).toBeDefined();
    expect(screen.getByText('Capitanes de la Comunidad')).toBeDefined();
  });

  it('navigates to dedicated Create Plan view when clicking Crear Plan button', () => {
    render(<App />);

    const createBtn = screen.getByRole('button', { name: /Crear Plan/i });
    fireEvent.click(createBtn);

    expect(screen.getByText('Crea tu Entrenamiento Grupal')).toBeDefined();
    expect(screen.getByText('Elige el deporte')).toBeDefined();
    expect(screen.getByText('¿Qué día entrenamos?')).toBeDefined();
    expect(screen.getByText('¿A qué hora nos vemos?')).toBeDefined();
    expect(screen.getByText('Ciudad y punto de encuentro')).toBeDefined();
    expect(screen.getByText('Ritmo y nivel del grupo')).toBeDefined();
    expect(screen.getByText('¿Cuántas personas como máximo?')).toBeDefined();
    expect(screen.getByText('Volver a Explorar')).toBeDefined();
  });

  it('navigates to dedicated Activity Detail view when clicking an activity card', () => {
    render(<App />);

    const activityTitle = screen.getAllByText('Running 8K por Parque del Retiro')[0];
    fireEvent.click(activityTitle);

    expect(screen.getByText('Información del Plan')).toBeDefined();
    expect(screen.getByText('Ritmo & Exigencia')).toBeDefined();
    expect(screen.getByText('Volver a Explorar')).toBeDefined();
  });

  it('switches between tabs: Feed, Chats and Profile', () => {
    render(<App />);

    // Switch to Chats
    const chatsTab = screen.getAllByRole('button', { name: /Chats/i })[0];
    fireEvent.click(chatsTab);
    expect(screen.getByText('Chats de tus Crews')).toBeDefined();

    // Switch to Profile
    const profileTab = screen.getAllByRole('button', { name: /Perfil/i })[0];
    fireEvent.click(profileTab);
    expect(screen.getAllByText('Alex Rivera').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Editar Perfil')).toBeDefined();
    expect(screen.getByText('Tus Entrenos Activos y Liderados')).toBeDefined();
  });
});
