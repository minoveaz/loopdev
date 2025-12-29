import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassCard, TechnicalDotGrid, MeshHero } from './index';
import { Container, Stack, Grid, Box } from '../../../components/layout';
import { Button } from '../../../components/atoms/button';
import { Zap, ShieldCheck, Globe } from 'lucide-react';

const meta: Meta = {
  title: '🏗️ Organisms/Marketing/Surfaces',
};

export default meta;

export const Showcase: StoryObj = {
  render: () => (
    <Container className="py-16">
      <Stack gap={16}>
        <div className="space-y-3">
          <h2 className="text-4xl font-black tracking-tight">Premium Surfaces</h2>
          <p className="text-[var(--lpd-color-text-muted)] max-w-2xl text-lg font-medium">
            Advanced UI patterns designed for high-impact brand experiences and professional SaaS dashboards.
          </p>
        </div>

        {/* Mesh Hero Section */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 border-b pb-2">Mesh Gradients</h3>
          <MeshHero 
            title="Accelerate your Brand"
            description="The most advanced design engineering system for modern marketing teams. Synchronize identity across all platforms."
          />
        </section>

        {/* Technical Grids */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 border-b pb-2">Data Surfaces</h3>
          <Grid responsive="cards" gap={6}>
            <TechnicalDotGrid 
              title="Identity Sync" 
              metric="100%" 
              label="Real-time Consistency" 
              icon={<ShieldCheck size={14} className="text-[var(--lpd-color-brand-primary)]" />}
            />
            <TechnicalDotGrid 
              title="Global Reach" 
              metric="42" 
              label="Active Markets" 
              icon={<Globe size={14} className="text-[var(--lpd-color-brand-primary)]" />}
            />
            <TechnicalDotGrid 
              title="Performance" 
              metric="99ms" 
              label="Average Rendering" 
              icon={<Zap size={14} className="text-[var(--lpd-color-brand-primary)]" />}
            />
          </Grid>
        </section>

        {/* Glassmorphism */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 border-b pb-2">Glassmorphism</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard 
              title="Brand Intelligence"
              description="Harness the power of AI to generate assets that follow your brand voice guidelines perfectly."
            >
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">Explore AI</Button>
            </GlassCard>
            <GlassCard 
              title="Seamless Integration"
              description="Connect your brand data with existing workflows. Export to any platform with a single click."
              backgroundImage="linear-gradient(135deg, #6366f1, #a855f7)"
            >
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">Connect Apps</Button>
            </GlassCard>
          </div>
        </section>
      </Stack>
    </Container>
  )
};
