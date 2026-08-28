import { describe, expect, it } from 'vitest';
import {
  CreateMarketingCreativeProjectSchema,
  CreateMarketingCreativeProjectVersionSchema,
  CreateMarketingCreativeVariantSchema,
  MarketingCreativeProjectSchema,
  MarketingCreativeVariantSchema,
  MarketingCreativeProjectVersionSchema,
} from '../creative';

const ids = {
  organizationId: '00000000-0000-4000-9000-000000000001',
  brandId: '00000000-0000-4000-9000-000000000002',
  workspaceId: '00000000-0000-4000-9000-000000000003',
  projectId: '00000000-0000-4000-9000-000000000004',
  versionId: '00000000-0000-4000-9000-000000000005',
  variantId: '00000000-0000-4000-9000-000000000006',
};
const timestamp = '2026-08-27T00:00:00.000Z';

describe('Creative Studio contracts', () => {
  it('requires the organization, brand, and workspace boundary', () => {
    expect(
      MarketingCreativeProjectSchema.safeParse({
        id: ids.projectId,
        name: 'VitaBlue launch',
        createdAt: timestamp,
        updatedAt: timestamp,
      }).success,
    ).toBe(false);
    expect(
      MarketingCreativeProjectSchema.safeParse({
        id: ids.projectId,
        organizationId: ids.organizationId,
        brandId: ids.brandId,
        workspaceId: ids.workspaceId,
        name: 'VitaBlue launch',
        createdAt: timestamp,
        updatedAt: timestamp,
      }).success,
    ).toBe(true);
  });

  it('separates create inputs from server-generated audit fields', () => {
    const parsed = CreateMarketingCreativeProjectSchema.parse({
      organizationId: ids.organizationId,
      brandId: ids.brandId,
      workspaceId: ids.workspaceId,
      name: 'VitaBlue launch',
    });
    expect(parsed).toMatchObject({ name: 'VitaBlue launch', currentVersionNumber: 0 });
    expect('id' in parsed).toBe(false);
  });

  it('requires versions to point to a scoped project and preserves document data', () => {
    const version = MarketingCreativeProjectVersionSchema.parse({
      id: ids.versionId,
      organizationId: ids.organizationId,
      brandId: ids.brandId,
      workspaceId: ids.workspaceId,
      projectId: ids.projectId,
      versionNumber: 1,
      document: { layers: [{ type: 'text', value: 'Hola' }] },
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    expect(version.document).toEqual({ layers: [{ type: 'text', value: 'Hola' }] });
    expect(
      CreateMarketingCreativeProjectVersionSchema.safeParse({
        organizationId: ids.organizationId,
        brandId: ids.brandId,
        workspaceId: ids.workspaceId,
        projectId: ids.projectId,
        versionNumber: 1,
      }).success,
    ).toBe(true);
  });

  it('validates channel variants and rejects invalid dimensions', () => {
    expect(
      MarketingCreativeVariantSchema.safeParse({
        id: ids.variantId,
        organizationId: ids.organizationId,
        brandId: ids.brandId,
        workspaceId: ids.workspaceId,
        projectId: ids.projectId,
        projectVersionId: ids.versionId,
        key: 'instagram-square',
        channel: 'instagram',
        format: 'square',
        payload: { background: '#001122' },
        width: 1080,
        height: 1080,
        createdAt: timestamp,
        updatedAt: timestamp,
      }).success,
    ).toBe(true);
    expect(
      CreateMarketingCreativeVariantSchema.safeParse({
        organizationId: ids.organizationId,
        brandId: ids.brandId,
        workspaceId: ids.workspaceId,
        projectId: ids.projectId,
        projectVersionId: ids.versionId,
        key: 'invalid',
        channel: 'instagram',
        format: 'square',
        width: 0,
      }).success,
    ).toBe(false);
  });
});
