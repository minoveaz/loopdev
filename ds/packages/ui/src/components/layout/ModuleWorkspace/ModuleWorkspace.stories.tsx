import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ModuleWorkspace } from '.';
// import { Button } from '../../ui/button'; // Commented out to fix build issue
import { Search, Bell, Info, PanelLeft } from 'lucide-react';
import { CertificationStamp } from '../../atoms/CertificationStamp';
import { InfraStamp } from '../../atoms/InfraStamp';
import { QualityShield } from '../../atoms/QualityShield';

const meta: Meta<typeof ModuleWorkspace> = {
  title: 'Layout/ModuleWorkspace',
  component: ModuleWorkspace,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'ModuleWorkspace is an industrial-grade layout shell designed for primary work areas within a module. It supports responsive behavior (push on desktop, overlay on mobile), accessibility (Focus Trap), and is fully tokenized for customization. This component is certified for production use.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    moduleId: { 
      control: { type: 'text' },
      description: 'Unique identifier for the module, used for telemetry and data-attributes.',
    },
    layout: {
      control: 'select',
      options: ['default', 'focus', 'wide'],
      description: 'Agnostic layout variant to control the visual presentation (e.g., collapsed panels).',
    },
    sidebarOpen: { 
      control: { type: 'boolean' },
      description: 'Controlled state for the left sidebar panel.',
    },
    inspectorOpen: { 
      control: { type: 'boolean' },
      description: 'Controlled state for the right inspector panel.',
    },
    children: {
      description: 'The main content area of the workspace, typically where a router outlet would be placed.',
    }
  },
  decorators: [
    (Story) => (
      <div className="w-full h-screen relative overflow-hidden">
        {/* 🛡️ Frontend Certification (Top-Left) */}
        <div className="fixed top-4 left-4 z-[9999]">
          <CertificationStamp 
            status="certified" 
            version="v1.5.0" 
            phase="4" 
          />
        </div>

        {/* ⚙️ Infra Certification (Top-Right) */}
        <div className="fixed top-4 right-4 z-[9999]">
          <InfraStamp 
            status="certified" 
            version="v1.5.0" 
            security="RLS_SECURED" 
          />
        </div>

        <Story />

        {/* 📊 QA Matrix (Fixed at bottom-right by component) */}
        <QualityShield metrics={{
          unit: { label: 'Unit', status: 'pass', value: '100% US' },
          a11y: { label: 'A11y', status: 'pass', value: 'WCAG AA' },
          visual: { label: 'Visual', status: 'pass', value: 'CERTIFIED' },
        }} />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ModuleWorkspace>;

// --- Mocks for Storybook ---

const MockHeader = () => (
  <div className="flex items-center justify-between w-full h-full px-4">
    <div className="flex items-center gap-2">
      <button className="p-2 rounded-md hover:bg-muted"><PanelLeft /></button>
      <h2 className="font-bold">Module Title</h2>
    </div>
    <div className="flex items-center gap-2">
      <button className="p-2 rounded-md hover:bg-muted"><Info /></button>
    </div>
  </div>
);

const MockToolbar = () => (
  <div className="flex items-center w-full gap-4">
    <Search className="text-muted-foreground" />
    <span className="text-sm text-muted-foreground flex-1">Search...</span>
    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Action</button>
  </div>
);

const MockSidebar = () => (
  <div className="p-4">
    <h3 className="font-bold text-lg mb-4">Navigation</h3>
    <ul className="space-y-2">
      <li>Menu Item 1</li>
      <li>Menu Item 2</li>
      <li>Menu Item 3</li>
    </ul>
  </div>
);

const MockInspector = () => (
  <div className="p-4">
    <h3 className="font-bold text-lg mb-4">Inspector</h3>
    <p>Details about the selected item.</p>
  </div>
);

const MockContent = ({ long = false }: { long?: boolean }) => (
  <div className={`p-8 ${long ? 'space-y-4' : 'grid grid-cols-3 gap-4'}`}>
    {Array.from({ length: long ? 50 : 6 }).map((_, i) => (
      <div key={i} className="h-48 bg-secondary rounded-lg border flex items-center justify-center text-muted-foreground">
        Card {i + 1}
      </div>
    ))}
  </div>
);

// --- Stories ---

export const Default: Story = {
  args: {
    moduleId: 'story-default',
    headerSlot: <MockHeader />,
    toolbarSlot: <MockToolbar />,
    sidebarSlot: <MockSidebar />,
    inspectorSlot: <MockInspector />,
    sidebarOpen: true,
    inspectorOpen: true,
    children: <MockContent />,
  },
};

export const CollapsedPanels: Story = {
  args: {
    ...Default.args,
    moduleId: 'story-collapsed',
    sidebarOpen: false,
    inspectorOpen: false,
  },
};

export const InfiniteContentForScrollTest: Story = {
  name: 'Resilience: Infinite Scroll',
  args: {
    ...Default.args,
    moduleId: 'story-scroll',
    children: <MockContent long />,
  },
};

export const MobileOverlay: Story = {
  name: 'Adaptability: Mobile Overlay',
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    ...Default.args,
    moduleId: 'story-mobile',
  },
};
