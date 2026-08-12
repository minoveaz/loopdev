import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SidebarFooter } from './index';
import React from 'react';

describe('SidebarFooter Composite', () => {
  it('no debe duplicar la identidad del usuario en el sidebar', () => {
    render(<SidebarFooter isRail navMode="hover" onNavModeChange={() => {}} />);
    expect(screen.queryByText(/miller/i)).not.toBeInTheDocument();
    expect(document.querySelector('.rounded-full')).not.toBeInTheDocument();
  });

  it('debe mostrar solo el selector de comportamiento', () => {
    render(<SidebarFooter navMode="hover" onNavModeChange={() => {}} />);

    expect(screen.getByRole('button', { name: 'Sidebar control' })).toBeInTheDocument();
    expect(screen.queryByTitle('Ajustes de cuenta')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Contraer')).not.toBeInTheDocument();

  });

});
