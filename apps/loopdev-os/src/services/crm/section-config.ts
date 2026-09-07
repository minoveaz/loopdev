import {
  CrmSectionFieldConfig,
  CrmSectionFieldConfigSchema,
  DEFAULT_SECTION_FIELD_CONFIGS,
  CRM_FIELD_CATALOG,
} from '@loopdev/contracts';
import { createServerSupabaseClient } from '@/lib/supabase/server';

interface SectionConfigRow {
  section_key: string;
  enabled_groups: string[];
  visible_fields: string[];
  required_fields: string[];
}

export async function getSectionFieldConfig(
  organizationId: string,
  sectionKey: string
): Promise<CrmSectionFieldConfig> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = (await (supabase as any)
    .from('crm_section_field_configs')
    .select('section_key, enabled_groups, visible_fields, required_fields')
    .eq('organization_id', organizationId)
    .eq('section_key', sectionKey)
    .maybeSingle()) as { data: SectionConfigRow | null; error: any };

  if (error) {
    console.warn(`[getSectionFieldConfig] Error loading config for ${sectionKey}, falling back to defaults`, error);
  }

  if (data) {
    return CrmSectionFieldConfigSchema.parse({
      organizationId,
      sectionKey: data.section_key,
      enabledGroups: data.enabled_groups,
      visibleFields: data.visible_fields,
      requiredFields: data.required_fields,
    });
  }

  // Fallback to defaults
  const fallback = DEFAULT_SECTION_FIELD_CONFIGS[sectionKey] ?? {
    sectionKey,
    enabledGroups: ['identity', 'contact_channels'],
    visibleFields: ['firstName', 'lastName', 'email', 'phone'],
    requiredFields: ['firstName'],
  };

  return {
    ...fallback,
    organizationId,
  };
}

export async function saveSectionFieldConfig(
  organizationId: string,
  config: CrmSectionFieldConfig
): Promise<CrmSectionFieldConfig> {
  const parsed = CrmSectionFieldConfigSchema.parse(config);
  const supabase = await createServerSupabaseClient();

  const { data, error } = (await (supabase as any)
    .from('crm_section_field_configs')
    .upsert(
      {
        organization_id: organizationId,
        section_key: parsed.sectionKey,
        enabled_groups: parsed.enabledGroups,
        visible_fields: parsed.visibleFields,
        required_fields: parsed.requiredFields,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'organization_id, section_key' }
    )
    .select('section_key, enabled_groups, visible_fields, required_fields')
    .single()) as { data: SectionConfigRow | null; error: any };

  if (error || !data) {
    throw new Error(`Unable to save section field config: ${error?.message ?? 'no data returned'}`);
  }

  return CrmSectionFieldConfigSchema.parse({
    organizationId,
    sectionKey: data.section_key,
    enabledGroups: data.enabled_groups,
    visibleFields: data.visible_fields,
    requiredFields: data.required_fields,
  });
}
