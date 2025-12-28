import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Grid, Box, Container } from '@/components/layout';
import * as Tech from './tech';
import * as Home from './home';
import * as Travel from './travel';
import * as Health from './health';
import * as Auto from './auto';
import * as Finance from './finance';
import * as Claims from './claims';
import * as Sales from './sales';

const meta: Meta = {
  title: 'Atoms/Illustrations',
};

export default meta;

const IllustrationGallery = ({ title, components }: { title: string, components: any }) => (
  <Stack gap={6}>
    <h3 className="text-sm font-black uppercase tracking-widest opacity-40 border-b pb-2">{title}</h3>
    <Grid responsive="cards" gap={6}>
      {Object.entries(components).map(([name, Component]: [string, any]) => (
        <Box key={name} padding={6} background="base" radius="3xl" border className="flex flex-col items-center gap-4 hover:shadow-lg transition-all group">
          <div className="w-full aspect-[4/3] flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            <Component />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter opacity-50">{name.replace('Illustration', '')}</span>
        </Box>
      ))}
    </Grid>
  </Stack>
);

export const AllIllustrations: StoryObj = {
  render: () => (
    <Container className="py-12">
      <Stack gap={12}>
        <div className="space-y-2">
          <h2 className="text-4xl font-bold tracking-tight">Illustration Library</h2>
          <p className="text-[var(--lpd-color-text-muted)] max-w-2xl">
            A comprehensive set of brand illustrations, migrated and standardized to react to tenant design tokens automatically.
          </p>
        </div>

        <IllustrationGallery title="Technology & Product" components={Tech} />
        <IllustrationGallery title="Home & Family" components={Home} />
        <IllustrationGallery title="Travel & Adventure" components={Travel} />
        <IllustrationGallery title="Health & Wellness" components={Health} />
        <IllustrationGallery title="Auto & Mobility" components={Auto} />
        <IllustrationGallery title="Finance & Protection" components={Finance} />
        <IllustrationGallery title="Claims & Assistance" components={Claims} />
        <IllustrationGallery title="Sales & Growth" components={Sales} />
      </Stack>
    </Container>
  )
};
