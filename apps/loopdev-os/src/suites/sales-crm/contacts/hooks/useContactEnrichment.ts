'use client';

import { useMemo } from 'react';
import type { CrmContact } from '@loopdev/contracts';
import type { EnrichedContactMeta } from '../types';

/**
 * Enriches real CRM contacts with realistic commercial data for Untitled UI preview
 * When real deals are linked, those can override these values.
 */
export function useContactEnrichment(contacts: CrmContact[]) {
  const metaMap = useMemo(() => {
    const map = new Map<string, EnrichedContactMeta>();

    contacts.forEach((contact, idx) => {
      // Deterministic generation based on contact id
      const seed = contact.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const dealCount = (seed % 4) + (idx % 2 === 0 ? 1 : 0);
      const totalPipelineValue = dealCount > 0 ? (seed % 9 + 1) * 3500 : 0;
      const leadScore = 40 + (seed % 55);

      map.set(contact.id, {
        dealCount,
        totalPipelineValue,
        leadScore,
        lastActivityText: 'Hace ' + ((seed % 12) + 1) + 'h',
      });
    });

    return map;
  }, [contacts]);

  return {
    getMeta: (contactId: string): EnrichedContactMeta => {
      return (
        metaMap.get(contactId) ?? {
          dealCount: 0,
          totalPipelineValue: 0,
          leadScore: 50,
          lastActivityText: 'Hoy',
        }
      );
    },
  };
}
