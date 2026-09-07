'use client';

import React, { useState } from 'react';
import type { CrmContact } from '@loopdev/contracts';
import { Button, Input, PhoneInput } from '@loopdev/ui';
import { Building2, User, Mail, Phone, ShieldCheck, Clock, FileText, Check } from 'lucide-react';

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
  const [firstName, setFirstName] = useState(contact.firstName || '');
  const [lastName, setLastName] = useState(contact.lastName || '');
  const [email, setEmail] = useState(contact.email || '');
  const [phone, setPhone] = useState(contact.phone || '');
  const [companyName, setCompanyName] = useState(contact.companyName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/crm/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          contactId: contact.id,
          firstName: firstName.trim(),
          lastName: lastName.trim() || null,
          email: email.trim() || null,
          phone: phone.trim() || null,
          companyName: companyName.trim() || null,
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
    <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-6">
      {errorMessage && (
        <div
          role="alert"
          className="rounded-lg border border-status-error/40 bg-status-error/10 p-3 text-xs text-status-error"
        >
          {errorMessage}
        </div>
      )}

      {saveSuccess && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-300 font-medium"
        >
          <Check size={16} className="text-emerald-600" />
          <span>¡Contacto actualizado con éxito!</span>
        </div>
      )}

      {/* Sección 1: Identidad Personal */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 border-b border-border-subtle pb-1.5">
          <User size={14} className="text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Identidad del Cliente
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="drawer-firstname" className="text-xs font-medium text-text-main">
              Nombre <span className="text-status-error">*</span>
            </label>
            <Input
              id="drawer-firstname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              size="sm"
              placeholder="Ej. Camilo"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="drawer-lastname" className="text-xs font-medium text-text-main">
              Apellidos
            </label>
            <Input
              id="drawer-lastname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              size="sm"
              placeholder="Ej. Vega"
            />
          </div>
        </div>
      </section>

      {/* Sección 2: Canales de Contacto */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 border-b border-border-subtle pb-1.5">
          <Mail size={14} className="text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Canales de Comunicación
          </h3>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="drawer-email" className="text-xs font-medium text-text-main">
              Correo Electrónico
            </label>
            <Input
              id="drawer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="sm"
              startIcon={<Mail size={14} className="text-text-muted" />}
              placeholder="nombre@empresa.com"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="drawer-phone" className="text-xs font-medium text-text-main">
              Teléfono Directo
            </label>
            <Input
              id="drawer-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              size="sm"
              startIcon={<Phone size={14} className="text-text-muted" />}
              placeholder="+34 600 000 000"
            />
          </div>
        </div>
      </section>

      {/* Sección 3: Empresa y Cuenta */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 border-b border-border-subtle pb-1.5">
          <Building2 size={14} className="text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Empresa & Cuenta
          </h3>
        </div>

        <div className="space-y-1">
          <label htmlFor="drawer-company" className="text-xs font-medium text-text-main">
            Empresa / Razón Social
          </label>
          <Input
            id="drawer-company"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            size="sm"
            startIcon={<Building2 size={14} className="text-text-muted" />}
            placeholder="Ej. BBVA, Acme Corp..."
          />
        </div>
      </section>

      {/* Sección 4: Verificación & Seguridad */}
      <section className="space-y-2 rounded-xl border border-border-subtle bg-surface/40 p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-text-muted">Estado de Verificación</span>
          {contact.identityStatus === 'verified' ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <ShieldCheck size={13} className="text-emerald-600" />
              <span>Verificado</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              <Clock size={13} className="text-amber-600" />
              <span>Revisión pendiente</span>
            </span>
          )}
        </div>
        <p className="text-[11px] text-text-muted leading-relaxed">
          Los datos fiscales y bancarios vinculados a este registro quedan bloqueados ante modificaciones no autorizadas conforme al protocolo de cumplimiento.
        </p>
      </section>

      {/* Spacer */}
      <div className="flex-1 min-h-4" />

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border-subtle">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onClose}
          disabled={isSaving}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={isSaving}
        >
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
}
