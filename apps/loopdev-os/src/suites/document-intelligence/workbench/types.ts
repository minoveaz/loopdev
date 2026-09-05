/**
 * Tipos locales del prototipo de Fase 0.
 *
 * NO son el contrato definitivo: la Fase 1 del track
 * `document-intelligence-poc-migration` definirá los esquemas reales en
 * `packages/contracts/src/documents`. Estos tipos existen solo para que la
 * composición visual sea navegable con fixtures.
 */

export type PrototypeIdentityDocumentType =
  | 'passport'
  | 'spanish-dni'
  | 'spanish-nie'
  | 'national-id'
  | 'unknown';

export type WorkbenchFlowState =
  | 'preparation'
  | 'processing'
  | 'review'
  | 'review-with-warnings'
  | 'error';

export interface PrototypeFieldValidation {
  field: string;
  valid: boolean;
  message: string;
}

export interface PrototypeExtractionUsage {
  promptTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface PrototypeExtractionResult {
  classification: {
    type: PrototypeIdentityDocumentType;
    confidence: number;
  };
  fields: Record<string, string | null>;
  fieldConfidence: Record<string, number>;
  validations: PrototypeFieldValidation[];
  provider: 'fixture' | 'gemini';
  usage: PrototypeExtractionUsage;
}

export interface PrototypeExtractionError {
  status: number;
  message: string;
}

export type WorkbenchTab = 'fields' | 'validation' | 'usage';
