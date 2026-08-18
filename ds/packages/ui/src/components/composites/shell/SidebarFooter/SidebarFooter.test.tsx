import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SidebarFooter } from './index';
import React from 'react';

describe('SidebarFooter Composite', () => {
  it('mantiene el footer desktop libre de identidad y acciones globales', () => {
    render(<SidebarFooter navMode="expanded" onNavModeChange={() => {}} />);
    expect(screen.queryByText('Alex Morgan')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Help center' })).not.toBeInTheDocument();
  });

  it('debe mostrar solo el selector de comportamiento', () => {
    render(<SidebarFooter navMode="hover" onNavModeChange={() => {}} />);

    expect(screen.getByRole('button', { name: 'Sidebar control' })).toBeInTheDocument();
    expect(screen.queryByTitle('Ajustes de cuenta')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Contraer')).not.toBeInTheDocument();

  });

});
