import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CleanHero, FeatureBento, TrustedPartners, ConversionCallout } from './index';
import { Container, Stack } from '@/components/layout';

const meta: Meta = {
  title: '🏗️ Organisms/Marketing/Patterns',
};

export default meta;

export const Showcase: StoryObj = {
  render: () => (
    <Container className="py-16">
      <Stack gap={16}>
        <div className="space-y-3">
          <h2 className="text-4xl font-black tracking-tight">Marketing Snippets</h2>
          <p className="text-[var(--lpd-color-text-muted)] max-w-2xl text-lg font-medium">
            High-conversion UI patterns for landing pages and brand announcements.
          </p>
        </div>

        {/* Hero Section */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 border-b pb-2">Hero Section</h3>
          <CleanHero />
        </section>

        {/* Bento Grid Section */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 border-b pb-2">Feature Bento</h3>
          <FeatureBento />
        </section>

        {/* Trusted Partners */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 border-b pb-2">Logo Cloud</h3>
          <TrustedPartners />
        </section>

        {/* Call to Action */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 border-b pb-2">Call to Action</h3>
          <ConversionCallout />
        </section>
      </Stack>
    </Container>
  )
};
