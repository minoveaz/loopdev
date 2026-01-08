import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SuiteSwitcher } from './index';
import { AVAILABLE_SUITES_FIXTURES } from './fixtures';
import React from 'react';

describe('SuiteSwitcher Composite', () => {
  const currentSuite = AVAILABLE_SUITES_FIXTURES[0];

  it('debe renderizar el nombre de la suite actual en el disparador', () => {
    render(
      <SuiteSwitcher 
        currentSuite={currentSuite} 
        availableSuites={AVAILABLE_SUITES_FIXTURES} 
        onSuiteChange={() => {}} 
      />
    );
    expect(screen.getByText(currentSuite.suiteName)).toBeInTheDocument();
  });

  it('debe tener el rol de botón para el disparador', () => {
    render(
      <SuiteSwitcher 
        currentSuite={currentSuite} 
        availableSuites={AVAILABLE_SUITES_FIXTURES} 
        onSuiteChange={() => {}} 
      />
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('debe renderizar el isotipo del logo de marca', () => {
    const { container } = render(
      <SuiteSwitcher 
        currentSuite={currentSuite} 
        availableSuites={AVAILABLE_SUITES_FIXTURES} 
        onSuiteChange={() => {}} 
      />
    );
    // Verificamos que el BrandLogo Isotype esté presente (cuadro azul)
    expect(container.querySelector('.bg-primary')).toBeInTheDocument();
  });
});
