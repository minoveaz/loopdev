'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, FormActions, Heading, ModuleHeader, TechnicalSurface } from '@loopdev/ui';
import { useOrganization } from '@/hooks/useOrganization';
import { useOrganizationPermissions } from '@/hooks/useOrganizationPermissions';
import type { LeadCaptureResult } from './api';
import { LeadCaptureResultPanel } from './LeadCaptureResultPanel';
import { LeadForm } from './LeadForm';
import { useLeadCaptureForm } from './useLeadCaptureForm';

const CAPTURE_FORM_ID = 'lead-capture-workspace-form';

/**
 * `/sales-crm/leads/new` full capture workflow
 * (CRM_LEADS_UI_IMPLEMENTATION_PLAN.md Fase 2, `ImmersiveWorkflow` recipe /
 * `full-bleed` canvas). Shares `LeadForm` and `useLeadCaptureForm` with
 * `QuickLeadCapture` so both surfaces apply identical validation and error
 * handling.
 */
export function LeadCaptureWorkspace() {
  const router = useRouter();
  const { activeOrganizationId } = useOrganization();
  const { isLoading: isLoadingPermissions, hasPermission } = useOrganizationPermissions([
    'crm.read',
    'crm.manage',
  ]);
  const canManage = hasPermission('crm.manage');
  const [result, setResult] = useState<LeadCaptureResult | null>(null);
  const { form, submit } = useLeadCaptureForm({
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
    <div className="bg-shell-canvas flex min-h-full flex-1 flex-col">
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
      <main className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">
        {result ? (
          <LeadCaptureResultPanel
            result={result}
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
      </main>
    </div>
  );
}
