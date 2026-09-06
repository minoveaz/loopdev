import { describe, expect, it } from 'vitest';
import {
  CreateOrganizationSchema,
  OrganizationMembershipSchema,
  OrganizationRoleSchema,
  OrganizationSchema,
  PermissionSchema,
  RolePermissionSchema,
} from '../tenancy';

const ids = {
  organization: '00000000-0000-4000-9000-000000000001',
  user: '00000000-0000-4000-8000-000000000001',
};

const timestamps = {
  createdAt: '2026-08-07T00:00:00.000Z',
  updatedAt: '2026-08-07T00:00:00.000Z',
};

describe('Platform Core tenancy contracts', () => {
  it('accepts an organization with valid identity and lifecycle fields', () => {
    expect(
      OrganizationSchema.safeParse({
        id: ids.organization,
        name: 'Estar Protegidos',
        slug: 'estar-protegidos',
        legacyTenantId: null,
        isActive: true,
        ...timestamps,
      }).success,
    ).toBe(true);
  });

  it('rejects invalid organization slugs', () => {
    expect(
      OrganizationSchema.safeParse({
        id: ids.organization,
        name: 'Invalid slug',
        slug: 'Invalid Slug',
        ...timestamps,
      }).success,
    ).toBe(false);
  });

  it('creates organizations without server-generated fields', () => {
    expect(CreateOrganizationSchema.parse({ name: 'VitaBlue', slug: 'vitablue' })).toEqual({
      name: 'VitaBlue',
      slug: 'vitablue',
    });
  });

  it('accepts only the supported organization roles', () => {
    expect(OrganizationRoleSchema.options).toEqual(['owner', 'admin', 'agent', 'viewer']);
    expect(OrganizationRoleSchema.safeParse('member').success).toBe(false);
  });

  it('accepts a membership with a supported role and organization identity', () => {
    expect(
      OrganizationMembershipSchema.safeParse({
        organizationId: ids.organization,
        userId: ids.user,
        role: 'agent',
        ...timestamps,
      }).success,
    ).toBe(true);
  });

  it('accepts valid permission keys and rejects malformed keys', () => {
    expect(
      PermissionSchema.safeParse({
        key: 'crm.manage',
        description: 'Manage CRM records',
        scope: 'record',
        createdAt: timestamps.createdAt,
      }).success,
    ).toBe(true);
    expect(
      PermissionSchema.safeParse({
        key: 'CRM_MANAGE',
        description: 'Invalid key',
        scope: 'record',
        createdAt: timestamps.createdAt,
      }).success,
    ).toBe(false);
  });

  it('associates a supported role with a permission key', () => {
    expect(
      RolePermissionSchema.parse({
        role: 'admin',
        permissionKey: 'members.manage',
        createdAt: timestamps.createdAt,
      }).permissionKey,
    ).toBe('members.manage');
  });
});
