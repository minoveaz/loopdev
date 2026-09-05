import type { PlatformToolEntry } from '@loopdev/contracts';

export const PLATFORM_TOOL_ENTRIES: PlatformToolEntry[] = [
  {
    id: 'document-intelligence',
    label: 'Document Intelligence',
    tooltip: 'Document Intelligence',
    icon: 'FileText',
    route: { routeId: '/document-intelligence' },
    priority: 10,
    state: 'enabled',
  },
];

export const PLATFORM_TOOL_NAVIGATION_SCHEMA = {
  version: '1.0' as const,
  suite: {
    suiteId: 'platform-tools',
    suiteName: 'Platform tools',
    suiteIcon: 'apps',
    surfaceVariant: 'canvas' as const,
    route: { routeId: '/launchpad' },
  },
  exitHatch: {
    label: 'Launchpad',
    icon: 'home',
    route: { routeId: '/launchpad' },
  },
  groups: [
    {
      id: 'platform-tools',
      label: 'Capabilities',
      priority: 1,
      items: PLATFORM_TOOL_ENTRIES.map((entry) => ({
        ...entry,
        kind: 'module' as const,
        moduleId: entry.id,
      })),
    },
  ],
};

export function resolvePlatformTools(
  entries: PlatformToolEntry[],
  {
    hasPermission,
    isLoading,
    isPlatformScope,
  }: {
    hasPermission: (permission: string) => boolean;
    isLoading: boolean;
    isPlatformScope: boolean;
  },
) {
  if (isLoading) return [];

  return entries
    .filter((entry) => entry.state !== 'hidden' && entry.state !== 'forbidden')
    .filter(
      (entry) =>
        isPlatformScope ||
        !entry.requiredPermission ||
        hasPermission(entry.requiredPermission),
    )
    .sort((left, right) => left.priority - right.priority);
}
