import React from 'react';
import { Hero } from '@/components/organisms/Hero';

/**
 * Snippet: marketing/CleanHero
 * A minimalist hero section for landing pages.
 */
export const CleanHero = () => (
  <Hero 
    variant="clean"
    title="Engineering Brand Excellence"
    subtitle="Scaling modern design systems with precision and speed. The only platform built for technical marketing teams."
    badge="Public Beta 2025"
    ctaText="Get Started"
    secondaryCtaText="Documentation"
  />
);
