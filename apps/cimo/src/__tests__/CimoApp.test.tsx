import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('CIMO 2.0 Experience Integration', () => {
  it('renders CIMO 2.0 floating search bar, curated feed sections and athlete stats', () => {
    render(<App />);

    // Airbnb Style Floating Search Bar
    expect(screen.getByText('Deporte')).toBeDefined();
    expect(screen.getByText('Cuándo')).toBeDefined();
    expect(screen.getByText('Zona')).toBeDefined();

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
    expect(screen.getByText('Mis Deportes & Niveles')).toBeDefined();
  });

  it('opens Create Plan modal when clicking Crear Plan button', () => {
    render(<App />);

    const createBtn = screen.getByRole('button', { name: /Crear Plan/i });
    fireEvent.click(createBtn);

    expect(screen.getByText('Publica tu entrenamiento')).toBeDefined();
    expect(screen.getByPlaceholderText('Ej: Rodaje 10K suave por Madrid Río')).toBeDefined();
  });
});
