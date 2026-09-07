'use client';

import React, { useState } from 'react';
import type { CrmContact } from '@loopdev/contracts';
import { Button } from '@loopdev/ui';
import { Check } from 'lucide-react';
import { FieldGroupSection } from '@/suites/sales-crm/crm/FieldGroupSection';
import { usePlatformRuntime } from '@/providers/PlatformRuntimeProvider';
import { updateCrmContact } from '@/suites/sales-crm/runtimeAdapter';

interface ContactDetailDrawerContentProps {
  contact: CrmContact;
  organizationId: string;
  onClose: () => void;
  onContactUpdated: (updated: CrmContact) => void;
}

export function ContactDetailDrawerContent({
  contact,
  organizationId,
  onClose,
  onContactUpdated,
}: ContactDetailDrawerContentProps) {
  const { mode } = usePlatformRuntime();
  const [formData, setFormData] = useState<Record<string, string>>({
    firstName: contact.firstName || '',
    lastName: contact.lastName || '',
    secondLastName: contact.secondLastName || '',
    preferredName: contact.preferredName || '',
    documentType: contact.documentType || '',
    documentNumber: contact.documentNumber || '',
    birthDate: contact.birthDate || '',
    gender: contact.gender || '',
    email: contact.email || '',
    secondaryEmail: contact.secondaryEmail || '',
    phone: contact.phone || '',
    secondaryPhone: contact.secondaryPhone || '',
    preferredChannel: contact.preferredChannel || '',
    preferredLanguage: contact.preferredLanguage || 'es',
    addressLine1: contact.addressLine1 || '',
    addressLine2: contact.addressLine2 || '',
    city: contact.city || '',
    stateProvince: contact.stateProvince || '',
    postalCode: contact.postalCode || '',
    country: contact.country || 'ES',
    companyName: contact.companyName || '',
    jobTitle: contact.jobTitle || '',
    department: contact.department || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFieldChange = (fieldKey: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'preview') {
      setErrorMessage(
        mode === 'preview'
          ? 'Preview is read-only. Contact updates are disabled.'
          : 'Contact updates are not available in this sandbox slice yet.',
      );
      return;
    }
    setIsSaving(true);
    setErrorMessage(null);

    try {
      if (mode === 'sandbox') {
        const updatedContact = updateCrmContact(mode, {
          organizationId,
          contactId: contact.id,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim() || null,
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
          companyName: formData.companyName.trim() || null,
          expectedUpdatedAt: contact.updatedAt,
        });
        onContactUpdated(updatedContact);
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          onClose();
        }, 1000);
        return;
      }
      const response = await fetch('/api/crm/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          contactId: contact.id,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim() || null,
          secondLastName: formData.secondLastName?.trim() || null,
          preferredName: formData.preferredName?.trim() || null,
          documentType: formData.documentType || null,
          documentNumber: formData.documentNumber?.trim() || null,
          birthDate: formData.birthDate || null,
          gender: formData.gender || null,
          email: formData.email.trim() || null,
          secondaryEmail: formData.secondaryEmail?.trim() || null,
          phone: formData.phone.trim() || null,
          secondaryPhone: formData.secondaryPhone?.trim() || null,
          preferredChannel: formData.preferredChannel || null,
          preferredLanguage: formData.preferredLanguage || 'es',
          addressLine1: formData.addressLine1?.trim() || null,
          addressLine2: formData.addressLine2?.trim() || null,
          city: formData.city?.trim() || null,
          stateProvince: formData.stateProvince?.trim() || null,
          postalCode: formData.postalCode?.trim() || null,
          country: formData.country?.trim() || 'ES',
          companyName: formData.companyName.trim() || null,
          jobTitle: formData.jobTitle?.trim() || null,
          department: formData.department?.trim() || null,
          expectedUpdatedAt: contact.updatedAt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Error al actualizar el contacto');
      }

      const updatedContact = (await response.json()) as CrmContact;
      onContactUpdated(updatedContact);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error desconocido al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      id="customer-360-contact-edit-form"
      onSubmit={handleSubmit}
      className="flex h-full flex-col space-y-4 pb-20 sm:space-y-6 sm:pb-0"
    >
      {errorMessage && (
        <div
          role="alert"
          className="border-status-error/40 bg-status-error/10 text-status-error rounded-xl border p-3.5 text-xs font-medium"
        >
          {errorMessage}
        </div>
      )}

      {saveSuccess && (
        <div
          role="status"
          className="animate-in fade-in flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 text-xs font-medium text-emerald-700 dark:text-emerald-300"
        >
          <Check size={16} className="text-emerald-600" />
          <span>¡Contacto actualizado con éxito!</span>
        </div>
      )}

      {/* 1. Grupo: Identidad Personal */}
      <FieldGroupSection
        groupKey="identity"
        values={formData}
        onChange={handleFieldChange}
        requiredFields={['firstName']}
      />

      {/* 2. Grupo: Canales de Contacto */}
      <FieldGroupSection
        groupKey="contact_channels"
        values={formData}
        onChange={handleFieldChange}
      />

      {/* 3. Grupo: Ubicación & Dirección */}
      <FieldGroupSection groupKey="location" values={formData} onChange={handleFieldChange} />

      {/* 4. Grupo: Profesional & Empresa */}
      <FieldGroupSection groupKey="professional" values={formData} onChange={handleFieldChange} />

      {/* Footer desktop actions */}
      <div className="border-border-subtle bg-surface-light dark:bg-surface-dark sticky bottom-0 hidden items-center justify-end gap-3 border-t pb-2 pt-4 sm:flex">
        <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSaving}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" size="sm" disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
}
