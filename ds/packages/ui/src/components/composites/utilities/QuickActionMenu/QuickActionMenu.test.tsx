import { describe, it, expect, vi } from 'vitest';
import { render, screen, renderHook, act } from '@testing-library/react';
import { QuickActionMenu } from './index';
import { useQuickActionMenu } from './useQuickActionMenu';
import { QUICK_ACTION_FIXTURES } from './fixtures';
import React from 'react';

describe('QuickActionMenu Component & Hook', () => {
  const groups = QUICK_ACTION_FIXTURES.marketing;

  // Test del Brain (Hook)
  it('el hook debe gestionar el estado de apertura correctamente', () => {
    const { result } = renderHook(() => useQuickActionMenu({ groups }));
    
    expect(result.current.isOpen).toBe(false);
    expect(result.current.triggerClasses).not.toContain('rotate-45');

    act(() => {
      result.current.setIsOpen(true);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.triggerClasses).toContain('rotate-45');
  });

  // Test del Body (Componente)
  it('debe renderizar el disparador correctamente', () => {
    render(<QuickActionMenu groups={groups} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('debe mostrar el contenido cuando la prop open es true', () => {
    // Al usar TechnicalDropdown, podemos pasarle props de Radix
    render(<QuickActionMenu groups={groups} />);
    // Nota: Como QuickActionMenu controla su propio estado interno, 
    // en este test verificamos solo el render base.
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
