import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppShell } from './AppShell';
import { PageHeader } from './PageHeader';
import { BrandIdentityView } from '@/components/brand-identity-view';
import { Button } from '@/components/button';
import { Save, Share2 } from 'lucide-react';
import { TenantProvider } from '@/providers/tenant-provider';

const meta: Meta<typeof AppShell> = {
  title: 'Layout/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
  },
  // Inyectamos el provider a nivel de Meta para asegurar que todas las historias lo tengan
  decorators: [
    (Story) => (
      <TenantProvider tenant="loopdev">
        <Story />
      </TenantProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AppShell>;

export const Default: Story = {
  render: () => (
    <AppShell>
      <BrandIdentityView />
    </AppShell>
  ),
};

export const Headers: Story = {
  render: () => (
    <AppShell 
      hideSidebar={true}
      header={
        <PageHeader
          title="Brand Identity DNA"
          description="Strategic assets for the current tenant."
          breadcrumbs={<span>Marketing Studio / Brand Center</span>}
          actions={
            <>
              <Button variant="outline" leftIcon={<Share2 size={16} />}>Share</Button>
              <Button variant="primary" leftIcon={<Save size={16} />}>Save</Button>
            </>
          }
        />
      }
    >
      <BrandIdentityView />
    </AppShell>
  ),
};
