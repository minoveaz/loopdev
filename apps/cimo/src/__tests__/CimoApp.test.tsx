import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('CIMO In-App Experience Integration', () => {
  it('renders CIMO feed, sport filters and captain details', () => {
    render(<App />);

    // Philosophy Banner
    expect(screen.getByText('Match con entrenos, no con personas')).toBeDefined();

    // Filters and Activities
    expect(screen.getByText('Filtros de Activities')).toBeDefined();
    expect(screen.getAllByText('Running 8K por Parque del Retiro').length).toBeGreaterThanOrEqual(1);

    // Inspector
    expect(screen.getByText('Chat del Crew')).toBeDefined();
  });

  it('switches between tabs: Feed, Chats and Profile', () => {
    render(<App />);

    // Switch to Chats
    const chatsTab = screen.getByRole('button', { name: /Chats/i });
    fireEvent.click(chatsTab);
    expect(screen.getByText('Chats de tus Crews')).toBeDefined();

    // Switch to Profile
    const profileTab = screen.getAllByRole('button', { name: /Perfil/i })[0];
    fireEvent.click(profileTab);
    expect(screen.getByText('Alex Rivera')).toBeDefined();
    expect(screen.getByText('Mis Deportes & Niveles')).toBeDefined();
  });

  it('opens Create Plan modal when clicking Crear button', () => {
    render(<App />);

    const createBtn = screen.getByRole('button', { name: /Crear/i });
    fireEvent.click(createBtn);

    expect(screen.getByText('Publica tu entrenamiento')).toBeDefined();
    expect(screen.getByPlaceholderText('Ej: Rodaje 10K suave por Madrid Río')).toBeDefined();
  });
});
