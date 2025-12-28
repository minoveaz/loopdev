import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Divider, Center, TwoPaneLayout, Sticky, Box, Stack, Inline, Container } from './index';
import { Button } from '@/components/atoms/button';

const meta: Meta = {
  title: '💎 Foundations/Layout (Utilities)',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const DividerShowcase: StoryObj = {
  render: () => (
    <Container size="sm" className="py-12">
      <Stack gap={8}>
        <div className="space-y-4">
          <p className="text-sm font-bold">Standard Horizontal</p>
          <Divider />
        </div>
        
        <div className="space-y-4">
          <p className="text-sm font-bold">With Label</p>
          <Divider label="Security Settings" />
        </div>

        <div className="space-y-4">
          <p className="text-sm font-bold">Vertical in Row</p>
          <Inline gap={4} className="h-10">
            <Box>Option A</Box>
            <Divider orientation="vertical" />
            <Box>Option B</Box>
            <Divider orientation="vertical" />
            <Box>Option C</Box>
          </Inline>
        </div>
      </Stack>
    </Container>
  ),
};

export const CenterShowcase: StoryObj = {
  render: () => (
    <div className="h-96 bg-[var(--lpd-color-bg-subtle)] border-dashed border-2 border-slate-300">
      <Center>
        <Box padding={8} background="primary" radius="3xl" className="shadow-2xl">
          <p className="font-bold text-white">I am perfectly centered 2D</p>
        </Box>
      </Center>
    </div>
  ),
};

export const TwoPaneShowcase: StoryObj = {
  render: () => (
    <div className="h-[500px] border border-slate-200">
      <TwoPaneLayout
        master={
          <Stack gap={0}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Box key={i} padding={4} className="border-b hover:bg-slate-50 cursor-pointer transition-colors">
                <p className="font-bold text-sm">Campaign Item {i}</p>
                <p className="text-xs text-slate-500">Last edited 2h ago</p>
              </Box>
            ))}
          </Stack>
        }
        detail={
          <Box padding={12}>
            <Stack gap={6}>
              <h2 className="text-3xl font-bold">Campaign Details</h2>
              <Divider />
              <div className="space-y-4 opacity-50">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-5/6" />
              </div>
            </Stack>
          </Box>
        }
      />
    </div>
  ),
};

export const StickyShowcase: StoryObj = {
  render: () => (
    <div className="h-[400px] overflow-y-auto border relative custom-scrollbar">
      <Sticky position="top">
        <Box padding={4}>
          <Inline justify="between" align="center">
            <h3 className="font-bold">Sticky Header</h3>
            <Button size="sm">Action</Button>
          </Inline>
        </Box>
      </Sticky>
      
      <Box padding={12} className="min-h-[800px]">
        <Stack gap={8}>
          <p>Scroll down to see the sticky footer...</p>
          {[...Array(20)].map((_, i) => (
            <div key={i} className="h-8 bg-slate-100 rounded w-full" />
          ))}
        </Stack>
      </Box>

      <Sticky position="bottom">
        <Box padding={4}>
          <Inline justify="end" gap={3}>
            <Button variant="outline" size="sm">Cancel</Button>
            <Button variant="primary" size="sm">Save Changes</Button>
          </Inline>
        </Box>
      </Sticky>
    </div>
  ),
};
