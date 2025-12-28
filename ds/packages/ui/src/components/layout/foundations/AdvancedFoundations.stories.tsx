import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Bleed, FullBleed, AspectRatio, Container, Section, Stack } from './index';

const meta: Meta = {
  title: 'Layout/Foundations (Advanced)',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const BoxShowcase: StoryObj = {
  render: () => (
    <Section>
      <Container size="md">
        <Stack gap={6}>
          <Box padding={8} background="subtle" radius="2xl" border>
            <h3 className="font-bold mb-2">Standard Box</h3>
            <p className="text-sm opacity-70">A box with padding, background, and radius tokens.</p>
          </Box>
          
          <Box padding={4} background="primary" radius="xl">
            <p className="font-bold">Primary Box</p>
          </Box>

          <Box paddingX={12} paddingY={4} background="inverse" radius="full">
            <p className="text-xs font-mono">Inverse Pill Box</p>
          </Box>
        </Stack>
      </Container>
    </Section>
  ),
};

export const BleedShowcase: StoryObj = {
  render: () => (
    <Section spacing="none">
      <Box background="subtle" paddingY={20}>
        <Container className="bg-white/50 border border-dashed border-red-500 min-h-[300px]">
          <Stack gap={8}>
            <div className="p-4">
              <h3 className="font-bold">Inside Container</h3>
              <p className="text-sm">The red dashed line is the Container limit.</p>
            </div>

            <Bleed className="bg-[var(--lpd-color-primary)] text-white p-6">
              <p className="font-bold">Inline Bleed</p>
              <p className="text-xs">I break the container's horizontal padding.</p>
            </Bleed>

            <FullBleed className="bg-[var(--lpd-color-secondary)] text-white p-12">
              <Container>
                <p className="font-bold text-2xl">Full Bleed Hero</p>
                <p>I touch the viewport edges but my content stays aligned via an internal Container.</p>
              </Container>
            </FullBleed>
          </Stack>
        </Container>
      </Box>
    </Section>
  ),
};

export const AspectRatioShowcase: StoryObj = {
  render: () => (
    <Section>
      <Container size="sm">
        <Stack gap={6}>
          <div className="space-y-4">
            <p className="font-bold">16:9 Cinema</p>
            <AspectRatio ratio={16/9} className="bg-black rounded-2xl">
              <div className="text-white font-bold">16:9 Video Placeholder</div>
            </AspectRatio>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="font-bold text-xs">1:1 Square</p>
              <AspectRatio ratio={1} className="bg-[var(--lpd-color-primary)]/20 rounded-xl">
                <div className="text-[var(--lpd-color-primary)] font-bold">1:1</div>
              </AspectRatio>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-xs">4:5 Portrait</p>
              <AspectRatio ratio={4/5} className="bg-[var(--lpd-color-secondary)]/20 rounded-xl">
                <div className="text-[var(--lpd-color-secondary)] font-bold">4:5</div>
              </AspectRatio>
            </div>
          </div>
        </Stack>
      </Container>
    </Section>
  ),
};
