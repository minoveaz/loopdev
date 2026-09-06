'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Heading, ModuleHeader, TechnicalSurface } from '@loopdev/ui';
import type { CrmContact, CrmContactPage, PipelineStage } from '@loopdev/contracts';

import { useOrganization } from '@/hooks/useOrganization';
import { useOrganizationPermissions } from '@/hooks/useOrganizationPermissions';

function contactLabel(contact: CrmContact) {
  return (
    [contact.firstName, contact.lastName].filter(Boolean).join(' ') || contact.email || contact.id
  );
}

export function OpportunityForm() {
  const router = useRouter();
  const { activeOrganizationId } = useOrganization();
  const { isLoading: isLoadingPermissions, hasPermission } = useOrganizationPermissions([
    'crm.read',
    'crm.manage',
  ]);
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
    if (!activeOrganizationId || isLoadingPermissions || !hasPermission('crm.read')) {
      setIsLoading(false);
      return;
    }
    const controller = new AbortController();
    const scope = `organizationId=${encodeURIComponent(activeOrganizationId)}&limit=100`;
    Promise.all([
      fetch(`/api/crm/contacts?${scope}`, { signal: controller.signal }),
      fetch(`/api/crm/pipeline/stages?organizationId=${encodeURIComponent(activeOrganizationId)}`, {
        signal: controller.signal,
      }),
    ])
      .then(async ([contactsResponse, stagesResponse]) => {
        if (!contactsResponse.ok || !stagesResponse.ok)
          throw new Error('Form options could not be loaded.');
        const contactsPage = (await contactsResponse.json()) as CrmContactPage;
        const nextStages = (await stagesResponse.json()) as PipelineStage[];
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
  }, [activeOrganizationId, isLoadingPermissions]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeOrganizationId || !canManage || isSaving) return;
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/crm/opportunities', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'idempotency-key': `crm-ui-opportunity-${crypto.randomUUID()}`,
        },
        body: JSON.stringify({
          organizationId: activeOrganizationId,
          contactId,
          productKey,
          name,
          currency,
          amount: amount ? Number(amount) : null,
          probability: probability ? Number(probability) : null,
          expectedCloseDate: expectedCloseDate || null,
        }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Opportunity could not be created.');
      }
      const opportunity = (await response.json()) as { id?: string };
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
      <div className="flex min-h-full items-center justify-center p-6 text-sm text-text-muted">
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
              <label className="text-text-muted text-xs font-medium">
                Contact <span aria-hidden="true">*</span>
                <select
                  required
                  value={contactId}
                  onChange={(event) => setContactId(event.target.value)}
                  className="border-border-subtle bg-background text-text-main mt-1 min-h-10 w-full rounded-md border px-3 text-sm"
                >
                  <option value="">Select an authorized contact</option>
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contactLabel(contact)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-text-muted text-xs font-medium">
                Default stage
                <select
                  disabled
                  value={stageKey}
                  className="border-border-subtle bg-background text-text-main mt-1 min-h-10 w-full rounded-md border px-3 text-sm"
                >
                  {stages.map((stage) => (
                    <option key={stage.key} value={stage.key}>
                      {stage.name ?? stage.label ?? stage.key}
                    </option>
                  ))}
                </select>
              </label>
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
        className="border-border-subtle bg-background text-text-main mt-1 min-h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
    </label>
  );
}
