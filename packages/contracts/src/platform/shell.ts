import { z } from 'zod';
import type { AccessMap, NavGroup, NavigationSchema, NavMode, SuiteIdentity } from './navigation';

export const ShellStructuralStateSchema = z.enum([
  'ready',
  'loading',
  'error',
  'forbidden',
  'no-tenant-context',
  'module-disabled',
  'empty',
  'read-only',
  'offline',
]);

export type ShellStructuralState = z.infer<typeof ShellStructuralStateSchema>;

export const ShellAccessStateSchema = z.enum([
  'enabled',
  'disabled',
  'hidden',
  'coming-soon',
  'forbidden',
  'read-only',
]);

export type ShellAccessState = z.infer<typeof ShellAccessStateSchema>;

export const WorkspaceCapabilitySchema = z.enum([
  'sidebar',
  'flyout',
  'toolbar',
  'inspector',
  'resource-tabs',
  'operation-panel',
  'responsive-inspector',
  'mobile-navigation',
]);

export type WorkspaceCapability = z.infer<typeof WorkspaceCapabilitySchema>;

export const WorkspaceCapabilitiesSchema = z
  .array(WorkspaceCapabilitySchema)
  .min(1)
  .refine((capabilities) => new Set(capabilities).size === capabilities.length, {
    message: 'Workspace capabilities must be unique',
  });

export type WorkspaceCapabilities = z.infer<typeof WorkspaceCapabilitiesSchema>;

export const ShellPermissionConfigSchema = z.object({
  required: z.array(z.string().min(1)).default([]),
  accessState: ShellAccessStateSchema.default('enabled'),
  readOnly: z.boolean().default(false),
});

export type ShellPermissionConfig = z.infer<typeof ShellPermissionConfigSchema>;

export const ShellStateSchema = z.object({
  structuralState: ShellStructuralStateSchema,
  message: z.string().optional(),
  retryActionId: z.string().min(1).optional(),
});

export type ShellState = z.infer<typeof ShellStateSchema>;

export const ShellExceptionSchema = z.object({
  id: z.string().min(1),
  area: z.enum(['suite', 'module', 'workspace']),
  kind: z.enum(['layout', 'navigation', 'responsive', 'accessibility', 'theme']),
  reason: z.string().min(1),
  approvedBy: z.string().min(1),
  approvalRef: z.string().min(1),
  reviewAfter: z.string().date().optional(),
});

export type ShellException = z.infer<typeof ShellExceptionSchema>;

export const ShellExceptionsSchema = z
  .array(ShellExceptionSchema)
  .refine(
    (exceptions) => new Set(exceptions.map((exception) => exception.id)).size === exceptions.length,
    {
      message: 'Shell exception IDs must be unique',
    },
  );

export type ShellExceptions = z.infer<typeof ShellExceptionsSchema>;

export type ModuleShellZoneWidth = 'narrow' | 'standard' | 'wide' | 'extra-wide';
export type ModuleShellZoneIcon = 'menu' | 'panel-left-close' | 'panel-left-open';
export type ModuleShellCollapsedPresentation = 'rail' | 'trigger' | 'drawer';
export type ModuleShellContextActionTone = 'neutral' | 'accent' | 'attention';

export interface ModuleShellZoneUsage {
  label?: string;
  contentKey?: string;
  visible?: boolean;
  headerRows?: 1 | 2 | 3;
  showFooter?: boolean;
  footerRows?: 1 | 2 | 3;
  contentScrollable?: boolean;
  footer?: {
    contentKey: string;
  };
  width?: ModuleShellZoneWidth;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  collapsedPresentation?: ModuleShellCollapsedPresentation;
  collapseIcon?: ModuleShellZoneIcon;
  expandIcon?: ModuleShellZoneIcon;
}

export interface ModuleShellUsage {
  canvasMode: 'overview' | 'data' | 'workspace' | 'split' | 'board' | 'full-bleed';
  contextualAction?: {
    label: string;
    icon: ModuleShellZoneIcon;
    tone?: ModuleShellContextActionTone;
  };
  suiteHeader?: ModuleShellZoneUsage;
  suiteToolbar?: ModuleShellZoneUsage;
  moduleContextSidebar?: ModuleShellZoneUsage;
  moduleContextPanel?: ModuleShellZoneUsage;
}

export interface ModuleConfig {
  moduleId: string;
  label: string;
  route: string;
  breadcrumbs: string[];
  navigation?: {
    groups: NavGroup[];
    activeRouteId?: string;
  };
  permissions?: ShellPermissionConfig;
  capabilities: WorkspaceCapabilities;
  initialState?: ShellState;
  exceptions?: ShellExceptions;
  shell?: ModuleShellUsage;
}

export interface SuiteConfig {
  identity: SuiteIdentity;
  navigation: NavigationSchema;
  accessMap: AccessMap;
  requiredPermissions?: string[];
  themeId?: string;
  navMode?: NavMode;
  modules: ModuleConfig[];
  exceptions?: ShellExceptions;
}

export const ModuleConfigSchema = z.object({
  moduleId: z.string().min(1),
  label: z.string().min(1),
  route: z.string().min(1),
  breadcrumbs: z.array(z.string().min(1)),
  navigation: z
    .object({
      groups: z.array(z.custom<NavGroup>()),
      activeRouteId: z.string().min(1).optional(),
    })
    .optional(),
  permissions: ShellPermissionConfigSchema.optional(),
  capabilities: WorkspaceCapabilitiesSchema,
  initialState: ShellStateSchema.optional(),
  exceptions: ShellExceptionsSchema.optional(),
  shell: z
    .object({
      canvasMode: z.enum(['overview', 'data', 'workspace', 'split', 'board', 'full-bleed']),
      contextualAction: z
        .object({
          label: z.string().min(1),
          icon: z.enum(['menu', 'panel-left-close', 'panel-left-open']),
          tone: z.enum(['neutral', 'accent', 'attention']).optional(),
        })
        .optional(),
      suiteHeader: z
        .object({
          label: z.string().min(1).optional(),
          contentKey: z.string().min(1).optional(),
          visible: z.boolean().optional(),
          footer: z.object({ contentKey: z.string().min(1) }).optional(),
          width: z.enum(['narrow', 'standard', 'wide', 'extra-wide']).optional(),
          collapsible: z.boolean().optional(),
          defaultCollapsed: z.boolean().optional(),
          collapsedPresentation: z.enum(['rail', 'trigger', 'drawer']).optional(),
          collapseIcon: z.enum(['menu', 'panel-left-close', 'panel-left-open']).optional(),
          expandIcon: z.enum(['menu', 'panel-left-close', 'panel-left-open']).optional(),
        })
        .optional(),
      suiteToolbar: z
        .object({
          label: z.string().min(1).optional(),
          contentKey: z.string().min(1).optional(),
          visible: z.boolean().optional(),
          footer: z.object({ contentKey: z.string().min(1) }).optional(),
          width: z.enum(['narrow', 'standard', 'wide', 'extra-wide']).optional(),
          collapsible: z.boolean().optional(),
          defaultCollapsed: z.boolean().optional(),
          collapsedPresentation: z.enum(['rail', 'trigger', 'drawer']).optional(),
          collapseIcon: z.enum(['menu', 'panel-left-close', 'panel-left-open']).optional(),
          expandIcon: z.enum(['menu', 'panel-left-close', 'panel-left-open']).optional(),
        })
        .optional(),
      moduleContextSidebar: z
        .object({
          label: z.string().min(1).optional(),
          contentKey: z.string().min(1).optional(),
          visible: z.boolean().optional(),
          headerRows: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
          showFooter: z.boolean().optional(),
          footerRows: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
          contentScrollable: z.boolean().optional(),
          footer: z.object({ contentKey: z.string().min(1) }).optional(),
          width: z.enum(['narrow', 'standard', 'wide', 'extra-wide']).optional(),
          collapsible: z.boolean().optional(),
          defaultCollapsed: z.boolean().optional(),
          collapsedPresentation: z.enum(['rail', 'trigger', 'drawer']).optional(),
          collapseIcon: z.enum(['menu', 'panel-left-close', 'panel-left-open']).optional(),
          expandIcon: z.enum(['menu', 'panel-left-close', 'panel-left-open']).optional(),
        })
        .optional(),
      moduleContextPanel: z
        .object({
          label: z.string().min(1).optional(),
          contentKey: z.string().min(1).optional(),
          visible: z.boolean().optional(),
          headerRows: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
          showFooter: z.boolean().optional(),
          footerRows: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
          contentScrollable: z.boolean().optional(),
          footer: z.object({ contentKey: z.string().min(1) }).optional(),
          width: z.enum(['narrow', 'standard', 'wide', 'extra-wide']).optional(),
          collapsible: z.boolean().optional(),
          defaultCollapsed: z.boolean().optional(),
          collapsedPresentation: z.enum(['rail', 'trigger', 'drawer']).optional(),
          collapseIcon: z.enum(['menu', 'panel-left-close', 'panel-left-open']).optional(),
          expandIcon: z.enum(['menu', 'panel-left-close', 'panel-left-open']).optional(),
        })
        .optional(),
    })
    .optional(),
});

export const SuiteConfigSchema = z
  .object({
    identity: z.custom<SuiteIdentity>(),
    navigation: z.custom<NavigationSchema>(),
    accessMap: z.record(ShellAccessStateSchema),
    requiredPermissions: z.array(z.string().min(1)).optional(),
    themeId: z.string().min(1).optional(),
    navMode: z.enum(['expanded', 'rail', 'hover', 'hidden']).optional(),
    modules: z.array(ModuleConfigSchema).min(1),
    exceptions: ShellExceptionsSchema.optional(),
  })
  .superRefine((config, context) => {
    const moduleIds = config.modules.map((module) => module.moduleId);
    if (new Set(moduleIds).size !== moduleIds.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['modules'],
        message: 'Suite module IDs must be unique',
      });
    }
  });
