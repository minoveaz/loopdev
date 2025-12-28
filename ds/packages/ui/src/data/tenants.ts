import type { TenantId, SubbrandId, BrandStrategy } from '../types/tenant';

export interface TenantData {
  name: string;
  logoUrl?: string;
  strategy: BrandStrategy;
  settings: {
    layout: {
      /** Determines if the left sidebar starts with labels visible ('expanded') or just icons ('collapsed') */
      sidebarDefaultVariant: 'expanded' | 'collapsed';
      /** If true, the right sidebar will include a vertical icon rail for internal navigation (Hub style) */
      rightSidebarHasRail: boolean;
    }
  };
}

export const TENANT_DATA: Record<TenantId, TenantData> = {
  'loopdev': {
    name: 'loop.dev',
    settings: {
      layout: {
        sidebarDefaultVariant: 'collapsed',
        sidebarStyle: 'base', // Minimalist white sidebar
        headerStyle: 'base',  // Minimalist white header
        rightSidebarHasRail: false,
      }
    },
    strategy: {
      purpose: 'Powering modern brand systems with design engineering excellence.',
      promise: 'Scale your design system with precision and generative workflows.',
      personality: ['Technical', 'Precise', 'Modular', 'Innovative'],
      voice: {
        base: 'Calculated and professional yet accessible.',
        traits: ['Clear', 'Structural', 'Generative']
      },
      territory: ['Design Systems', 'Frontend Engineering', 'AI Orchestration']
    }
  },
  'estar-protegidos': {
    name: 'Estar Protegidos',
    settings: {
      layout: {
        sidebarDefaultVariant: 'expanded',
        sidebarStyle: 'brand', // Strong brand identity in sidebars
        headerStyle: 'brand',  // Brand accent in header
        rightSidebarHasRail: true,
      }
    },
    strategy: {
      purpose: 'Hacer que protegerse deje de ser confuso, estresante y opaco.',
      promise: 'Protección clara, sin sorpresas y con acompañamiento real.',
      personality: ['Cercana', 'Experta', 'Tranquila', 'Honesta', 'Resolutiva'],
      voice: {
        base: 'Sabemos de seguros, pero hablamos como personas normales.',
        traits: ['Clara', 'Didáctica', 'Directa', 'Empática', 'Sin dramatismo']
      },
      territory: ['Claridad', 'Tranquilidad', 'Acompañamiento', 'Control', 'Protección integral']
    }
  },
  'client-b': {
    name: 'Client B',
    settings: {
      layout: {
        sidebarDefaultVariant: 'expanded', // Standard enterprise layout
        rightSidebarHasRail: false,      // Single-purpose inspector
      }
    },
    strategy: {
      purpose: 'Standardizing corporate identity for enterprise scale.',
      promise: 'Efficiency through consistency.',
      personality: ['Corporate', 'Reliable', 'Efficient'],
      voice: {
        base: 'Formal and direct.',
        traits: ['Brief', 'Professional', 'Structured']
      },
      territory: ['Enterprise Solutions', 'Process Optimization']
    }
  }
};

// Retro-compatibility for previous implementation
export const TENANT_STRATEGIES: Record<TenantId, BrandStrategy> = {
  'loopdev': TENANT_DATA['loopdev'].strategy,
  'estar-protegidos': TENANT_DATA['estar-protegidos'].strategy,
  'client-b': TENANT_DATA['client-b'].strategy,
};