import type { TenantId, SubbrandId, BrandStrategy } from '../types/tenant';

export interface TenantData {
  name: string;
  logoUrl?: string;
  strategy: BrandStrategy;
}

export const TENANT_DATA: Record<TenantId, TenantData> = {
  'loopdev': {
    name: 'LoopDev',
    strategy: {
      purpose: 'Powering modern brand systems with design engineering excellence.',
      promise: 'Scale your design system without friction.',
      personality: ['Innovative', 'Precise', 'Collaborative', 'Technical'],
      voice: {
        base: 'Professional and technical yet accessible.',
        traits: ['Clear', 'Authoritative', 'Supportive']
      },
      territory: ['Design Systems', 'Frontend Engineering', 'Brand Consistency']
    }
  },
  'estar-protegidos': {
    name: 'Estar Protegidos',
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