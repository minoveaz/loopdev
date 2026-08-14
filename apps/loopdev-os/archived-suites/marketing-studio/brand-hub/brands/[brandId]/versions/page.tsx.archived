'use client';

import React from 'react';
import { Heading, LpdText } from '@loopdev/ui';
import { useParams } from 'next/navigation';
import { useBrandContextVersions } from '@/hooks/marketing/useBrandContextVersions';

export default function Page() {
  const brandId = useParams().brandId as string;
  const { data: versions = [], isLoading } = useBrandContextVersions(brandId);
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Heading as="h2" size="2xl" weight="bold" className="text-text-main uppercase tracking-tight">
          versions
        </Heading>
        <LpdText size="sm" className="text-text-muted max-w-xl">
          This is the versions view for the active brand.
        </LpdText>
      </header>
      {isLoading ? <LpdText size="sm">Loading versions…</LpdText> : versions.length === 0 ? (
        <LpdText size="sm" className="text-text-muted">No published brand context versions yet.</LpdText>
      ) : versions.map((version) => (
        <div key={version.id} className="flex items-center justify-between rounded-2xl border border-border-technical p-4">
          <LpdText size="sm" weight="bold">Version {version.versionNumber}</LpdText>
          <LpdText size="nano" className="uppercase text-text-muted">{version.status} · {version.publishedAt ?? version.createdAt}</LpdText>
        </div>
      ))}
    </div>
  );
}
