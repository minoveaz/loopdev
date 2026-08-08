'use client';

import React from 'react';
import { Heading, LpdText, Button } from '@loopdev/ui';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useOrganization } from '@/hooks/useOrganization';
import { useAuth } from '@/hooks/useAuth';
import { useBrandContextSnapshot } from '@/hooks/marketing/useBrandContextSnapshot';

export default function Page() {
  const brandId = useParams().brandId as string;
  const { activeOrganizationId } = useOrganization();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: context, isLoading } = useBrandContextSnapshot(brandId);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const publish = async () => {
    if (!activeOrganizationId || !user || isPublishing) return;
    setIsPublishing(true); setMessage(null);
    const response = await fetch(`/api/marketing/brands/${brandId}/publish?organizationId=${activeOrganizationId}`, { method: 'POST' });
    setMessage(response.ok ? 'Brand context published successfully.' : 'Unable to publish brand context.');
    if (response.ok) {
      await queryClient.invalidateQueries({ queryKey: ['brand-context-snapshot', activeOrganizationId, brandId] });
      await queryClient.invalidateQueries({ queryKey: ['brand-context-versions', activeOrganizationId, brandId] });
    }
    setIsPublishing(false);
  };
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Heading as="h2" size="2xl" weight="bold" className="text-text-main uppercase tracking-tight">
          publish
        </Heading>
        <LpdText size="sm" className="text-text-muted max-w-xl">
          This is the publish view for the active brand.
        </LpdText>
      </header>
      <div className="flex flex-col gap-4 rounded-2xl border border-border-technical p-6">
        <LpdText size="sm" className="text-text-muted">Current context: {isLoading ? 'loading…' : context?.version.number ? `version ${context.version.number}` : 'draft'}</LpdText>
        <Button onClick={publish} disabled={isPublishing || !context}>{isPublishing ? 'Publishing…' : 'Publish brand context'}</Button>
        {message && <LpdText size="sm" className="text-text-muted">{message}</LpdText>}
      </div>
    </div>
  );
}
