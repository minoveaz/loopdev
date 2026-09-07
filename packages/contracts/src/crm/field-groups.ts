import { z } from 'zod';

export const CrmFieldGroupKeySchema = z.enum([
  'identity',
  'contact_channels',
  'location',
  'professional',
  'lead_qualification',
  'compliance_consent',
  'custom_attributes',
]);
export type CrmFieldGroupKey = z.infer<typeof CrmFieldGroupKeySchema>;

export const CrmFieldInputTypeSchema = z.enum([
  'text',
  'email',
  'tel',
  'date',
  'number',
  'select',
  'textarea',
  'checkbox',
]);
export type CrmFieldInputType = z.infer<typeof CrmFieldInputTypeSchema>;

export const CrmFieldOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});
export type CrmFieldOption = z.infer<typeof CrmFieldOptionSchema>;

export const CrmFieldDefinitionSchema = z.object({
  key: z.string(),
  label: z.string(),
  group: CrmFieldGroupKeySchema,
  inputType: CrmFieldInputTypeSchema,
  placeholder: z.string().optional(),
  options: z.array(CrmFieldOptionSchema).optional(),
  description: z.string().optional(),
  targetEntity: z.enum(['contact', 'lead', 'shared']),
});
export type CrmFieldDefinition = z.infer<typeof CrmFieldDefinitionSchema>;

export const CrmFieldGroupMetaSchema = z.object({
  key: CrmFieldGroupKeySchema,
  label: z.string(),
  description: z.string(),
  icon: z.string(),
});
export type CrmFieldGroupMeta = z.infer<typeof CrmFieldGroupMetaSchema>;

export const CRM_FIELD_GROUPS: Record<CrmFieldGroupKey, CrmFieldGroupMeta> = {
  identity: {
    key: 'identity',
    label: 'Identidad Personal',
    description: 'Nombre legal, apellidos, documentos de identidad y datos demográficos.',
    icon: 'User',
  },
  contact_channels: {
    key: 'contact_channels',
    label: 'Canales de Contacto',
    description: 'Teléfonos, emails, WhatsApp y preferencias horarias de comunicación.',
    icon: 'Mail',
  },
  location: {
    key: 'location',
    label: 'Ubicación & Dirección',
    description: 'Dirección postal, ciudad, provincia, código postal y país de residencia.',
    icon: 'MapPin',
  },
  professional: {
    key: 'professional',
    label: 'Profesional & Empresa',
    description: 'Empresa u organización, cargo, departamento y datos corporativos.',
    icon: 'Building2',
  },
  lead_qualification: {
    key: 'lead_qualification',
    label: 'Calificación Comercial',
    description: 'Interés comercial, presupuesto estimado, plazo de decisión y score del lead.',
    icon: 'Target',
  },
  compliance_consent: {
    key: 'compliance_consent',
    label: 'Privacidad & Consentimiento',
    description: 'Aceptación de términos legales, RGPD y autorizaciones comerciales.',
    icon: 'ShieldCheck',
  },
  custom_attributes: {
    key: 'custom_attributes',
    label: 'Atributos Personalizados',
    description: 'Campos personalizados libres y etiquetas configuradas por la organización.',
    icon: 'Tags',
  },
};

export const CRM_FIELD_CATALOG: Record<string, CrmFieldDefinition> = {
  // --- IDENTIDAD ---
  firstName: {
    key: 'firstName',
    label: 'Nombre',
    group: 'identity',
    inputType: 'text',
    placeholder: 'Ej. Camilo',
    targetEntity: 'contact',
  },
  lastName: {
    key: 'lastName',
    label: 'Primer Apellido',
    group: 'identity',
    inputType: 'text',
    placeholder: 'Ej. Vega',
    targetEntity: 'contact',
  },
  secondLastName: {
    key: 'secondLastName',
    label: 'Segundo Apellido',
    group: 'identity',
    inputType: 'text',
    placeholder: 'Ej. Gómez',
    targetEntity: 'contact',
  },
  preferredName: {
    key: 'preferredName',
    label: 'Nombre Preferido / Alias',
    group: 'identity',
    inputType: 'text',
    placeholder: 'Ej. Cami',
    targetEntity: 'contact',
  },
  documentType: {
    key: 'documentType',
    label: 'Tipo de Documento',
    group: 'identity',
    inputType: 'select',
    options: [
      { value: 'DNI', label: 'DNI' },
      { value: 'NIE', label: 'NIE' },
      { value: 'PASSPORT', label: 'Pasaporte' },
      { value: 'TAX_ID', label: 'CIF / Identificación Fiscal' },
      { value: 'OTHER', label: 'Otro' },
    ],
    targetEntity: 'contact',
  },
  documentNumber: {
    key: 'documentNumber',
    label: 'Número de Documento',
    group: 'identity',
    inputType: 'text',
    placeholder: 'Ej. 12345678Z',
    targetEntity: 'contact',
  },
  birthDate: {
    key: 'birthDate',
    label: 'Fecha de Nacimiento',
    group: 'identity',
    inputType: 'date',
    targetEntity: 'contact',
  },
  gender: {
    key: 'gender',
    label: 'Género',
    group: 'identity',
    inputType: 'select',
    options: [
      { value: 'male', label: 'Masculino' },
      { value: 'female', label: 'Femenino' },
      { value: 'non_binary', label: 'No binario' },
      { value: 'other', label: 'Otro' },
      { value: 'prefer_not_to_say', label: 'Prefiero no especificar' },
    ],
    targetEntity: 'contact',
  },

  // --- CANALES DE CONTACTO ---
  email: {
    key: 'email',
    label: 'Correo Electrónico',
    group: 'contact_channels',
    inputType: 'email',
    placeholder: 'nombre@ejemplo.com',
    targetEntity: 'contact',
  },
  secondaryEmail: {
    key: 'secondaryEmail',
    label: 'Correo Secundario',
    group: 'contact_channels',
    inputType: 'email',
    placeholder: 'secundario@ejemplo.com',
    targetEntity: 'contact',
  },
  phone: {
    key: 'phone',
    label: 'Teléfono Móvil',
    group: 'contact_channels',
    inputType: 'tel',
    placeholder: '+34 600 000 000',
    targetEntity: 'contact',
  },
  secondaryPhone: {
    key: 'secondaryPhone',
    label: 'Teléfono Fijo / Alternativo',
    group: 'contact_channels',
    inputType: 'tel',
    placeholder: '+34 910 000 000',
    targetEntity: 'contact',
  },
  preferredChannel: {
    key: 'preferredChannel',
    label: 'Canal de Contacto Preferido',
    group: 'contact_channels',
    inputType: 'select',
    options: [
      { value: 'whatsapp', label: 'WhatsApp' },
      { value: 'phone', label: 'Llamada telefónica' },
      { value: 'email', label: 'Correo electrónico' },
    ],
    targetEntity: 'contact',
  },
  preferredLanguage: {
    key: 'preferredLanguage',
    label: 'Idioma Preferido',
    group: 'contact_channels',
    inputType: 'select',
    options: [
      { value: 'es', label: 'Español' },
      { value: 'en', label: 'Inglés' },
      { value: 'ca', label: 'Catalán' },
      { value: 'gl', label: 'Gallego' },
      { value: 'eu', label: 'Euskera' },
    ],
    targetEntity: 'contact',
  },

  // --- UBICACIÓN ---
  addressLine1: {
    key: 'addressLine1',
    label: 'Dirección (Línea 1)',
    group: 'location',
    inputType: 'text',
    placeholder: 'Calle, avenida, número...',
    targetEntity: 'contact',
  },
  addressLine2: {
    key: 'addressLine2',
    label: 'Piso / Puerta / Bloque',
    group: 'location',
    inputType: 'text',
    placeholder: 'Piso 3ºB',
    targetEntity: 'contact',
  },
  city: {
    key: 'city',
    label: 'Ciudad / Municipio',
    group: 'location',
    inputType: 'text',
    placeholder: 'Madrid, Barcelona, Valencia...',
    targetEntity: 'contact',
  },
  stateProvince: {
    key: 'stateProvince',
    label: 'Provincia / Región',
    group: 'location',
    inputType: 'text',
    placeholder: 'Madrid, Barcelona...',
    targetEntity: 'contact',
  },
  postalCode: {
    key: 'postalCode',
    label: 'Código Postal',
    group: 'location',
    inputType: 'text',
    placeholder: '28001',
    targetEntity: 'contact',
  },
  country: {
    key: 'country',
    label: 'País',
    group: 'location',
    inputType: 'text',
    placeholder: 'España',
    targetEntity: 'contact',
  },

  // --- PROFESIONAL & EMPRESA ---
  companyName: {
    key: 'companyName',
    label: 'Empresa / Razón Social',
    group: 'professional',
    inputType: 'text',
    placeholder: 'Ej. Acme Corp, BBVA...',
    targetEntity: 'contact',
  },
  jobTitle: {
    key: 'jobTitle',
    label: 'Cargo / Puesto',
    group: 'professional',
    inputType: 'text',
    placeholder: 'Director Comercial, CTO, Consultor...',
    targetEntity: 'contact',
  },
  department: {
    key: 'department',
    label: 'Departamento',
    group: 'professional',
    inputType: 'text',
    placeholder: 'Ventas, Finanzas, Operaciones...',
    targetEntity: 'contact',
  },

  // --- CALIFICACIÓN DE LEAD ---
  interest: {
    key: 'interest',
    label: 'Interés / Producto Solicitado',
    group: 'lead_qualification',
    inputType: 'text',
    placeholder: 'Ej. Seguro de Salud, Hipoteca...',
    targetEntity: 'lead',
  },
  estimatedBudget: {
    key: 'estimatedBudget',
    label: 'Presupuesto Estimado (€)',
    group: 'lead_qualification',
    inputType: 'number',
    placeholder: 'Ej. 5000',
    targetEntity: 'lead',
  },
  purchaseTimeline: {
    key: 'purchaseTimeline',
    label: 'Plazo Estimado de Compra',
    group: 'lead_qualification',
    inputType: 'select',
    options: [
      { value: 'immediate', label: 'Inmediato (< 1 mes)' },
      { value: '1_3_months', label: '1 a 3 meses' },
      { value: '3_6_months', label: '3 a 6 meses' },
      { value: 'evaluating', label: 'Sólo explorando / Evaluando' },
    ],
    targetEntity: 'lead',
  },
  leadScore: {
    key: 'leadScore',
    label: 'Puntuación del Lead (1-100)',
    group: 'lead_qualification',
    inputType: 'number',
    placeholder: '85',
    targetEntity: 'lead',
  },
};

export const CrmSectionFieldConfigSchema = z.object({
  organizationId: z.string().uuid().optional(),
  sectionKey: z.string().min(1),
  enabledGroups: z.array(CrmFieldGroupKeySchema),
  visibleFields: z.array(z.string()),
  requiredFields: z.array(z.string()),
});
export type CrmSectionFieldConfig = z.infer<typeof CrmSectionFieldConfigSchema>;

export const DEFAULT_SECTION_FIELD_CONFIGS: Record<string, CrmSectionFieldConfig> = {
  lead_capture: {
    sectionKey: 'lead_capture',
    enabledGroups: ['identity', 'contact_channels', 'lead_qualification'],
    visibleFields: [
      'firstName',
      'lastName',
      'email',
      'phone',
      'interest',
      'estimatedBudget',
      'purchaseTimeline',
    ],
    requiredFields: ['firstName', 'interest'],
  },
  quick_lead_modal: {
    sectionKey: 'quick_lead_modal',
    enabledGroups: ['identity', 'contact_channels', 'lead_qualification'],
    visibleFields: ['firstName', 'phone', 'email', 'interest'],
    requiredFields: ['firstName', 'interest'],
  },
  contact_create: {
    sectionKey: 'contact_create',
    enabledGroups: ['identity', 'contact_channels', 'professional', 'location'],
    visibleFields: [
      'firstName',
      'lastName',
      'documentType',
      'documentNumber',
      'email',
      'phone',
      'companyName',
      'jobTitle',
      'city',
      'country',
    ],
    requiredFields: ['firstName'],
  },
  customer_360: {
    sectionKey: 'customer_360',
    enabledGroups: [
      'identity',
      'contact_channels',
      'location',
      'professional',
      'lead_qualification',
      'compliance_consent',
      'custom_attributes',
    ],
    visibleFields: Object.keys(CRM_FIELD_CATALOG),
    requiredFields: ['firstName'],
  },
};
