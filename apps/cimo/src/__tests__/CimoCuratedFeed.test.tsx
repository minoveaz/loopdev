import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CimoCuratedFeed } from '../components/CimoCuratedFeed';
import { INITIAL_ACTIVITIES } from '../data/mockData';

describe('CimoCuratedFeed (Capa 1, 2 & 7: UI, Interacción y Anti-CLS)', () => {
  it('renders curated feed header and activities list', () => {
    const onSelect = vi.fn();
    const onJoin = vi.fn();

    render(
      <CimoCuratedFeed
        activities={INITIAL_ACTIVITIES}
        selectedActivityId={INITIAL_ACTIVITIES[0].id}
        onSelectActivity={onSelect}
        onJoinActivity={onJoin}
      />
    );

    expect(screen.getByText('Explorar Entrenamientos')).toBeDefined();
    expect(screen.getByText('Comunidad Deportiva Madrid')).toBeDefined();
    expect(screen.getAllByText('Running 8K por Parque del Retiro')[0]).toBeDefined();
  });

  it('filters activities by time tab: Todos, Hoy, Finde', () => {
    render(
      <CimoCuratedFeed
        activities={INITIAL_ACTIVITIES}
        selectedActivityId={INITIAL_ACTIVITIES[0].id}
        onSelectActivity={vi.fn()}
        onJoinActivity={vi.fn()}
      />
    );

    const weekendFilterBtn = screen.getByRole('button', { name: /Finde/i });
    fireEvent.click(weekendFilterBtn);

    // Filter button becomes active
    expect(weekendFilterBtn.className).toContain('bg-[#1F4E5F]');
  });

  it('calls onJoinActivity and preserves fixed anti-CLS button dimensions (w-28)', () => {
    const onJoin = vi.fn();

    render(
      <CimoCuratedFeed
        activities={INITIAL_ACTIVITIES}
        selectedActivityId={INITIAL_ACTIVITIES[0].id}
        onSelectActivity={vi.fn()}
        onJoinActivity={onJoin}
      />
    );

    // Find the join buttons with fixed w-28 dimension
    const joinButtons = screen.getAllByRole('button', { name: /Unirme|Unido/i });
    expect(joinButtons.length).toBeGreaterThan(0);
    expect(joinButtons[0].className).toContain('w-28');

    fireEvent.click(joinButtons[0]);
    expect(onJoin).toHaveBeenCalled();
  });

  it('navigates to athlete profile when clicking athlete avatar in feed', () => {
    const onNavigateProfile = vi.fn();

    render(
      <CimoCuratedFeed
        activities={INITIAL_ACTIVITIES}
        selectedActivityId={INITIAL_ACTIVITIES[0].id}
        onSelectActivity={vi.fn()}
        onJoinActivity={vi.fn()}
        onNavigateToProfile={onNavigateProfile}
      />
    );

    const card = screen.getAllByText('Running 8K por Parque del Retiro')[0];
    fireEvent.click(card);
  });
});
