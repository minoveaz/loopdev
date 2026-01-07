import type { Meta, StoryObj } from '@storybook/react';
import { ModuleWorkspace } from './index';
import { MODULE_WORKSPACE_FIXTURES } from './fixtures';
import { LayoutProvider } from '../../../providers/layout-provider';
import { TenantProvider } from '../../../providers/tenant-provider';
import { CertificationStamp } from '../../atoms/CertificationStamp';

// Wrapper para proveer contexto
const StoryWrapper = (Story: any) => (
  <TenantProvider>
    <LayoutProvider>
      <div className="h-[600px] w-full border border-border-technical rounded-xl overflow-hidden relative bg-shell-canvas">
        <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
          <CertificationStamp 
            status="certified" 
            version="v1.4.0" 
            phase={2} 
            className="rotate-[-2deg] shadow-blue-500/10" 
          />
        </div>
        <Story />
      </div>
    </LayoutProvider>
  </TenantProvider>
);

const meta: Meta<typeof ModuleWorkspace> = {
  title: 'Composites/Layout/ModuleWorkspace',
  component: ModuleWorkspace,
  decorators: [StoryWrapper],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Chasis interno para la ejecución de módulos. Gestiona paneles laterales, toolbar y modos de foco.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ModuleWorkspace>;

export const Normal: Story = {
  args: {
    ...MODULE_WORKSPACE_FIXTURES.default,
    mode: 'normal',
    sidebarOpen: true,
    inspectorOpen: false,
  },
};

export const FocusMode: Story = {
  args: {
    ...MODULE_WORKSPACE_FIXTURES.default,
    mode: 'focus',
  },
  parameters: {
    docs: {
      description: {
        story: 'En modo Focus, los paneles laterales se ocultan para dar protagonismo al canvas, pero el shell global (no visible aquí) se mantiene.',
      },
    },
  },
};

export const ImmersiveMode: Story = {
  args: {
    ...MODULE_WORKSPACE_FIXTURES.default,
    mode: 'immersive',
  },
  parameters: {
    docs: {
      description: {
        story: 'En modo Inmersivo (Zen), se oculta todo el chrome (Header, Toolbar, Sidebars) para foco absoluto.',
      },
    },
  },
};

export const WithInspector: Story = {
  args: {
    ...MODULE_WORKSPACE_FIXTURES.default,
    mode: 'normal',
    sidebarOpen: true,
    inspectorOpen: true,
  },
};

export const MobileOverlay: Story = {
  args: {
    ...MODULE_WORKSPACE_FIXTURES.default,
    isMobile: true,
    sidebarOpen: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'En dispositivos móviles, los paneles se convierten en Overlays (Dialogs) con backdrop.',
      },
    },
  },
};

export const StressTest: Story = {
  args: {
    ...MODULE_WORKSPACE_FIXTURES.default,
    children: (
      <div className="space-y-4 p-8">
        <div className="h-96 w-full bg-stripes-gray animate-pulse rounded-xl" />
        <div className="h-96 w-full bg-stripes-gray animate-pulse rounded-xl" />
        <div className="h-96 w-full bg-stripes-gray animate-pulse rounded-xl" />
        <div className="h-96 w-full bg-stripes-gray animate-pulse rounded-xl" />
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Prueba de scroll independiente. El canvas debe scrollear sin afectar a los sidebars.',
      },
    },
  },
};
