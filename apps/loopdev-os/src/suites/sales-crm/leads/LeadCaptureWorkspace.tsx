'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, FormActions, Heading, ModuleHeader, SuiteCanvas, TechnicalSurface } from '@loopdev/ui';
import { useOrganization } from '@/hooks/useOrganization';
import { useOrganizationPermissions } from '@/hooks/useOrganizationPermissions';
import type { LeadCaptureCompletion } from './api';
import { LeadCaptureResultPanel } from './LeadCaptureResultPanel';
import { LeadForm } from './LeadForm';
import { useLeadCaptureForm } from './useLeadCaptureForm';

const CAPTURE_FORM_ID = 'lead-capture-workspace-form';

/**
 * `/sales-crm/leads/new` full capture workflow in SuiteCanvas mode workspace
 */
export function LeadCaptureWorkspace() {
  const router = useRouter();
  const { activeOrganizationId } = useOrganization();
  const { isLoading: isLoadingPermissions, hasPermission } = useOrganizationPermissions([
    'crm.read',
    'crm.manage',
  ]);
  const canManage = hasPermission('crm.manage');
  const [result, setResult] = useState<LeadCaptureCompletion | null>(null);
  const { form, submit, retryInitialNote, isRetryingInitialNote } = useLeadCaptureForm({
    organizationId: activeOrganizationId ?? '',
    onSuccess: setResult,
  });

  if (isLoadingPermissions || !activeOrganizationId) {
    return <div className="text-text-muted p-6 text-sm">Preparando captura de Lead...</div>;
  }

  if (!canManage) {
    return (
      <div className="flex min-h-full items-center justify-center p-6">
        <p className="text-text-muted text-sm">No tienes permiso para crear Leads.</p>
      </div>
    );
  }

  return (
    <SuiteCanvas
      mode="workspace"
      header={
        <ModuleHeader
          segments={[
            { id: 'leads', label: 'Leads', href: '/sales-crm/leads' },
            { id: 'leads-new', label: 'Nuevo lead' },
          ]}
          leftSlot={
            <Heading as="h1" size="lg" weight="semibold">
              Nuevo lead
            </Heading>
          }
          rightSlot={
            <Button type="button" variant="ghost" onClick={() => router.push('/sales-crm/leads')}>
              Volver a la lista
            </Button>
          }
          ariaLabel="Nuevo lead"
        />
      }
    >
      <div className="w-full max-w-4xl mx-auto py-4">
        {result ? (
          <LeadCaptureResultPanel
            result={result}
            isRetryingInitialNote={isRetryingInitialNote}
            onRetryInitialNote={async () => setResult(await retryInitialNote(result))}
            onCreateAnother={() => {
              setResult(null);
              form.reset();
            }}
          />
        ) : (
          <TechnicalSurface
            variant="surface"
            radius="md"
            border="technical"
            className="mx-auto w-full max-w-3xl space-y-5 p-6"
          >
            <LeadForm
              formId={CAPTURE_FORM_ID}
              organizationId={activeOrganizationId}
              form={form}
              onSubmit={submit}
            />
            <FormActions>
              <Button type="button" variant="ghost" onClick={() => router.push('/sales-crm/leads')}>
                Cancelar
              </Button>
              <Button
                type="submit"
                form={CAPTURE_FORM_ID}
                variant="primary"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Capturando…' : 'Capturar lead'}
              </Button>
            </FormActions>
          </TechnicalSurface>
        )}
      </div>
    </SuiteCanvas>
  );
}
