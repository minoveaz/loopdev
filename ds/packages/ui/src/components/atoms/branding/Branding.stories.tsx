import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Logo, Brackets } from './index';
import { Stack, Inline, Box, Container } from '@/components/layout';

const meta: Meta = {
  title: 'Atoms/Branding',
};

export default meta;

export const LogoShowcase: StoryObj = {
  render: () => (
    <Container className="py-12">
      <Stack gap={12}>
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight leading-none">Official Identity</h2>
          <p className="text-[var(--lpd-color-text-muted)] font-medium">LoopDev identity atoms in different variants and scales.</p>
        </div>

        {/* Variants */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 border-b pb-2">Lockup Variants</h3>
          <Grid gap={8} className="grid-cols-1 md:grid-cols-3">
            <Box padding={8} background="subtle" radius="3xl" border className="flex flex-col items-center gap-4">
              <Logo variant="horizontal" size="md" />
              <span className="text-[10px] font-bold uppercase opacity-40">Horizontal</span>
            </Box>
            <Box padding={8} background="subtle" radius="3xl" border className="flex flex-col items-center gap-4">
              <Logo variant="vertical" size="lg" />
              <span className="text-[10px] font-bold uppercase opacity-40">Vertical</span>
            </Box>
            <Box padding={8} background="subtle" radius="3xl" border className="flex flex-col items-center gap-4">
              <Logo variant="isotype" size="xl" />
              <span className="text-[10px] font-bold uppercase opacity-40">Isotype</span>
            </Box>
          </Grid>
        </section>

        {/* Brand Inversion */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 border-b pb-2">Thematic Inversion</h3>
          <Grid gap={8} className="grid-cols-1 md:grid-cols-2">
            <Box padding={12} background="base" radius="3xl" border className="flex items-center justify-center">
              <Logo color="primary" size="lg" />
            </Box>
            <Box padding={12} background="inverse" radius="3xl" className="flex items-center justify-center">
              <Logo color="white" size="lg" />
            </Box>
          </Grid>
        </section>
      </Stack>
    </Container>
  )
};

export const SupportingElements: StoryObj = {
  render: () => (
    <Container className="py-12">
      <Stack gap={12}>
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight leading-none">Supporting Elements</h2>
          <p className="text-[var(--lpd-color-text-muted)] font-medium">Visual devices that frame and reinforce brand messages.</p>
        </div>

        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 border-b pb-2">Brackets</h3>
          <Stack gap={8}>
            <Box padding={12} background="base" radius="3xl" border className="flex flex-col items-center justify-center">
              <Brackets color="primary">
                <span className="text-xl md:text-3xl font-black tracking-widest uppercase">System</span>
              </Brackets>
            </Box>

            <Grid gap={4} className="grid-cols-1 md:grid-cols-3">
              <Box padding={6} background="subtle" radius="2xl" border className="flex items-center justify-center">
                <Brackets color="primary">
                  <span className="text-sm font-bold">Precise</span>
                </Brackets>
              </Box>
              <Box padding={6} background="subtle" radius="2xl" border className="flex items-center justify-center">
                <Brackets color="energy">
                  <span className="text-sm font-bold">Dynamic</span>
                </Brackets>
              </Box>
              <Box padding={6} background="subtle" radius="2xl" border className="flex items-center justify-center">
                <Brackets color="muted">
                  <span className="text-sm font-bold">Standard</span>
                </Brackets>
              </Box>
            </Grid>
          </Stack>
        </section>
      </Stack>
    </Container>
  )
};

const Grid = ({ children, className, gap = 4 }: any) => (
  <div className={`grid gap-${gap} ${className}`}>{children}</div>
);
