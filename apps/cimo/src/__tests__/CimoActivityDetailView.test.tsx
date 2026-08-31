import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CimoActivityDetailView } from '../components/CimoActivityDetailView';
import { INITIAL_ACTIVITIES } from '../data/mockData';

describe('CimoActivityDetailView (Capa 1, 2 & 5: Vista Inmersiva, Chat, Mapa y Resiliencia)', () => {
  const mockActivity = INITIAL_ACTIVITIES[0];

  it('renders activity details, captain verified badge, itinerary and third half', () => {
    render(
      <CimoActivityDetailView
        activity={mockActivity}
        chatMessages={[]}
        onBack={vi.fn()}
        onJoin={vi.fn()}
        onSendMessage={vi.fn()}
      />
    );

    expect(screen.getByText('Información del Plan')).toBeDefined();
    expect(screen.getByText('Itinerario Previsto')).toBeDefined();
    expect(screen.getByText('Tercer Tiempo Organizado')).toBeDefined();
    expect(screen.getByText(mockActivity.captain.name)).toBeDefined();
  });

  it('allows sending messages to the crew chat in real-time', () => {
    const onSend = vi.fn();

    render(
      <CimoActivityDetailView
        activity={mockActivity}
        chatMessages={[]}
        onBack={vi.fn()}
        onJoin={vi.fn()}
        onSendMessage={onSend}
      />
    );

    // Switch to Chat tab
    const chatTab = screen.getByRole('button', { name: /Chat del Crew/i });
    fireEvent.click(chatTab);

    const input = screen.getByPlaceholderText(/Escribe un mensaje al Crew/i);
    fireEvent.change(input, { target: { value: '¡Nos vemos mañana en el Retiro!' } });

    const form = input.closest('form');
    if (form) fireEvent.submit(form);

    expect(onSend).toHaveBeenCalledWith(mockActivity.id, '¡Nos vemos mañana en el Retiro!');
  });

  it('supports sharing the activity link and copy to clipboard with toast feedback', () => {
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });

    render(
      <CimoActivityDetailView
        activity={mockActivity}
        chatMessages={[]}
        onBack={vi.fn()}
        onJoin={vi.fn()}
        onSendMessage={vi.fn()}
      />
    );

    const shareBtn = screen.getByRole('button', { name: /Compartir/i });
    fireEvent.click(shareBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  it('navigates to member profile when clicking an attendee', () => {
    const onNavigateProfile = vi.fn();

    render(
      <CimoActivityDetailView
        activity={mockActivity}
        chatMessages={[]}
        onBack={vi.fn()}
        onJoin={vi.fn()}
        onSendMessage={vi.fn()}
        onNavigateToProfile={onNavigateProfile}
      />
    );

    const captainName = screen.getByText(mockActivity.captain.name);
    fireEvent.click(captainName);

    expect(onNavigateProfile).toHaveBeenCalled();
  });

  it('renders Breadcrumbs navigation and injects Schema.org JSON-LD structured data', () => {
    render(
      <CimoActivityDetailView
        activity={mockActivity}
        chatMessages={[]}
        onBack={vi.fn()}
        onJoin={vi.fn()}
        onSendMessage={vi.fn()}
      />
    );

    // Visual Breadcrumbs navigation
    expect(screen.getByRole('navigation', { name: /Migas de pan/i })).toBeDefined();

    // Check JSON-LD scripts in head
    const sportsScript = document.getElementById('cimo-schema-sports-event');
    expect(sportsScript).toBeDefined();
    expect(sportsScript?.textContent).toContain('SportsEvent');
    expect(sportsScript?.textContent).toContain(mockActivity.title);

    const breadcrumbsScript = document.getElementById('cimo-schema-breadcrumbs');
    expect(breadcrumbsScript).toBeDefined();
    expect(breadcrumbsScript?.textContent).toContain('BreadcrumbList');
  });
});
