'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Heading, ModuleHeader, Select, TechnicalSurface } from '@loopdev/ui';
import type { CrmContact, PipelineStage } from '@loopdev/contracts';

import { useOrganization } from '@/hooks/useOrganization';
import { useOrganizationPermissions } from '@/hooks/useOrganizationPermissions';
import { usePlatformRuntime } from '@/providers/PlatformRuntimeProvider';
import {
  createCrmOpportunity,
  crmContacts,
  crmPipelineStages,
} from '@/suites/sales-crm/runtimeAdapter';

function contactLabel(contact: CrmContact) {
  return (
    [contact.firstName, contact.lastName].filter(Boolean).join(' ') || contact.email || contact.id
  );
}

export function OpportunityForm() {
  const router = useRouter();
  const { activeOrganizationId } = useOrganization();
  const { mode } = usePlatformRuntime();
  const { isLoading: isLoadingPermissions, hasPermission } = useOrganizationPermissions([
    'crm.read',
    'crm.manage',
  ]);
  const canRead = hasPermission('crm.read');
  const canManage = hasPermission('crm.manage');
  const [contacts, setContacts] = useState<CrmContact[]>([]);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [contactId, setContactId] = useState('');
  const [stageKey, setStageKey] = useState('');
  const [name, setName] = useState('');
  const [productKey, setProductKey] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [probability, setProbability] = useState('');
  const [expectedCloseDate, setExpectedCloseDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeOrganizationId || isLoadingPermissions || !canRead) {
      setIsLoading(false);
      return;
    }
    const controller = new AbortController();
    Promise.all([
      crmContacts(mode, activeOrganizationId, '', controller.signal),
      crmPipelineStages(mode, activeOrganizationId, controller.signal),
    ])
      .then(([contactsPage, nextStages]) => {
        setContacts(contactsPage.items);
        const activeStages = nextStages.filter((stage) => stage.active);
        setStages(activeStages);
        setStageKey(
          activeStages.find((stage) => stage.terminalType === 'open')?.key ??
            activeStages[0]?.key ??
            '',
        );
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Form options could not be loaded.',
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [activeOrganizationId, canRead, isLoadingPermissions, mode]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeOrganizationId || !canManage || isSaving) return;
    setIsSaving(true);
    setError(null);
    try {
      const opportunity = await createCrmOpportunity(mode, {
        organizationId: activeOrganizationId,
        contactId,
        productKey,
        name,
        currency,
        amount: amount ? Number(amount) : null,
        probability: probability ? Number(probability) : null,
        expectedCloseDate: expectedCloseDate || null,
        idempotencyKey: `crm-ui-opportunity-${crypto.randomUUID()}`,
      });
      router.push(
        opportunity.id ? `/sales-crm/opportunities/${opportunity.id}` : '/sales-crm/pipeline',
      );
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error ? requestError.message : 'Opportunity could not be created.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoadingPermissions || !activeOrganizationId) {
    return <div className="text-text-muted p-6 text-sm">Preparing opportunity form...</div>;
  }
  if (!canManage) {
    return (
      <div className="text-text-muted flex min-h-full items-center justify-center p-6 text-sm">
        You do not have permission to create opportunities.
      </div>
    );
  }

  return (
    <div className="bg-shell-canvas flex min-h-full min-w-0 flex-1 flex-col">
      <ModuleHeader
        segments={[
          { id: 'pipeline', label: 'Pipeline', href: '/sales-crm/pipeline' },
          { id: 'new-opportunity', label: 'New opportunity' },
        ]}
        leftSlot={
          <Heading as="h1" size="lg" weight="semibold">
            Create opportunity
          </Heading>
        }
        ariaLabel="Create opportunity header"
      />
      <main className="min-h-0 flex-1 overflow-auto p-4 lg:p-8">
        <form onSubmit={submit} aria-busy={isLoading} className="mx-auto max-w-3xl space-y-4">
          <TechnicalSurface
            variant="surface"
            radius="md"
            border="technical"
            className="space-y-5 p-5"
          >
            <div>
              <p className="text-text-muted text-sm">
                Manual opportunities stay in the active organization and are created with origin{' '}
                <strong>manual</strong>.
              </p>
            </div>
            {error ? (
              <div
                role="alert"
                className="border-status-error/40 bg-status-error/10 text-status-error rounded-md border p-3 text-sm"
              >
                {error}
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Opportunity name"
                required
                value={name}
                onChange={setName}
                placeholder="Renewal proposal"
              />
              <Field
                label="Product or interest"
                required
                value={productKey}
                onChange={setProductKey}
                placeholder="health"
              />
              <Select
                label="Contact"
                required
                searchable
                placeholder="Select an authorized contact"
                value={contactId}
                onValueChange={setContactId}
                options={contacts.map((contact) => ({
                  value: contact.id,
                  label: contactLabel(contact),
                  description: contact.email || undefined,
                }))}
              />
              <Select
                label="Default stage"
                disabled
                value={stageKey}
                options={stages.map((stage) => ({
                  value: stage.key,
                  label: stage.name ?? stage.label ?? stage.key,
                }))}
              />
              <Field label="Amount" value={amount} onChange={setAmount} type="number" min="0" />
              <Field label="Currency" value={currency} onChange={setCurrency} maxLength={3} />
              <Field
                label="Probability (%)"
                value={probability}
                onChange={setProbability}
                type="number"
                min="0"
                max="100"
              />
              <Field
                label="Expected close date"
                value={expectedCloseDate}
                onChange={setExpectedCloseDate}
                type="date"
              />
            </div>
            {stages.length === 0 ? (
              <p className="text-status-error text-sm">
                No active pipeline stage is configured. An opportunity cannot be created yet.
              </p>
            ) : null}
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/sales-crm/pipeline')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving || !contactId || !name || !productKey || stages.length === 0}
              >
                {isSaving ? 'Creating…' : 'Create opportunity'}
              </Button>
            </div>
          </TechnicalSurface>
        </form>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  min?: string;
  max?: string;
  maxLength?: number;
  placeholder?: string;
}) {
  return (
    <label className="text-text-muted text-xs font-medium">
      {label} {required ? <span aria-hidden="true">*</span> : null}
      <input
        {...props}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border-border-subtle bg-background text-text-main focus-visible:ring-primary mt-1 min-h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2"
      />
    </label>
  );
}
