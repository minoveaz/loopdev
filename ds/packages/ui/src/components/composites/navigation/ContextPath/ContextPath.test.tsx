import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContextPath } from './index';
import { CONTEXT_PATH_FIXTURES } from './fixtures';
import React from 'react';

describe('ContextPath Composite', () => {
  it('debe renderizar todos los segmentos si están dentro del límite', () => {
    const segments = CONTEXT_PATH_FIXTURES.marketing_brands;
    render(<ContextPath segments={segments} />);
    expect(screen.getByText('Marketing Studio')).toBeInTheDocument();
    expect(screen.getByText('Brand Hub')).toBeInTheDocument();
    expect(screen.getByText('Logotipos')).toBeInTheDocument();
  });

  it('debe colapsar los niveles intermedios si superan el límite', () => {
    const segments = CONTEXT_PATH_FIXTURES.deep_route;
    render(<ContextPath segments={segments} maxVisible={3} />);
    // Debe mostrar el primero, los puntos suspensivos y los últimos 2
    expect(screen.getByText('Marketing')).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getByText('Social Assets')).toBeInTheDocument();
    expect(screen.getByText('Instagram Post')).toBeInTheDocument();
    // No debe mostrar 'Campaigns' ni 'Black Friday'
    expect(screen.queryByText('Campaigns')).not.toBeInTheDocument();
  });

  it('debe disparar onNavigate al hacer clic en un segmento inactivo', () => {
    const mockNavigate = vi.fn();
    const segments = CONTEXT_PATH_FIXTURES.marketing_brands;
    render(<ContextPath segments={segments} onNavigate={mockNavigate} />);
    
    const firstSegment = screen.getByText('Marketing Studio');
    fireEvent.click(firstSegment);
    expect(mockNavigate).toHaveBeenCalledWith('/marketing-studio');
  });

  it('no debe disparar onNavigate al hacer clic en el último segmento', () => {
    const mockNavigate = vi.fn();
    const segments = CONTEXT_PATH_FIXTURES.marketing_brands;
    render(<ContextPath segments={segments} onNavigate={mockNavigate} />);
    
    const lastSegment = screen.getByText('Logotipos');
    fireEvent.click(lastSegment);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
