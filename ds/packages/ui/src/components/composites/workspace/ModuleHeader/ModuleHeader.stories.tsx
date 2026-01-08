import type { Meta, StoryObj } from '@storybook/react';
import { ModuleHeader } from './index';
import { CertificationStamp } from '../../../atoms/indicators/CertificationStamp';

const meta: Meta<typeof ModuleHeader> = {
  title: 'Composites/Workspace/ModuleHeader',
  component: ModuleHeader,
  decorators: [
    (Story) => (
      <div className="relative min-h-[100px] bg-shell-canvas overflow-hidden border border-border-technical">
        <CertificationStamp status="certified" version="v3.9.0" phase={2} className="fixed top-4 right-4 z-50" />
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ModuleHeader>;

export const ModuleMode: Story = {
  args: {
    segments: [
      { id: 'suite', label: 'Marketing Studio', href: '#' },
      { id: 'module', label: 'Brand Hub', isActive: true },
    ],
    statusLabel: 'SYSTEM_ACTIVE',
    statusSeverity: 'success',
    sidebarToggle: {
      isOpen: true,
      onToggle: () => console.log('Toggle Sidebar'),
    },
  },
};

export const BrandMode: Story = {
  args: {
    segments: [
      { id: 'suite', label: 'Marketing', href: '#' },
      { id: 'module', label: 'Brand Hub', href: '#' },
      { id: 'entity', label: 'Acme Corp', isActive: true },
    ],
    statusLabel: 'DRAFT_VERSION',
    statusSeverity: 'warning',
    sidebarToggle: {
      isOpen: true,
      onToggle: () => console.log('Toggle Sidebar'),
    },
  },
};

export const DeepPath: Story = {
  args: {
    segments: [
      { id: 'suite', label: 'Marketing', href: '#' },
      { id: 'module', label: 'Brand Hub', href: '#' },
      { id: 'entity', label: 'Acme Corp', href: '#' },
      { id: 'view', label: 'Visual System', href: '#' },
      { id: 'subview', label: 'Color Palette', isActive: true },
    ],
    statusLabel: 'PUBLISHED',
    statusSeverity: 'success',
  },
};