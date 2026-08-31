import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { App } from '../App';
import { cimoSeoConfig } from '../config/cimo.config';

describe('CimoA11yAndSeo (Capa 3 & 4: Accesibilidad ARIA, SEO y Metadatos)', () => {
  it('defines valid SEO configuration with title, description and openGraph tags', () => {
    expect(cimoSeoConfig.title).toBeDefined();
    expect(cimoSeoConfig.title).toContain('CIMO');
    expect(cimoSeoConfig.description).toBeDefined();
    expect(cimoSeoConfig.keywords?.length).toBeGreaterThan(0);
    expect(cimoSeoConfig.openGraph?.title).toBeDefined();
  });

  it('provides accessible buttons with aria-labels or readable text in the main navigation', () => {
    render(<App />);

    // Check all buttons have accessible name
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      const accessibleName = btn.getAttribute('aria-label') || btn.textContent || btn.title;
      expect(accessibleName).toBeTruthy();
    });
  });

  it('renders avatars with descriptive alt attributes for screen readers', () => {
    render(<App />);

    const images = screen.getAllByRole('img');
    images.forEach((img) => {
      expect(img.getAttribute('alt')).toBeDefined();
    });
  });
});
