import type { PrototypeExtractionResult } from './types';
import type { PrototypeDocumentHistoryItem } from './types';

export const WORKBENCH_FIELD_LABELS: Record<string, string> = {
  fullName: 'Nombre completo',
  givenNames: 'Nombre',
  firstSurname: 'Primer apellido',
  secondSurname: 'Segundo apellido',
  documentNumber: 'Número de documento',
  birthDate: 'Fecha de nacimiento',
  nationality: 'Nacionalidad',
  sex: 'Sexo',
  issueDate: 'Fecha de emisión',
  expiryDate: 'Fecha de caducidad',
  supportNumber: 'Número de soporte',
  mrz: 'MRZ',
};

export const WORKBENCH_FIELD_ORDER = Object.keys(WORKBENCH_FIELD_LABELS);

/**
 * Fixture de DNI español con avisos: un checksum inválido y un campo con baja
 * confianza, para recorrer la revisión sin provider.
 */
export const SPANISH_DNI_FIXTURE_RESULT: PrototypeExtractionResult = {
  classification: { type: 'spanish-dni', confidence: 0.98 },
  fields: {
    fullName: 'María Ejemplo García',
    givenNames: 'María',
    firstSurname: 'Ejemplo',
    secondSurname: 'García',
    documentNumber: '12345678Z',
    birthDate: '15/03/1990',
    nationality: 'ES',
    sex: 'F',
    issueDate: '02/01/2021',
    expiryDate: '02/01/2031',
    supportNumber: null,
    mrz: null,
  },
  fieldConfidence: {
    fullName: 0.99,
    givenNames: 0.99,
    firstSurname: 0.98,
    secondSurname: 0.97,
    documentNumber: 0.62,
    birthDate: 0.95,
    nationality: 0.99,
    sex: 0.99,
    issueDate: 0.9,
    expiryDate: 0.93,
  },
  validations: [
    {
      field: 'documentNumber',
      valid: false,
      message: 'La letra de control no coincide con el checksum DNI esperado.',
    },
    {
      field: 'documentNumber',
      valid: false,
      message: 'Confianza de extracción baja (0.62). Revisa el número manualmente.',
    },
    { field: 'expiryDate', valid: true, message: 'Documento en vigor.' },
    { field: 'birthDate', valid: true, message: 'Titular mayor de edad.' },
  ],
  provider: 'fixture',
  usage: {
    promptTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    estimatedCostUsd: 0,
  },
};

/** Fixture de error recuperable tipado (equivalente al 502 del POC). */
export const PROTOTYPE_EXTRACTION_ERROR = {
  status: 502,
  message:
    'El proveedor no devolvió una extracción válida. Puedes reintentar o cambiar el documento.',
};

export const DOCUMENT_INTELLIGENCE_HISTORY_FIXTURE: PrototypeDocumentHistoryItem[] = [
  {
    id: 'fixture-spanish-dni',
    fileName: 'dni-demo.png',
    mimeType: 'image/png',
    documentType: 'spanish-dni',
    flowState: 'review',
    provider: 'fixture',
    updatedAt: '2026-09-05T10:30:00.000Z',
    isFixture: true,
  },
];
