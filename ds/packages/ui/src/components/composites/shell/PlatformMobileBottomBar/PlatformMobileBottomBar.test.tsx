import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PlatformMobileBottomBar } from './index';

describe('PlatformMobileBottomBar - AI-First Global Mobile Bar', () => {
  it('renders all 5 canonical buttons with accessible labels', () => {
    render(<PlatformMobileBottomBar />);

    expect(screen.getByRole('toolbar', { name: 'Barra de navegación principal móvil' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir navegación de módulos' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buscar en la plataforma' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Acción rápida' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir asistente de IA' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Perfil y ajustes' })).toBeInTheDocument();
  });

  it('triggers callbacks when buttons are clicked', () => {
    const onOpenNavigation = vi.fn();
    const onOpenSearch = vi.fn();
    const onQuickAction = vi.fn();
    const onOpenAI = vi.fn();
    const onOpenProfile = vi.fn();

    render(
      <PlatformMobileBottomBar
        onOpenNavigation={onOpenNavigation}
        onOpenSearch={onOpenSearch}
        onQuickAction={onQuickAction}
        onOpenAI={onOpenAI}
        onOpenProfile={onOpenProfile}
        quickActionLabel="Crear nuevo registro"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Abrir navegación de módulos' }));
    expect(onOpenNavigation).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Buscar en la plataforma' }));
    expect(onOpenSearch).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Crear nuevo registro' }));
    expect(onQuickAction).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Abrir asistente de IA' }));
    expect(onOpenAI).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Perfil y ajustes' }));
    expect(onOpenProfile).toHaveBeenCalledTimes(1);
  });

  it('reflects the activeContext through aria-pressed', () => {
    const { rerender } = render(<PlatformMobileBottomBar activeContext="ai" />);

    expect(screen.getByRole('button', { name: 'Abrir asistente de IA' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Abrir navegación de módulos' })).toHaveAttribute('aria-pressed', 'false');

    rerender(<PlatformMobileBottomBar activeContext="navigation" />);
    expect(screen.getByRole('button', { name: 'Abrir asistente de IA' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Abrir navegación de módulos' })).toHaveAttribute('aria-pressed', 'true');
  });
});
