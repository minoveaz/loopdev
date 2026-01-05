import { NavigationSchema } from '@loopdev/contracts';

/**
 * @file fixtures.ts
 * @description Configuraciones de navegación reales para pruebas e integración.
 */

export const MARKETING_STUDIO_SCHEMA: NavigationSchema = {
  version: '1.0',
  suite: {
    suiteId: 'marketingStudio',
    suiteName: 'Marketing Studio',
    suiteIcon: 'Megaphone',
    accentColor: 'var(--lpd-color-brand-primary)',
    surfaceVariant: 'canvas',
  },
  exitHatch: {
    label: 'Back to OS',
    icon: 'ArrowLeft',
    route: { routeId: '/launchpad' },
  },
  groups: [
    {
      id: 'operativo',
      label: 'Operativo',
      priority: 10,
      collapsible: true,
      items: [
        {
          id: 'nav.overview',
          kind: 'module',
          label: 'Overview',
          icon: 'LayoutDashboard',
          priority: 10,
          moduleId: 'overview',
          route: { routeId: '/marketing-studio' },
          tooltip: 'Resumen de la suite',
        },
        {
          id: 'nav.brand-hub',
          kind: 'module',
          label: 'Brand Hub',
          icon: 'LibraryBig',
          priority: 20,
          moduleId: 'brand-hub',
          route: { routeId: '/marketing-studio/brands' },
          tooltip: 'Identidad y gobernanza de marca',
        },
        {
          id: 'nav.content-engine',
          kind: 'module',
          label: 'Content Engine',
          icon: 'Sparkles',
          priority: 30,
          moduleId: 'content-engine',
          route: { routeId: '/marketing-studio/content' },
          tooltip: 'Generación de contenido con IA',
        },
        {
          id: 'nav.dam',
          kind: 'module',
          label: 'Digital Assets',
          icon: 'FolderKanban',
          priority: 40,
          moduleId: 'dam',
          route: { routeId: '/marketing-studio/dam' },
          tooltip: 'Gestión de archivos multimedia',
        },
      ],
    },
    {
      id: 'config',
      label: 'Configuración',
      priority: 100,
      collapsible: true,
      items: [
        {
          id: 'nav.settings',
          kind: 'module',
          label: 'Suite Settings',
          icon: 'Settings2',
          priority: 10,
          moduleId: 'settings',
          route: { routeId: '/marketing-studio/settings' },
        },
      ],
    },
  ],
};
