import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Container, Section, Stack, Inline, Grid } from './index';

const meta: Meta = {
  title: '💎 Foundations/Layout (Core)',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

const Box = ({ children, className = "bg-[var(--lpd-color-primary)]/10 border border-[var(--lpd-color-primary)]/20 rounded-lg p-4 min-h-[60px] flex items-center justify-center font-mono text-xs" }: any) => (
  <div className={className}>{children}</div>
);

export const StackExample: StoryObj = {
  render: () => (
    <Section>
      <Container size="md">
        <Stack gap={6}>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Stack Layout</h2>
            <p className="text-[var(--lpd-color-text-muted)]">Vertical spacing made easy.</p>
          </div>
          <Box>Element 1 (Gap 6)</Box>
          <Box>Element 2 (Gap 6)</Box>
          <Box>Element 3 (Gap 6)</Box>
          <Stack gap={2} className="bg-black/5 p-4 rounded-xl">
            <p className="text-[10px] uppercase font-bold opacity-50 mb-2">Nested Stack (Gap 2)</p>
            <Box className="bg-white border p-2 text-[10px]">Small Item A</Box>
            <Box className="bg-white border p-2 text-[10px]">Small Item B</Box>
          </Stack>
        </Stack>
      </Container>
    </Section>
  ),
};

export const InlineExample: StoryObj = {
  render: () => (
    <Section>
      <Container>
        <Stack gap={8}>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Inline Layout</h2>
            <p className="text-[var(--lpd-color-text-muted)]">Horizontal distribution with wrap support.</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm font-semibold">Default (Gap 4, Center)</p>
            <Inline>
              <Box className="px-6 bg-blue-500/10 border-blue-500/20">Badge 1</Box>
              <Box className="px-6 bg-blue-500/10 border-blue-500/20">Badge 2</Box>
              <Box className="px-6 bg-blue-500/10 border-blue-500/20">Longer Badge 3</Box>
              <Box className="px-6 bg-blue-500/10 border-blue-500/20">B4</Box>
            </Inline>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold">Justify Between</p>
            <Inline justify="between" className="bg-black/5 p-4 rounded-xl">
              <div className="font-bold">Total Amount</div>
              <div className="text-xl font-bold text-[var(--lpd-color-primary)]">$1,250.00</div>
            </Inline>
          </div>
        </Stack>
      </Container>
    </Section>
  ),
};

export const GridExample: StoryObj = {
  render: () => (
    <Section>
      <Container>
        <Stack gap={12}>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Grid Layout</h2>
            <p className="text-[var(--lpd-color-text-muted)]">Responsive grid presets.</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold">Preset: Cards (1 column mobile, 2 tablet, 3-4 desktop)</p>
            <Grid responsive="cards">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-video bg-[var(--lpd-color-bg-subtle)] border rounded-2xl p-6 flex flex-col justify-end">
                  <div className="w-10 h-10 rounded-full bg-[var(--lpd-color-primary)] mb-4" />
                  <div className="h-4 w-2/3 bg-black/10 rounded mb-2" />
                  <div className="h-3 w-full bg-black/5 rounded" />
                </div>
              ))}
            </Grid>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold">Fixed Columns (3)</p>
            <Grid cols={3} gap={4}>
              <Box>1</Box><Box>2</Box><Box>3</Box>
              <Box>4</Box><Box>5</Box><Box>6</Box>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Section>
  ),
};

export const CombinedExample: StoryObj = {
  render: () => (
    <div className="bg-[var(--lpd-color-bg-subtle)] min-h-screen">
      <Section spacing="roomy" className="bg-white border-b">
        <Container size="lg">
          <Grid responsive="content" gap={12}>
            <div className="lg:col-span-2 space-y-6">
              <Stack gap={4}>
                <h1 className="text-5xl font-bold tracking-tight">Systematic Layouts</h1>
                <p className="text-xl text-[var(--lpd-color-text-muted)]">
                  Combining Section, Container, Stack, Inline, and Grid to build robust UIs.
                </p>
                <Inline gap={3}>
                  <button className="px-6 py-3 bg-[var(--lpd-color-primary)] text-white rounded-xl font-bold">Get Started</button>
                  <button className="px-6 py-3 bg-white border rounded-xl font-bold">Documentation</button>
                </Inline>
              </Stack>
            </div>
            <div className="bg-[var(--lpd-color-primary)]/5 rounded-3xl p-8 border border-[var(--lpd-color-primary)]/10">
              <Stack gap={4}>
                <h3 className="font-bold">Quick Stats</h3>
                <Stack gap={2}>
                  <Inline justify="between" className="text-sm">
                    <span>Performance</span>
                    <span className="font-bold text-green-600">98%</span>
                  </Inline>
                  <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[98%]" />
                  </div>
                </Stack>
                <Stack gap={2}>
                  <Inline justify="between" className="text-sm">
                    <span>Reliability</span>
                    <span className="font-bold text-blue-600">99.9%</span>
                  </Inline>
                  <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[99.9%]" />
                  </div>
                </Stack>
              </Stack>
            </div>
          </Grid>
        </Container>
      </Section>

      <Section spacing="default">
        <Container>
          <Stack gap={8}>
            <h2 className="text-3xl font-bold text-center">Feature Grid</h2>
            <Grid responsive="cards" gap={8}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="p-8 bg-white rounded-3xl border shadow-sm hover:shadow-md transition-shadow">
                  <Stack gap={4}>
                    <div className="w-12 h-12 rounded-2xl bg-[var(--lpd-color-primary)]/10 flex items-center justify-center text-[var(--lpd-color-primary)]">
                      <div className="w-6 h-6 border-2 border-current rounded-md" />
                    </div>
                    <h4 className="text-xl font-bold">Feature {i}</h4>
                    <p className="text-[var(--lpd-color-text-muted)] text-sm leading-relaxed">
                      Using Stack and Grid to ensure perfect alignment and spacing across all devices.
                    </p>
                  </Stack>
                </div>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Section>
    </div>
  ),
};
