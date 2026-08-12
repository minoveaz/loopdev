import { z } from 'zod';

export const OrganizationRoleSchema = z.enum(['owner', 'admin', 'agent', 'viewer']);
export type OrganizationRole = z.infer<typeof OrganizationRoleSchema>;

export const OrganizationMembershipStatusSchema = z.enum(['pending', 'active', 'suspended', 'revoked']);
export type OrganizationMembershipStatus = z.infer<typeof OrganizationMembershipStatusSchema>;

export const PlatformAdministratorRoleSchema = z.enum(['owner', 'admin']);
export type PlatformAdministratorRole = z.infer<typeof PlatformAdministratorRoleSchema>;

export const PlatformAdministratorSchema = z.object({
  userId: z.string().uuid(),
  role: PlatformAdministratorRoleSchema,
  createdAt: z.string().datetime(),
  createdBy: z.string().uuid().nullable().optional(),
});

export type PlatformAdministrator = z.infer<typeof PlatformAdministratorSchema>;

export const SuiteKeySchema = z.enum(['marketing', 'crm', 'operations', 'communications', 'health', 'quant', 'finance']);
export type SuiteKey = z.infer<typeof SuiteKeySchema>;
export const WorkspaceStatusSchema = z.enum(['active', 'disabled', 'archived']);
export type WorkspaceStatus = z.infer<typeof WorkspaceStatusSchema>;

export const WorkspaceSchema = z.object({
  id: z.string().uuid(), organizationId: z.string().uuid(), suiteKey: SuiteKeySchema,
  name: z.string().trim().min(2).max(120), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  status: WorkspaceStatusSchema.default('active'), configuration: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.string().min(1), updatedAt: z.string().min(1),
});
export type Workspace = z.infer<typeof WorkspaceSchema>;

export const WorkspaceBrandSchema = z.object({
  workspaceId: z.string().uuid(), organizationId: z.string().uuid(), brandId: z.string().uuid(), createdAt: z.string().datetime(),
});
export type WorkspaceBrand = z.infer<typeof WorkspaceBrandSchema>;

export const PermissionScopeSchema = z.enum(['organization', 'workspace', 'brand', 'record']);
export type PermissionScope = z.infer<typeof PermissionScopeSchema>;

export const OrganizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2).max(120),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  legacyTenantId: z.string().uuid().nullable().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export type Organization = z.infer<typeof OrganizationSchema>;

export const CreateOrganizationSchema = OrganizationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  isActive: z.boolean().optional(),
});

export type CreateOrganizationInput = z.infer<typeof CreateOrganizationSchema>;

export const OrganizationMembershipSchema = z.object({
  organizationId: z.string().uuid(),
  userId: z.string().uuid(),
  role: OrganizationRoleSchema,
  status: OrganizationMembershipStatusSchema.default('active'),
  createdAt: z.string().datetime(),
});

export type OrganizationMembership = z.infer<typeof OrganizationMembershipSchema>;

export const PermissionSchema = z.object({
  key: z.string().regex(/^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+$/),
  description: z.string().min(1).max(240),
  scope: PermissionScopeSchema,
  createdAt: z.string().datetime(),
});

export type Permission = z.infer<typeof PermissionSchema>;

export const RolePermissionSchema = z.object({
  role: OrganizationRoleSchema,
  permissionKey: PermissionSchema.shape.key,
  createdAt: z.string().datetime(),
});

export type RolePermission = z.infer<typeof RolePermissionSchema>;
