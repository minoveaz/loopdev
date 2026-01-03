import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ModuleWorkspace } from '.';
import { Button } from '../..'; // Assuming a Button component exists
import { Search, Bell, Info, PanelLeft } from 'lucide-react';

const meta: Meta<typeof ModuleWorkspace> = {
  title: 'Layout/ModuleWorkspace',
  component: ModuleWorkspace,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    moduleId: { control: { type: 'text' } },
    layout: {
      control: 'select',
      options: ['default', 'focus', 'wide'],
    },
    sidebarOpen: { control: { type: 'boolean' } },
    inspectorOpen: { control: { type: 'boolean' } },
  },
};

export default meta;
type Story = StoryObj<typeof ModuleWorkspace>;

// --- Mocks for Storybook ---

const MockHeader = () => (
  <div className="flex items-center justify-between w-full h-full px-4">
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon"><PanelLeft /></Button>
      <h2 className="font-bold">Module Title</h2>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon"><Info /></Button>
    </div>
  </div>
);

const MockToolbar = () => (
  <div className="flex items-center w-full gap-4">
    <Search className="text-muted-foreground" />
    <span className="text-sm text-muted-foreground flex-1">Search...</span>
    <Button>Action</Button>
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
      <div key={i} className="h-48 bg-secondary rounded-lg border flex items-center justify-center">
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
    // In a real scenario, the `isMobile` override would be used, 
    // or we'd rely on the component's internal breakpoint detection.
  },
};
