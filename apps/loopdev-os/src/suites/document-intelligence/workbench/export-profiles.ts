import type { IdentityDocumentFields } from '@loopdev/contracts';

export type ExportProfileId = 'aseguradora-1' | 'aseguradora-2' | 'icao-internacional';
export type ExportProfileField = keyof IdentityDocumentFields;

export interface ExportProfileFieldDefinition {
  field: ExportProfileField;
  label: string;
  span?: 'full';
}

export interface ExportProfile {
  id: ExportProfileId;
  label: string;
  description: string;
  fields: ExportProfileFieldDefinition[];
}

export const DEFAULT_EXPORT_PROFILE_ID: ExportProfileId = 'aseguradora-1';

export const EXPORT_PROFILES: ExportProfile[] = [
  {
    id: 'aseguradora-1',
    label: 'Aseguradora 1',
    description: 'Nombre(s), primer apellido y segundo apellido separados.',
    fields: [
      { field: 'documentNumber', label: 'Número de documento' },
      { field: 'supportNumber', label: 'Número de soporte' },
      { field: 'givenNames', label: 'Nombre(s)', span: 'full' },
      { field: 'firstSurname', label: 'Primer apellido' },
      { field: 'secondSurname', label: 'Segundo apellido' },
      { field: 'birthDate', label: 'Fecha de nacimiento' },
      { field: 'sex', label: 'Sexo' },
      { field: 'nationality', label: 'Nacionalidad' },
      { field: 'expiryDate', label: 'Fecha de caducidad' },
      { field: 'address', label: 'Domicilio', span: 'full' },
    ],
  },
  {
    id: 'aseguradora-2',
    label: 'Aseguradora 2',
    description: 'Nombre(s) y apellidos completos agrupados.',
    fields: [
      { field: 'documentNumber', label: 'Número de documento' },
      { field: 'supportNumber', label: 'Número de soporte' },
      { field: 'givenNames', label: 'Nombre(s)' },
      { field: 'surnames', label: 'Apellidos' },
      { field: 'birthDate', label: 'Fecha de nacimiento' },
      { field: 'sex', label: 'Sexo' },
      { field: 'nationality', label: 'Nacionalidad' },
      { field: 'expiryDate', label: 'Fecha de caducidad' },
      { field: 'address', label: 'Domicilio', span: 'full' },
    ],
  },
  {
    id: 'icao-internacional',
    label: 'ICAO / Internacional',
    description: 'Formato internacional con país emisor y zona MRZ.',
    fields: [
      { field: 'surnames', label: 'Surnames' },
      { field: 'givenNames', label: 'Given Names' },
      { field: 'documentNumber', label: 'Document Number' },
      { field: 'issuingCountry', label: 'Issuing Country' },
      { field: 'nationality', label: 'Nationality' },
      { field: 'birthDate', label: 'Date of Birth' },
      { field: 'sex', label: 'Sex' },
      { field: 'expiryDate', label: 'Date of Expiry' },
      { field: 'mrz', label: 'MRZ', span: 'full' },
    ],
  },
];

const profileById = new Map(EXPORT_PROFILES.map((profile) => [profile.id, profile]));

export function getExportProfile(id: ExportProfileId): ExportProfile {
  return profileById.get(id) ?? profileById.get(DEFAULT_EXPORT_PROFILE_ID)!;
}

export function splitSurnames(value: string | null): {
  firstSurname: string | null;
  secondSurname: string | null;
} {
  const clean = value?.trim().replace(/\s+/g, ' ');
  if (!clean) return { firstSurname: null, secondSurname: null };

  const parts = clean.split(' ');
  if (parts.length === 1) return { firstSurname: parts[0], secondSurname: null };

  const compoundPrefixes = ['DE LA', 'DE LAS', 'DE LOS', 'SANTA', 'SAN', 'DEL', 'DE'];
  const upper = clean.toUpperCase();
  const prefix = compoundPrefixes.find((candidate) => upper.startsWith(`${candidate} `));

  if (prefix) {
    const rest = clean.slice(prefix.length).trim().split(' ');
    if (rest.length >= 2) {
      return {
        firstSurname: `${clean.slice(0, prefix.length)} ${rest[0]}`,
        secondSurname: rest.slice(1).join(' '),
      };
    }
  }

  return { firstSurname: parts[0], secondSurname: parts.slice(1).join(' ') };
}

export function buildSurnames(firstSurname: string | null, secondSurname: string | null): string | null {
  const value = [firstSurname?.trim(), secondSurname?.trim()].filter(Boolean).join(' ');
  return value || null;
}

export function formatFieldsForProfile(
  fields: IdentityDocumentFields,
  profileId: ExportProfileId,
): string {
  const profile = getExportProfile(profileId);
  return profile.fields
    .map(({ field, label }) => `${label}: ${fields[field] ?? '—'}`)
    .join('\n');
}

export function selectFieldsForProfile(
  fields: IdentityDocumentFields,
  profileId: ExportProfileId,
): Partial<IdentityDocumentFields> {
  return Object.fromEntries(
    getExportProfile(profileId).fields.map(({ field }) => [field, fields[field]]),
  );
}
