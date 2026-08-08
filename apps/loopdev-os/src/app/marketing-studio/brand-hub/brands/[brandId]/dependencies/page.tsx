'use client';

import React from 'react';
import { Heading, LpdText } from '@loopdev/ui';
import { useParams } from 'next/navigation';
import { useBrandContextSnapshot } from '@/hooks/marketing/useBrandContextSnapshot';

export default function Page() {
  const brandId = useParams().brandId as string;
  const { data: context, isLoading } = useBrandContextSnapshot(brandId);
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Heading as="h2" size="2xl" weight="bold" className="text-text-main uppercase tracking-tight">
          dependencies
        </Heading>
        <LpdText size="sm" className="text-text-muted max-w-xl">
          This is the dependencies view for the active brand.
        </LpdText>
      </header>
      <div className="rounded-2xl border border-border-technical p-6">
        <LpdText size="sm" className="text-text-muted">
          {isLoading ? 'Loading dependencies…' : `${context?.assets.length ?? 0} approved assets and ${context?.approvedClaims.length ?? 0} approved claims available to downstream modules.`}
        </LpdText>
      </div>
    </div>
  );
}
