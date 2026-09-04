'use client';

import { useState, type FormEvent } from 'react';
import { Button, FormActions, Input, TechnicalDialog } from '@loopdev/ui';
import type { CrmLead } from '@loopdev/contracts';
import { createOpportunityFromLead, LeadApiError, type LeadConversionResult } from './api';
import { OpportunityResultPanel } from './OpportunityResultPanel';

type CreateOpportunityFromLeadProps = {
  open: boolean;
  organizationId: string;
  lead: CrmLead;
  onClose: () => void;
  onSuccess: (result: LeadConversionResult) => void;
};

export function CreateOpportunityFromLead({
  open,
  organizationId,
  lead,
  onClose,
  onSuccess,
}: CreateOpportunityFromLeadProps) {
  const [product, setProduct] = useState(lead.interest ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [result, setResult] = useState<
    { kind: 'success'; conversion: LeadConversionResult } | { kind: 'conflict'; message: string }
  >();

  if (!open || (!['cualificado', 'convertido'].includes(lead.status) && !result)) return null;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = product.trim();
    if (!value) {
      setValidationMessage('Indica un producto o interés para crear la Opportunity.');
      return;
    }
    setValidationMessage(null);
    setIsSubmitting(true);
    try {
      const conversion = await createOpportunityFromLead({
        organizationId,
        leadId: lead.id,
        productKey: value,
        name: value,
      });
      setResult({ kind: 'success', conversion });
      onSuccess(conversion);
    } catch (error: unknown) {
      const message =
        error instanceof LeadApiError && error.code === 'CONFLICT'
          ? 'El Lead cambió mientras lo convertías. Actualiza los datos y vuelve a intentarlo.'
          : error instanceof LeadApiError && error.code === 'INVALID_STATUS_TRANSITION'
            ? 'Solo se pueden convertir Leads cualificados o ya convertidos.'
            : error instanceof LeadApiError
              ? error.message
              : 'No se pudo convertir el Lead.';
      setResult({ kind: 'conflict', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TechnicalDialog
      isOpen={open}
      onClose={onClose}
      title="Crear Opportunity desde Lead"
      description="Crea una Opportunity por producto sin duplicar el Lead ni el Contacto."
      presentation="form"
      size="md"
      closeLabel="Cerrar conversión de Lead"
      actions={
        result?.kind === 'success' ? null : (
          <FormActions className="w-full justify-between md:w-auto md:justify-end">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form="lead-conversion-form"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creando…' : 'Crear Opportunity'}
            </Button>
          </FormActions>
        )
      }
    >
      {result ? (
        <OpportunityResultPanel
          result={result}
          onClose={onClose}
          onRetry={() => setResult(undefined)}
        />
      ) : (
        <form id="lead-conversion-form" className="space-y-4" onSubmit={submit}>
          <div className="border-border-subtle bg-background-subtle/30 rounded-md border p-3 text-sm">
            <p className="text-text-main font-medium">Contacto heredado del Lead</p>
            <p className="text-text-muted mt-1">
              El Contacto no se puede cambiar durante la conversión.
            </p>
          </div>
          <Input
            label="Producto o interés"
            value={product}
            onChange={(event) => {
              setProduct(event.target.value);
              if (validationMessage) setValidationMessage(null);
            }}
            error={validationMessage ?? undefined}
            required
            autoFocus
          />
        </form>
      )}
    </TechnicalDialog>
  );
}
