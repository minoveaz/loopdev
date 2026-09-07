'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  CrmFieldGroupKey,
  CrmSectionFieldConfig,
  DEFAULT_SECTION_FIELD_CONFIGS,
} from '@loopdev/contracts';
import { useOrganization } from './useOrganization';

export function useCrmSectionConfig(sectionKey: string) {
  const { activeOrganizationId } = useOrganization();
  const defaultConfig = useMemo(
    () =>
      DEFAULT_SECTION_FIELD_CONFIGS[sectionKey] ?? {
        sectionKey,
        enabledGroups: ['identity', 'contact_channels'],
        visibleFields: ['firstName', 'lastName', 'email', 'phone'],
        requiredFields: ['firstName'],
      },
    [sectionKey],
  );

  const [config, setConfig] = useState<CrmSectionFieldConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!activeOrganizationId) return;
    let isMounted = true;

    async function loadConfig() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/crm/config/sections?organizationId=${activeOrganizationId}&sectionKey=${sectionKey}`,
        );
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data?.enabledGroups) {
            setConfig(data);
          }
        }
      } catch (err) {
        console.warn(
          `[useCrmSectionConfig] Error loading config for ${sectionKey}, using defaults:`,
          err,
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadConfig();

    return () => {
      isMounted = false;
    };
  }, [activeOrganizationId, sectionKey]);

  const isGroupEnabled = useCallback(
    (groupKey: CrmFieldGroupKey) => {
      return config.enabledGroups.includes(groupKey);
    },
    [config.enabledGroups],
  );

  const isFieldVisible = useCallback(
    (fieldKey: string) => {
      return config.visibleFields.includes(fieldKey);
    },
    [config.visibleFields],
  );

  const isFieldRequired = useCallback(
    (fieldKey: string) => {
      return config.requiredFields.includes(fieldKey);
    },
    [config.requiredFields],
  );

  return {
    config,
    isLoading,
    isGroupEnabled,
    isFieldVisible,
    isFieldRequired,
  };
}
