'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Button,
  Heading,
  Input,
  PhoneInput,
  Select,
  SuiteCanvas,
  TechnicalSurface,
  ModuleHeader,
  useFeedback,
} from '@loopdev/ui';
import { User, Building2, Mail, Briefcase, ShieldCheck, ArrowLeft, UserPlus } from 'lucide-react';
import { useOrganization } from '@/hooks/useOrganization';
import { isValidPhoneNumber } from 'libphonenumber-js';
import type { CrmContact } from '@loopdev/contracts';

export default function NewContactPage() {
  const router = useRouter();
  const { activeOrganizationId } = useOrganization();
  const feedback = useFeedback();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [lifecycleStage, setLifecycleStage] = useState('lead');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!activeOrganizationId) {
      setErrorMessage('No hay una organización activa seleccionada.');
      return;
    }

    if (!firstName.trim()) {
      setErrorMessage('El nombre del contacto es obligatorio.');
      return;
    }

    if (!email.trim() && !phone.trim()) {
      setErrorMessage('Debes indicar al menos un canal de contacto (correo o teléfono).');
      return;
    }

    if (phone.trim() && !isValidPhoneNumber(phone)) {
      setErrorMessage('El número de teléfono no es válido.');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('/api/crm/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: activeOrganizationId,
          firstName: firstName.trim(),
          lastName: lastName.trim() || null,
          email: email.trim() || null,
          phone: phone.trim() || null,
          companyName: companyName.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'No se pudo crear el contacto.');
      }

      const newContact = (await response.json()) as CrmContact;
      feedback.success('Contacto creado exitosamente.');
      router.push(`/sales-crm/contacts/${newContact.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido al crear contacto.';
      setErrorMessage(msg);
      feedback.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SuiteCanvas
      mode="workspace"
      header={
        <ModuleHeader
          segments={[
            { id: 'contacts', label: 'Contactos', href: '/sales-crm/contacts' },
            { id: 'new', label: 'Nuevo Contacto' },
          ]}
          leftSlot={
            <div className="flex items-center gap-3">
              <Link
                href="/sales-crm/contacts"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-subtle bg-surface-light dark:bg-surface-dark text-text-muted hover:text-text-main transition-colors shadow-xs"
                title="Volver a contactos"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <Heading as="h1" size="lg" weight="bold" className="text-text-main">
                  Crear Nuevo Contacto
                </Heading>
                <p className="text-xs text-text-muted hidden sm:block">
                  Registra la ficha técnica y canales de un prospecto o cliente en el CRM
                </p>
              </div>
            </div>
          }
          rightSlot={
            <div className="flex items-center gap-2.5">
              <Link
                href="/sales-crm/contacts"
                className="inline-flex items-center justify-center rounded-xl border border-border-subtle bg-surface-light dark:bg-surface-dark px-3.5 py-2 text-xs font-medium text-text-main shadow-xs hover:bg-surface-muted/60 transition-all"
              >
                Cancelar
              </Link>
              <Button
                type="submit"
                form="create-contact-page-form"
                variant="primary"
                size="sm"
                disabled={isSaving}
                className="shadow-xs"
              >
                {isSaving ? 'Guardando...' : 'Crear Contacto'}
              </Button>
            </div>
          }
          ariaLabel="Cabecera crear contacto"
        />
      }
    >
      <form
        id="create-contact-page-form"
        onSubmit={handleSubmit}
        className="w-full max-w-5xl mx-auto pb-16 space-y-6"
      >
        {errorMessage && (
          <div
            role="alert"
            className="rounded-2xl border border-status-error/40 bg-status-error/10 p-4 text-sm text-status-error font-medium"
          >
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
          {/* Columna Principal Izquierda: Datos de Identidad y Canales */}
          <div className="space-y-6">
            {/* 1. Identidad */}
            <TechnicalSurface
              variant="surface"
              border="subtle"
              radius="xl"
              className="p-5 sm:p-6 space-y-5"
            >
              <div className="flex items-center gap-2.5 border-b border-border-subtle pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-text-main">Identidad del Contacto</h2>
                  <p className="text-xs text-text-muted">
                    Nombre y apellidos para identificar al registro
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-firstname"
                    className="text-xs font-semibold text-text-main"
                  >
                    Nombre <span className="text-status-error">*</span>
                  </label>
                  <Input
                    id="contact-firstname"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    size="md"
                    className="h-11 sm:h-9 text-base sm:text-sm"
                    placeholder="Ej. Martín"
                    autoFocus
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-lastname"
                    className="text-xs font-semibold text-text-main"
                  >
                    Apellidos
                  </label>
                  <Input
                    id="contact-lastname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    size="md"
                    className="h-11 sm:h-9 text-base sm:text-sm"
                    placeholder="Ej. González Ruiz"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label htmlFor="contact-jobtitle" className="text-xs font-semibold text-text-main">
                  Cargo / Puesto
                </label>
                <Input
                  id="contact-jobtitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  size="md"
                  className="h-11 sm:h-9 text-base sm:text-sm"
                  startIcon={<Briefcase size={15} className="text-text-muted" />}
                  placeholder="Ej. Director Financiero, VP Engineering..."
                />
              </div>
            </TechnicalSurface>

            {/* 2. Canales de Comunicación */}
            <TechnicalSurface
              variant="surface"
              border="subtle"
              radius="xl"
              className="p-5 sm:p-6 space-y-5"
            >
              <div className="flex items-center gap-2.5 border-b border-border-subtle pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Mail size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-text-main">Canales de Comunicación</h2>
                  <p className="text-xs text-text-muted">
                    Introduce al menos un correo o número de contacto
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-semibold text-text-main">
                    Correo Electrónico Directo
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="md"
                    className="h-11 sm:h-9 text-base sm:text-sm"
                    startIcon={<Mail size={15} className="text-text-muted" />}
                    placeholder="martin@empresa.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-phone" className="text-xs font-semibold text-text-main">
                    Teléfono Directo / Móvil
                  </label>
                  <PhoneInput
                    id="contact-phone"
                    value={phone}
                    onChange={(val) => setPhone(val ?? '')}
                    defaultCountry="ES"
                    countryPlaceholder="País"
                    countrySelectLabel="Código de país"
                    countrySearchLabel="Buscar país"
                    countrySearchPlaceholder="Buscar país o prefijo"
                    countryNoResultsLabel="Sin resultados"
                  />
                </div>
              </div>
            </TechnicalSurface>

            {/* 3. Empresa & Organización */}
            <TechnicalSurface
              variant="surface"
              border="subtle"
              radius="xl"
              className="p-5 sm:p-6 space-y-5"
            >
              <div className="flex items-center gap-2.5 border-b border-border-subtle pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Building2 size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-text-main">Empresa & Razón Social</h2>
                  <p className="text-xs text-text-muted">
                    Vincular a una cuenta comercial u organización
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-company" className="text-xs font-semibold text-text-main">
                  Nombre de la Empresa
                </label>
                <Input
                  id="contact-company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  size="md"
                  className="h-11 sm:h-9 text-base sm:text-sm"
                  startIcon={<Building2 size={15} className="text-text-muted" />}
                  placeholder="Ej. Santander, Innova Tech S.L."
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-notes" className="text-xs font-semibold text-text-main">
                  Notas iniciales de contexto
                </label>
                <textarea
                  id="contact-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-border-subtle bg-surface-light dark:bg-surface-dark px-3.5 py-2.5 text-base sm:text-sm text-text-main outline-none focus:border-primary transition-all custom-scrollbar resize-none"
                  placeholder="Añade antecedentes, origen de la reunión o detalles clave de este contacto..."
                />
              </div>
            </TechnicalSurface>
          </div>

          {/* Columna Lateral Derecha: Ciclo de Vida y Protocolo de Cumplimiento */}
          <div className="space-y-6">
            {/* Ciclo de Vida */}
            <TechnicalSurface
              variant="surface"
              border="subtle"
              radius="xl"
              className="p-5 sm:p-6 space-y-4"
            >
              <h2 className="text-sm font-semibold text-text-main">Ciclo de Vida del Contacto</h2>
              <div className="space-y-1.5">
                <label htmlFor="contact-lifecycle" className="text-xs font-medium text-text-muted">
                  Etapa Comercial
                </label>
                <Select
                  id="contact-lifecycle"
                  size="md"
                  value={lifecycleStage}
                  onChange={(e) => setLifecycleStage(e.target.value)}
                  aria-label="Etapa de ciclo de vida"
                >
                  <option value="lead">Prospecto / Lead</option>
                  <option value="qualified">Lead Cualificado</option>
                  <option value="opportunity">En Oportunidad / Negociación</option>
                  <option value="customer">Cliente Activo</option>
                  <option value="partner">Partner / Colaborador</option>
                </Select>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-muted/30 p-3 text-xs text-text-muted space-y-1 leading-relaxed">
                <span className="font-semibold text-text-main block">
                  Sincronización Automática
                </span>
                Este contacto se indexará inmediatamente en el buscador global y estará disponible
                para asociar tratos, tareas y notas.
              </div>
            </TechnicalSurface>

            {/* Protocolo de Seguridad & Verificación */}
            <TechnicalSurface
              variant="surface"
              border="subtle"
              radius="xl"
              className="p-5 sm:p-6 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-muted">Verificación Inicial</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>Conforme</span>
                </span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Los datos ingresados se auditan conforme a la normativa de protección de datos
                (RGPD) y quedarán vinculados a tu organización activa.
              </p>
            </TechnicalSurface>

            {/* Botón de acción móvil */}
            <div className="lg:hidden pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSaving}
                className="w-full h-12 text-sm font-semibold rounded-xl shadow-md"
              >
                <UserPlus size={16} className="mr-2" />
                {isSaving ? 'Guardando contacto...' : 'Crear Contacto'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </SuiteCanvas>
  );
}
