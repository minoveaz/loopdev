import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AdvisorCard } from '../lead-gen/AdvisorCard';
import { FaqSection } from '../lead-gen/FaqSection';
import { PricingComparisonTable } from '../b2b/PricingComparisonTable';

describe('Lead-Gen & B2B Blocks (VitaBlue & LoopDev)', () => {
  it('renders AdvisorCard with contact buttons and status badge', () => {
    const handleContact = vi.fn();
    render(
      <AdvisorCard
        advisor={{
          name: 'Marta Soler',
          role: 'Especialista en Visados de Estudiante',
          avatarUrl: 'https://example.com/avatar.jpg',
          whatsappNumber: '+34600112233',
          phone: '+34910000000',
        }}
        onContact={handleContact}
      />,
    );

    expect(screen.getByText('Marta Soler')).toBeDefined();
    expect(screen.getByText('Especialista en Visados de Estudiante')).toBeDefined();

    const whatsappBtn = screen.getByRole('button', { name: 'WhatsApp' });
    fireEvent.click(whatsappBtn);
    expect(handleContact).toHaveBeenCalledWith('whatsapp');
  });

  it('renders FaqSection and toggles accordion items', () => {
    render(
      <FaqSection
        faqs={[
          { question: '¿El seguro tiene carencias?', answer: 'No, no tiene periodos de carencia para visados.' },
          { question: '¿Incluye repatriación?', answer: 'Sí, incluye cobertura completa de repatriación.' },
        ]}
      />,
    );

    expect(screen.getByText('¿El seguro tiene carencias?')).toBeDefined();
    expect(screen.getByText('No, no tiene periodos de carencia para visados.')).toBeDefined();

    // Toggle second FAQ
    const faq2Btn = screen.getByText('¿Incluye repatriación?');
    fireEvent.click(faq2Btn);
    expect(screen.getByText('Sí, incluye cobertura completa de repatriación.')).toBeDefined();
  });

  it('renders PricingComparisonTable with tiers and CTA buttons', () => {
    const handleSelect = vi.fn();
    render(
      <PricingComparisonTable
        tiers={[
          {
            id: 'starter',
            name: 'Starter',
            price: '29€',
            period: 'mes',
            description: 'Para pequeños equipos',
            features: ['1 suite', '5 usuarios'],
            ctaLabel: 'Empezar gratis',
            onSelect: handleSelect,
          },
        ]}
      />,
    );

    expect(screen.getByText('Starter')).toBeDefined();
    expect(screen.getByText('29€')).toBeDefined();

    const ctaBtn = screen.getByRole('button', { name: 'Empezar gratis' });
    fireEvent.click(ctaBtn);
    expect(handleSelect).toHaveBeenCalled();
  });
});
