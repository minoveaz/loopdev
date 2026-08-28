import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ActivityCard } from '../community/ActivityCard';
import { CrewAvatarGroup } from '../community/CrewAvatarGroup';
import { ChatStreamWidget } from '../community/ChatStreamWidget';
import { FeedbackRatingBlock } from '../community/FeedbackRatingBlock';

const mockActivity = {
  id: 'act-1',
  title: 'Running 8K Parque del Retiro',
  sport: 'Running',
  date: 'Hoy',
  time: '19:30',
  location: 'Puerta de Alcalá, Madrid',
  level: 'Intermedio' as const,
  maxMembers: 6,
  captain: { id: 'user-1', name: 'Sofía' },
  currentMembers: [
    { id: 'user-1', name: 'Sofía' },
    { id: 'user-2', name: 'Carlos' },
    { id: 'user-3', name: 'Elena' },
  ],
};

describe('Community Blocks (CIMO)', () => {
  it('renders ActivityCard with sport, level, date, location and handles join action', () => {
    const handleJoin = vi.fn();
    render(<ActivityCard data={mockActivity} onJoin={handleJoin} />);

    expect(screen.getByText('Running 8K Parque del Retiro')).toBeDefined();
    expect(screen.getByText('Running')).toBeDefined();
    expect(screen.getByText('Intermedio')).toBeDefined();
    expect(screen.getByText(/Crew 3\/6/)).toBeDefined();

    const joinBtn = screen.getByRole('button', { name: /Join Crew/i });
    fireEvent.click(joinBtn);
    expect(handleJoin).toHaveBeenCalledWith('act-1');
  });

  it('renders CrewAvatarGroup with member count badge if overflow occurs', () => {
    render(<CrewAvatarGroup members={mockActivity.currentMembers} maxVisible={2} />);
    expect(screen.getByText('+1')).toBeDefined();
  });

  it('renders ChatStreamWidget and allows sending messages', () => {
    const handleSend = vi.fn();
    render(
      <ChatStreamWidget
        messages={[
          { id: '1', senderId: 'user-1', senderName: 'Sofía', text: '¡Nos vemos en 10 min!', timestamp: '19:20' },
        ]}
        onSendMessage={handleSend}
      />,
    );

    expect(screen.getByText('¡Nos vemos en 10 min!')).toBeDefined();

    const input = screen.getByPlaceholderText('Escribe un mensaje...');
    fireEvent.change(input, { target: { value: '¡Voy de camino!' } });
    fireEvent.submit(input.closest('form')!);

    expect(handleSend).toHaveBeenCalledWith('¡Voy de camino!');
  });

  it('renders FeedbackRatingBlock and submits rating with tags', () => {
    const handleSubmit = vi.fn();
    render(<FeedbackRatingBlock activityTitle="Running 8K" onSubmit={handleSubmit} />);

    expect(screen.getByText('Running 8K')).toBeDefined();

    // Click a tag
    const tagBtn = screen.getByText('Puntualidad excelente');
    fireEvent.click(tagBtn);

    // Submit form
    const submitBtn = screen.getByRole('button', { name: 'Enviar valoración' });
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith({
      rating: 5,
      comment: undefined,
      tags: ['Puntualidad excelente'],
    });
  });
});
