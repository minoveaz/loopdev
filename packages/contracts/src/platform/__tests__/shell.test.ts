import { describe, expect, it } from 'vitest';
import { ShellExceptionsSchema, SuiteConfigSchema } from '../shell';

const suiteConfig = {
  identity: {
    suiteId: 'showcase',
    suiteName: 'Shell Showcase',
    suiteIcon: 'LayoutDashboard',
    surfaceVariant: 'canvas' as const,
    route: { routeId: '/shell-showcase' },
  },
  navigation: {
    version: '1.0' as const,
    suite: {
      suiteId: 'showcase',
      suiteName: 'Shell Showcase',
      suiteIcon: 'LayoutDashboard',
      surfaceVariant: 'canvas' as const,
      route: { routeId: '/shell-showcase' },
    },
    exitHatch: {
      label: 'Back to Launchpad',
      icon: 'ArrowLeft',
      route: { routeId: '/launchpad' },
    },
    groups: [],
  },
  accessMap: { overview: 'enabled' as const },
  modules: [
    {
      moduleId: 'overview',
      label: 'Overview',
      route: '/shell-showcase',
      breadcrumbs: ['Shell Showcase', 'Overview'],
      capabilities: ['sidebar', 'toolbar', 'inspector'] as const,
    },
  ],
};

describe('Platform shell contracts', () => {
  it('accepts a suite configuration for the canonical Showcase', () => {
    expect(SuiteConfigSchema.safeParse(suiteConfig).success).toBe(true);
  });

  it('rejects duplicate module IDs', () => {
    const result = SuiteConfigSchema.safeParse({
      ...suiteConfig,
      modules: [suiteConfig.modules[0], suiteConfig.modules[0]],
    });

    expect(result.success).toBe(false);
  });

  it('requires approval evidence for shell exceptions', () => {
    expect(
      ShellExceptionsSchema.safeParse([
        {
          id: 'legacy-inspector',
          area: 'module',
          kind: 'layout',
          reason: 'The legacy module owns its own detail surface.',
        },
      ]).success,
    ).toBe(false);

    expect(
      ShellExceptionsSchema.safeParse([
        {
          id: 'legacy-inspector',
          area: 'module',
          kind: 'layout',
          reason: 'The legacy module owns its own detail surface.',
          approvedBy: 'platform-architecture',
          approvalRef: 'TRACK-001',
        },
      ]).success,
    ).toBe(true);
  });
});
