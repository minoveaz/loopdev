import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { App } from '../App';

describe('CIMO App Pilot Integration', () => {
  it('renders CIMO header, 3-column feed and allows filtering by sport', () => {
    render(<App />);

    // Brand and Header
    expect(screen.getByText('Planes de Hoy y Esta Semana')).toBeDefined();

    // Filters
    expect(screen.getByText('Deportes')).toBeDefined();
    expect(screen.getAllByText('Running 8K Rodaje Suave').length).toBeGreaterThanOrEqual(1);

    // Inspector
    expect(screen.getByText('Chat Crew')).toBeDefined();
  });

  it('opens Auth Modal when clicking login button', () => {
    render(<App />);

    const loginBtn = screen.getByRole('button', { name: 'Entrar' });
    fireEvent.click(loginBtn);

    expect(screen.getByText('Conéctate a CIMO')).toBeDefined();
    expect(screen.getByPlaceholderText('tu.email@ejemplo.com')).toBeDefined();
  });
});
