'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useActiveBrand } from '@/hooks/brand-hub/useActiveBrand';
import { useBrandHub } from '@/suites/marketing-studio/brand-hub/context';
import { LpdText, Skeleton } from '@loopdev/ui';

// Components (Certified Blocks)
import { NarrativeBlock } from '@/suites/marketing-studio/brand-hub/components/NarrativeBlock';
import { VoiceToneBlock } from '@/suites/marketing-studio/brand-hub/components/VoiceToneBlock';
import { ClaimsGovernanceBlock } from '@/suites/marketing-studio/brand-hub/components/ClaimsGovernanceBlock';

/**
 * @page BrandIdentityPage
 * @description Operational console for defining brand narrative, voice and compliance.
 */
export default function BrandIdentityPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const { data: brand, isLoading } = useActiveBrand(brandId);
  const { setInspectorOpen, setSelectedEntity } = useBrandHub();
  
  // Local state for active tab in inspector (simulated for now)
  const [activeInspectorTab, setActiveInspectorTab] = useState<any>('context');

  if (isLoading) {
    return (
      <div className="flex flex-col gap-12 p-8 max-w-6xl mx-auto">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const identity = brand?.identity;
  const isDraft = brand?.status === 'draft';

  // --- CONSEQUENCE WIRING (Inspector Handlers) ---

  const handleNarrativeClick = (field: string) => {
    setSelectedEntity({
      type: `identity.${field}`,
      id: `${brandId}-${field}`,
      name: `${field.charAt(0).toUpperCase() + field.slice(1)} Definition`
    });
    // P0: Narrative clicks prioritize Diff in Draft mode
    setInspectorOpen(true);
  };

  const handleToneClick = (profile: any) => {
    setSelectedEntity({
      type: 'identity.tone',
      id: profile.id,
      name: `Tone: ${profile.name}`
    });
    setInspectorOpen(true);
  };

  const handleClaimClick = (claim: any) => {
    setSelectedEntity({
      type: 'identity.claim',
      id: claim.id,
      name: `Regulated: ${claim.text}`
    });
    setInspectorOpen(true);
  };

  const handleForbiddenClick = (term: string) => {
    setSelectedEntity({
      type: 'identity.forbidden',
      id: term,
      name: `Forbidden Term: ${term}`
    });
    setInspectorOpen(true);
  };

  if (!identity) {
    return (
      <div className="p-12 text-center border border-dashed border-border-technical rounded-3xl m-8 opacity-40">
        <LpdText size="sm" className="font-mono uppercase tracking-widest">// brand_identity_not_initialized</LpdText>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 p-8 max-w-6xl mx-auto animate-in fade-in duration-700 pb-24">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col gap-2">
        <LpdText size="2xl" weight="bold" className="text-text-main tracking-tight uppercase">
          Brand Identity _ORACLE
        </LpdText>
        <LpdText size="sm" className="text-text-muted max-w-2xl leading-relaxed">
          The semantic source of truth for all communication. These definitions govern AI generation and campaign compliance across the organization.
        </LpdText>
      </header>

      {/* BLOCK A: Narrative Foundation */}
      <section id="narrative">
        <NarrativeBlock 
          data={identity.narrative} 
          isEditable={isDraft}
          onFieldClick={handleNarrativeClick}
        />
      </section>

      {/* BLOCK B: Voice & Tone */}
      <section id="voice-tone">
        <VoiceToneBlock 
          profiles={identity.voice.profiles} 
          isLoading={false}
          onProfileClick={handleToneClick}
        />
      </section>

      {/* BLOCK C: Claims & Compliance */}
      <section id="compliance">
        <ClaimsGovernanceBlock 
          forbidden={identity.claims.forbidden}
          regulated={identity.claims.regulated}
          onClaimClick={handleClaimClick}
          onForbiddenClick={handleForbiddenClick}
        />
      </section>

    </div>
  );
}
