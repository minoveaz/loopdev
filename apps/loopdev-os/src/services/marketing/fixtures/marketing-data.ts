import {
  BrandContextSnapshotSchema,
  MarketingAssetSchema,
  SocialConnectionSchema,
} from '@loopdev/contracts';
import type { BrandContextSnapshot, MarketingAsset, SocialConnection } from '@loopdev/contracts';

export const marketingFixtureIds = {
  vitablueOrganization: '00000000-0000-4000-9000-000000000101',
  vitablueBrand: '00000000-0000-4000-9000-000000000102',
  vitablueWorkspace: '00000000-0000-4000-9000-000000000103',
  protegeOrganization: '00000000-0000-4000-9000-000000000104',
  protegeBrand: '00000000-0000-4000-9000-000000000105',
  protegeWorkspace: '00000000-0000-4000-9000-000000000106',
  vitablueLogo: '00000000-0000-4000-9000-000000000107',
  protegeLogo: '00000000-0000-4000-9000-000000000108',
  vitablueConnection: '00000000-0000-4000-9000-000000000109',
  protegeConnection: '00000000-0000-4000-9000-000000000110',
} as const;

const timestamp = '2026-08-10T00:00:00.000Z';
const expiredTimestamp = '2026-08-09T00:00:00.000Z';

const vitablueAsset: MarketingAsset = MarketingAssetSchema.parse({
  id: marketingFixtureIds.vitablueLogo,
  organizationId: marketingFixtureIds.vitablueOrganization,
  brandId: marketingFixtureIds.vitablueBrand,
  workspaceId: marketingFixtureIds.vitablueWorkspace,
  type: 'logo',
  name: 'VitaBlue primary logo',
  storagePath: 'fixtures/vitablue/logo-primary.svg',
  mimeType: 'image/svg+xml',
  sizeBytes: 1200,
  approvalStatus: 'approved',
  createdAt: timestamp,
  updatedAt: timestamp,
});

const protegeAsset: MarketingAsset = MarketingAssetSchema.parse({
  id: marketingFixtureIds.protegeLogo,
  organizationId: marketingFixtureIds.protegeOrganization,
  brandId: marketingFixtureIds.protegeBrand,
  workspaceId: marketingFixtureIds.protegeWorkspace,
  type: 'logo',
  name: 'Protege Salud primary logo',
  storagePath: 'fixtures/protege-salud/logo-primary.svg',
  mimeType: 'image/svg+xml',
  sizeBytes: 1300,
  approvalStatus: 'approved',
  createdAt: timestamp,
  updatedAt: timestamp,
});

export const marketingFixtureAssets: MarketingAsset[] = [vitablueAsset, protegeAsset];

export const marketingFixtureBrandSnapshots: BrandContextSnapshot[] = [
  BrandContextSnapshotSchema.parse({
    organizationId: marketingFixtureIds.vitablueOrganization,
    brand: {
      id: marketingFixtureIds.vitablueBrand,
      organizationId: marketingFixtureIds.vitablueOrganization,
      name: 'VitaBlue Salud',
      description: 'Fixture brand for offline Marketing Studio tests.',
      status: 'published',
      logoUrl: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    version: { id: marketingFixtureIds.vitablueBrand, number: 1, status: 'published', publishedAt: timestamp },
    assets: [vitablueAsset],
    approvedClaims: ['Protección para tu familia'],
    forbiddenClaims: ['Garantizado para todos'],
    rules: { evaluatedAt: timestamp },
    generatedAt: timestamp,
  }),
  BrandContextSnapshotSchema.parse({
    organizationId: marketingFixtureIds.protegeOrganization,
    brand: {
      id: marketingFixtureIds.protegeBrand,
      organizationId: marketingFixtureIds.protegeOrganization,
      name: 'Protege Salud',
      description: 'Fixture brand for offline Marketing Studio tests.',
      status: 'published',
      logoUrl: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    version: { id: marketingFixtureIds.protegeBrand, number: 1, status: 'published', publishedAt: timestamp },
    assets: [protegeAsset],
    approvedClaims: ['Cobertura clara y cercana'],
    forbiddenClaims: ['Sin ninguna excepción'],
    rules: { evaluatedAt: timestamp },
    generatedAt: timestamp,
  }),
];

export const marketingFixtureConnections: SocialConnection[] = [
  SocialConnectionSchema.parse({
    id: marketingFixtureIds.vitablueConnection,
    organizationId: marketingFixtureIds.vitablueOrganization,
    brandId: marketingFixtureIds.vitablueBrand,
    workspaceId: marketingFixtureIds.vitablueWorkspace,
    provider: 'instagram',
    externalAccountId: 'fixture-vitablue-instagram',
    displayName: 'VitaBlue Salud',
    status: 'connected',
    expiresAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  }),
  SocialConnectionSchema.parse({
    id: marketingFixtureIds.protegeConnection,
    organizationId: marketingFixtureIds.protegeOrganization,
    brandId: marketingFixtureIds.protegeBrand,
    workspaceId: marketingFixtureIds.protegeWorkspace,
    provider: 'facebook',
    externalAccountId: 'fixture-protege-facebook',
    displayName: 'Protege Salud',
    status: 'expired',
    expiresAt: expiredTimestamp,
    createdAt: timestamp,
    updatedAt: timestamp,
  }),
];