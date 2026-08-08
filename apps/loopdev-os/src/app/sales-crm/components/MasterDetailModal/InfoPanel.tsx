'use client';

import React, { useState } from 'react';
import { 
  TechnicalCard, 
  LpdText, 
  Icon,
  IconButton,
  Button, 
  Input, 
  Select,
  Divider,
  Label,
  ICON_REGISTRY
} from '@loopdev/ui';
import { useLeadDetail } from '../../context/LeadDetailContext';
import { useSalesCrm } from '../../context';

export function InfoPanel() {
  const { 
    lead, 
    editedLead, 
    isEditing, 
    handleEditChange,
    setActiveDetailCard
  } = useLeadDetail();

  const { triggerAiBudget, isGeneratingBudget } = useSalesCrm();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  // Helper for names
  const spaceIdx = editedLead.name.indexOf(' ');
  const firstName = spaceIdx !== -1 ? editedLead.name.substring(0, spaceIdx) : editedLead.name;
  const lastName = spaceIdx !== -1 ? editedLead.name.substring(spaceIdx + 1) : '';

  // SLA / Deal Health calculations
  const calculateHealth = () => {
    const lastWhatsAppLog = lead.activityLog?.find(entry => 
      entry.action === 'Conversación de WhatsApp registrada' || entry.action === 'Conversación de WhatsApp iniciada'
    );
    if (!lastWhatsAppLog) {
      return { 
        status: 'Desatendido',
        color: 'text-status-error border-status-error/20 bg-status-error/5',
        desc: 'No se registran interacciones previas.' 
      };
    }
    const diffTime = Math.abs(new Date().getTime() - new Date(lastWhatsAppLog.timestamp).getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      return { 
        status: 'Al Día',
        color: 'text-status-success border-status-success/20 bg-status-success/5',
        desc: 'Contacto registrado en las últimas 24 horas.' 
      };
    } else if (diffDays <= 3) {
      return { 
        status: 'En Riesgo',
        color: 'text-status-warning border-status-warning/20 bg-status-warning/5',
        desc: `Último contacto hace ${diffDays} días.` 
      };
    } else {
      return { 
        status: 'Desatendido',
        color: 'text-status-error border-status-error/20 bg-status-error/5 animate-pulse',
        desc: `Inactividad crítica por más de ${diffDays} días.` 
      };
    }
  };

  const health = calculateHealth();

  // Find next pending task
  const nextTask = lead.tasks?.filter(t => t.status === 'Pending')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  return (
    <div className="flex flex-col gap-5 w-full">
      
      {/* 1. Client Contact Card */}
      <TechnicalCard 
        variant={isEditing ? 'flat' : 'interactive'} 
        onClick={() => !isEditing && setActiveDetailCard('contact')} 
        className="p-4 flex flex-col gap-3 font-sans"
      >
        <div className="flex justify-between items-center select-none">
          <LpdText size="nano" weight="black" variant="mono" className="text-text-muted dark:text-slate-400 uppercase tracking-widest">
            DATOS DE CONTACTO
          </LpdText>
          <Icon name={ICON_REGISTRY.navigation.user} size="sm" className="text-text-muted" />
        </div>
        <Divider />

        {isEditing ? (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <Input 
                name="firstName" 
                label="Nombre"
                value={firstName} 
                onChange={handleEditChange}
                size="sm"
              />
              <Input 
                name="lastName" 
                label="Apellido"
                value={lastName} 
                onChange={handleEditChange}
                size="sm"
              />
            </div>
            <Input 
              name="company" 
              label="Compañía / Organización"
              value={editedLead.company} 
              onChange={handleEditChange}
              size="sm"
            />
            <Input 
              name="email" 
              label="Correo Electrónico"
              type="email"
              value={editedLead.email} 
              onChange={handleEditChange}
              size="sm"
            />
            <Input 
              name="phone" 
              label="Teléfono / Celular"
              value={editedLead.phone} 
              onChange={handleEditChange}
              size="sm"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3 text-xs">
            <div className="flex justify-between items-center group">
              <div className="flex flex-col gap-0.5">
                <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Nombre Completo</Label>
                <LpdText size="xs" weight="semibold" className="text-text-main dark:text-white">{lead.name}</LpdText>
              </div>
              <IconButton
                icon={copiedField === 'name' ? ICON_REGISTRY.status.success : ICON_REGISTRY.actions.copy}
                size="sm"
                aria-label="Copiar nombre"
                onClick={() => copyToClipboard(lead.name, 'name')}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-text-main p-1 rounded hover:bg-background-subtle"
              />
            </div>

            <div className="flex justify-between items-center group">
              <div className="flex flex-col gap-0.5">
                <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Compañía / Organización</Label>
                <LpdText size="xs" weight="semibold" className="text-text-main dark:text-white">{lead.company}</LpdText>
              </div>
              <IconButton
                icon={copiedField === 'company' ? ICON_REGISTRY.status.success : ICON_REGISTRY.actions.copy}
                size="sm"
                aria-label="Copiar compañía"
                onClick={() => copyToClipboard(lead.company, 'company')}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-text-main p-1 rounded hover:bg-background-subtle"
              />
            </div>

            <div className="flex justify-between items-center group">
              <div className="flex flex-col gap-0.5">
                <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Correo Electrónico</Label>
                <a href={`mailto:${lead.email}`} className="text-primary hover:underline font-semibold font-mono truncate max-w-[200px]">
                  <LpdText size="xs" weight="semibold" variant="mono">{lead.email}</LpdText>
                </a>
              </div>
              <IconButton
                icon={copiedField === 'email' ? ICON_REGISTRY.status.success : ICON_REGISTRY.actions.copy}
                size="sm"
                aria-label="Copiar correo"
                onClick={() => copyToClipboard(lead.email, 'email')}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-text-main p-1 rounded hover:bg-background-subtle"
              />
            </div>

            <div className="flex justify-between items-center group">
              <div className="flex flex-col gap-0.5">
                <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Teléfono / WhatsApp</Label>
                <a href={`tel:${lead.phone}`} className="text-text-main hover:text-primary font-semibold font-mono">
                  <LpdText size="xs" weight="semibold" variant="mono">{lead.phone}</LpdText>
                </a>
              </div>
              <IconButton
                icon={copiedField === 'phone' ? ICON_REGISTRY.status.success : ICON_REGISTRY.actions.copy}
                size="sm"
                aria-label="Copiar teléfono"
                onClick={() => copyToClipboard(lead.phone, 'phone')}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-text-main p-1 rounded hover:bg-background-subtle"
              />
            </div>
          </div>
        )}
      </TechnicalCard>

      {/* 2. Deal Value & Forecast Card */}
      <TechnicalCard 
        variant={isEditing ? 'flat' : 'interactive'} 
        onClick={() => !isEditing && setActiveDetailCard('value')} 
        className="p-4 flex flex-col gap-3 font-sans"
      >
        <div className="flex justify-between items-center select-none">
          <LpdText size="nano" weight="black" variant="mono" className="text-text-muted dark:text-slate-400 uppercase tracking-widest">
            PRONÓSTICO Y NEGOCIO
          </LpdText>
          <Icon name="payments" size="sm" className="text-text-muted" />
        </div>
        <Divider />

        {isEditing ? (
          <div className="flex flex-col gap-3">
            <Input 
              name="dealValue" 
              label="Valor del Trato (COP)"
              type="number"
              value={editedLead.dealValue} 
              onChange={handleEditChange}
              size="sm"
            />
            <Input 
              name="expectedCloseDate" 
              label="Fecha Esperada de Cierre"
              type="date"
              value={editedLead.expectedCloseDate || ''} 
              onChange={handleEditChange}
              size="sm"
              className="font-mono text-[11px]"
            />
            <div className="flex flex-col gap-1.5 w-full">
              <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">
                Probabilidad de Cierre ({editedLead.winProbability || 50}%)
              </Label>
              <input 
                name="winProbability"
                type="range"
                min="0"
                max="100"
                value={editedLead.winProbability || 50}
                onChange={handleEditChange}
                className="w-full h-1.5 bg-background-subtle rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            <Select 
              name="assignee" 
              label="Asesor Comercial"
              value={editedLead.assignee} 
              onChange={handleEditChange}
              size="sm"
            >
              <option value="Elena Gómez">Elena Gómez</option>
              <option value="Carlos Ruiz">Carlos Ruiz</option>
              <option value="Santiago Mesa">Santiago Mesa</option>
            </Select>
          </div>
        ) : (
          <div className="flex flex-col gap-3 text-xs">
            <div className="flex justify-between items-center">
              <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Valor Estimado</Label>
              <LpdText size="xs" weight="bold" variant="mono" className="text-text-main dark:text-white">
                ${lead.dealValue.toLocaleString('es-CO')} COP
              </LpdText>
            </div>

            <div className="flex justify-between items-center">
              <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Fecha Estimada de Cierre</Label>
              <LpdText size="xs" weight="semibold" variant="mono" className="text-slate-700 dark:text-slate-300">
                {lead.expectedCloseDate ? new Date(lead.expectedCloseDate).toLocaleDateString() : 'Sin definir'}
              </LpdText>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[10px]">
                <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Probabilidad de Éxito</Label>
                <LpdText size="xs" weight="bold" variant="mono" className="text-primary">{lead.winProbability || 50}%</LpdText>
              </div>
              <div className="w-full bg-background-subtle rounded-full h-2 overflow-hidden border border-border-technical">
                <div 
                  className="bg-primary h-full transition-all duration-500 rounded-full" 
                  style={{ width: `${lead.winProbability || 50}%` }}
                />
              </div>
            </div>

            <Divider />

            <div className="flex justify-between items-center pt-1">
              <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Asesor a Cargo</Label>
              <LpdText size="xs" weight="semibold" className="text-slate-700 dark:text-slate-300">{lead.assignee}</LpdText>
            </div>
          </div>
        )}
      </TechnicalCard>

      {/* 3. Lead Source & Attribution Card */}
      <TechnicalCard 
        variant={isEditing ? 'flat' : 'interactive'} 
        onClick={() => !isEditing && setActiveDetailCard('source')} 
        className="p-4 flex flex-col gap-3 font-sans"
      >
        <div className="flex justify-between items-center select-none">
          <LpdText size="nano" weight="black" variant="mono" className="text-text-muted dark:text-slate-400 uppercase tracking-widest">
            CANAL DE ORIGEN (B2C)
          </LpdText>
          <Icon name="campaign" size="sm" className="text-text-muted" />
        </div>
        <Divider />

        {isEditing ? (
          <div className="flex flex-col gap-3">
            <Select 
              name="leadSourceType" 
              label="Canal / Fuente Principal"
              value={editedLead.leadSourceType || 'organic'} 
              onChange={handleEditChange}
              size="sm"
            >
              <option value="facebook_ads">Facebook Ads</option>
              <option value="google_ads">Google Ads</option>
              <option value="landing_page">Landing Page Directa</option>
              <option value="partner_referral">Recomendado por Partner</option>
              <option value="client_referral">Recomendado por Cliente</option>
              <option value="organic">Búsqueda Orgánica / RRSS</option>
            </Select>

            {(editedLead.leadSourceType === 'partner_referral' || editedLead.leadSourceType === 'client_referral') ? (
              <Input 
                name="leadSourceReferrer" 
                label="Nombre del Referidor / Contacto"
                value={editedLead.leadSourceReferrer || ''} 
                onChange={handleEditChange}
                placeholder="Ej. Juan Pérez (Cliente VIP)"
                size="sm"
              />
            ) : (
              <Input 
                name="leadSourceCampaign" 
                label="Nombre de la Campaña de Marketing"
                value={editedLead.leadSourceCampaign || ''} 
                onChange={handleEditChange}
                placeholder="Ej. Seguros Inbound Julio 2026"
                size="sm"
              />
            )}

            {/* Collapsible UTM details in edit mode */}
            <details className="text-xs group border border-slate-200/60 dark:border-white/5 rounded-xl p-2 bg-slate-50/50 dark:bg-slate-900/10">
              <summary className="font-mono font-bold text-[9px] text-text-muted cursor-pointer select-none">
                VER PARÁMETROS UTM DE ATRIBUCIÓN
              </summary>
              <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-200/50 dark:border-white/5">
                <Input 
                  name="utmSource" 
                  label="UTM Source"
                  value={editedLead.utmSource || ''} 
                  onChange={handleEditChange}
                  size="sm"
                  className="font-mono"
                />
                <Input 
                  name="utmMedium" 
                  label="UTM Medium"
                  value={editedLead.utmMedium || ''} 
                  onChange={handleEditChange}
                  size="sm"
                  className="font-mono"
                />
                <Input 
                  name="utmCampaign" 
                  label="UTM Campaign"
                  value={editedLead.utmCampaign || ''} 
                  onChange={handleEditChange}
                  size="sm"
                  className="font-mono"
                />
              </div>
            </details>
          </div>
        ) : (
          <div className="flex flex-col gap-3 text-xs">
            <div className="flex justify-between items-center">
              <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Fuente Principal</Label>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-750 dark:text-slate-350 border border-slate-200 dark:border-white/5">
                {lead.leadSourceType === 'facebook_ads' && 'Facebook Ads'}
                {lead.leadSourceType === 'google_ads' && 'Google Ads'}
                {lead.leadSourceType === 'landing_page' && 'Landing Page Directa'}
                {lead.leadSourceType === 'partner_referral' && 'Referido por Partner'}
                {lead.leadSourceType === 'client_referral' && 'Referido por Cliente'}
                {lead.leadSourceType === 'organic' && 'Búsqueda Orgánica'}
                {!lead.leadSourceType && 'Inbound Desconocido'}
              </span>
            </div>

            {lead.leadSourceReferrer && (
              <div className="flex justify-between items-center">
                <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Referido por</Label>
                <LpdText size="xs" weight="semibold" className="text-slate-700 dark:text-slate-300">{lead.leadSourceReferrer}</LpdText>
              </div>
            )}

            {lead.leadSourceCampaign && (
              <div className="flex justify-between items-center">
                <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Campaña Activa</Label>
                <LpdText size="xs" weight="semibold" className="text-slate-700 dark:text-slate-300">{lead.leadSourceCampaign}</LpdText>
              </div>
            )}

            {/* UTM Parameters card */}
            {(lead.utmSource || lead.utmMedium || lead.utmCampaign) && (
              <div className="mt-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-white/5 flex flex-col gap-1.5 text-[9px] font-mono text-slate-450 dark:text-slate-500 select-none">
                <LpdText size="nano" weight="black" variant="mono" className="border-b border-slate-200 dark:border-white/5 pb-1 mb-1">
                  METADATOS UTM DE ATRIBUCIÓN
                </LpdText>
                {lead.utmSource && (
                  <div>
                    utm_source: <LpdText size="nano" weight="bold" variant="mono" as="span" className="text-slate-750 dark:text-slate-350">{lead.utmSource}</LpdText>
                  </div>
                )}
                {lead.utmMedium && (
                  <div>
                    utm_medium: <LpdText size="nano" weight="bold" variant="mono" as="span" className="text-slate-750 dark:text-slate-350">{lead.utmMedium}</LpdText>
                  </div>
                )}
                {lead.utmCampaign && (
                  <div>
                    utm_campaign: <LpdText size="nano" weight="bold" variant="mono" as="span" className="text-slate-750 dark:text-slate-350">{lead.utmCampaign}</LpdText>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </TechnicalCard>

      {/* 4. Deal Health & SLA Status Card */}
      <TechnicalCard variant="flat" className="p-4 flex flex-col gap-3 font-sans select-none">
        <div className="flex justify-between items-center select-none">
          <LpdText size="nano" weight="black" variant="mono" className="text-text-muted dark:text-slate-400 uppercase tracking-widest">
            SALUD DEL TRATO (SLA)
          </LpdText>
          <Icon name="health_and_safety" size="sm" className="text-text-muted" />
        </div>
        <Divider />

        <div className="flex flex-col gap-2.5 text-xs">
          <div className="flex justify-between items-center">
            <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Nivel de Salud</Label>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${health.color}`}>
              {health.status}
            </span>
          </div>
          <LpdText size="xs" className="text-text-muted leading-relaxed">
            {health.desc}
          </LpdText>

          <Divider />

          <div className="flex flex-col gap-1.5">
            <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Próxima Tarea Programada</Label>
            {nextTask ? (
              <div className="flex items-center gap-1.5 text-text-main font-medium font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <LpdText size="xs" weight="medium" className="truncate max-w-[200px]">{nextTask.title}</LpdText>
                <LpdText size="nano" variant="mono" className="text-text-muted">
                  ({new Date(nextTask.dueDate).toLocaleDateString()})
                </LpdText>
              </div>
            ) : (
              <LpdText size="xs" className="text-text-muted italic">Sin tareas pendientes agendadas.</LpdText>
            )}
          </div>
        </div>
      </TechnicalCard>

      {/* 5. Product Plan Card */}
      <TechnicalCard 
        variant={isEditing ? 'flat' : 'interactive'} 
        onClick={() => !isEditing && setActiveDetailCard('product')} 
        className="p-4 flex flex-col gap-3 font-sans"
      >
        <div className="flex justify-between items-center select-none">
          <LpdText size="nano" weight="black" variant="mono" className="text-text-muted dark:text-slate-400 uppercase tracking-widest">
            PLAN DE INTERÉS Y NOTAS
          </LpdText>
          <Icon name="verified" size="sm" className="text-text-muted" />
        </div>
        <Divider />

        {isEditing ? (
          <div className="flex flex-col gap-3">
            <Select 
              name="interestedPlan" 
              label="Plan de Seguros Solicitado"
              value={editedLead.interestedPlan || 'Plan Básico Familiar'} 
              onChange={handleEditChange}
              size="sm"
            >
              <option value="Plan Básico Familiar">Plan Básico Familiar</option>
              <option value="Plan Familiar Completo">Plan Familiar Completo</option>
              <option value="Plan Vital Senior">Plan Vital Senior</option>
              <option value="Plan Módulo Global VIP">Plan Módulo Global VIP</option>
            </Select>

            <div className="flex flex-col gap-1.5 w-full">
              <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Notas de Venta</Label>
              <textarea 
                name="notes"
                value={editedLead.notes}
                onChange={handleEditChange}
                placeholder="Detalles sobre las necesidades de cobertura del cliente..."
                rows={3}
                className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 focus:outline-none resize-none font-sans text-xs"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 text-xs">
            <div className="flex justify-between items-center">
              <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Plan Interesado</Label>
              <LpdText size="xs" weight="bold" className="text-text-main dark:text-white">
                {lead.interestedPlan || 'Sin definir'}
              </LpdText>
            </div>

            <Divider />

            <div className="flex flex-col gap-1">
              <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Notas Comerciales</Label>
              <LpdText size="xs" className="text-text-main leading-relaxed whitespace-pre-wrap">
                {lead.notes || 'Sin anotaciones registradas.'}
              </LpdText>
            </div>
          </div>
        )}
      </TechnicalCard>

      {/* 6. AI Tools & Insights Card */}
      <TechnicalCard variant="flat" className="p-4 flex flex-col gap-3 font-sans">
        <div className="flex justify-between items-center select-none">
          <LpdText size="nano" weight="black" variant="mono" className="text-text-muted dark:text-slate-400 uppercase tracking-widest">
            INSIGHTS INTELIGENTES DE IA
          </LpdText>
          <Icon name="psychology" size="sm" className="text-primary" />
        </div>
        <Divider />

        <div className="flex flex-col gap-3.5 text-xs">
          {/* AI Score Indicator */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12 flex-shrink-0 select-none">
              <svg className="w-full h-full transform -rotate-95" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-900"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary"
                  strokeWidth="3.5"
                  strokeDasharray={`${lead.aiScore || 70}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-mono text-[10px] font-black text-text-main">
                {lead.aiScore || 70}%
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Conversión Estimada</Label>
              <LpdText size="xs" className="text-text-muted leading-relaxed text-[10px]">
                Basado en perfil B2C, latencia y respuesta en WhatsApp.
              </LpdText>
            </div>
          </div>

          <Divider />

          <div className="flex flex-col gap-1.5">
            <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Recomendaciones de IA</Label>
            <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-2">
              <Icon name={ICON_REGISTRY.status.bolt} size="sm" className="text-primary mt-0.5 shrink-0" />
              <LpdText size="xs" className="text-text-main leading-relaxed">
                {lead.aiInsights || 'Analizando comportamiento del lead para generar recomendaciones de cierre...'}
              </LpdText>
            </div>
          </div>
        </div>
      </TechnicalCard>

      {/* 7. Quotes simulator Card */}
      <TechnicalCard variant="flat" className="p-4 flex flex-col gap-3 font-sans">
        <div className="flex justify-between items-center select-none">
          <LpdText size="nano" weight="black" variant="mono" className="text-text-muted dark:text-slate-400 uppercase tracking-widest">
            SIMULACIÓN DE COTIZACIONES
          </LpdText>
          <Icon name="feed" size="sm" className="text-text-muted" />
        </div>
        <Divider />

        <div className="flex flex-col gap-3 text-xs">
          <div className="flex justify-between items-center select-none">
            <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Presupuestos Generados</Label>
            <LpdText size="xs" weight="bold" variant="mono" className="text-text-main dark:text-white">
              {lead.relatedQuotesCount || 0} cotización(es)
            </LpdText>
          </div>

          {lead.hasGeneratedPdf ? (
            <div className="p-3 bg-status-success/5 border border-status-success/10 rounded-xl flex items-center justify-between select-none">
              <div className="flex items-center gap-2 text-status-success">
                <Icon name={ICON_REGISTRY.status.success} size="sm" className="text-status-success" />
                <LpdText size="nano" weight="bold" className="uppercase">COTIZACIÓN ACTIVA LISTA</LpdText>
              </div>
              <LpdText size="nano" variant="mono" className="text-slate-500 dark:text-slate-400">Enviado por Email</LpdText>
            </div>
          ) : (
            <div className="p-3 bg-status-warning/5 border border-status-warning/10 rounded-xl flex items-center gap-2 select-none">
              <Icon name={ICON_REGISTRY.status.error} size="sm" className="text-status-error" />
              <LpdText size="nano" className="text-slate-700 dark:text-slate-350">No se han emitido presupuestos de seguros para este lead.</LpdText>
            </div>
          )}

          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => triggerAiBudget(lead.id)}
            disabled={isGeneratingBudget}
            className="w-full flex items-center justify-center gap-1.5"
          >
            <Icon name={ICON_REGISTRY.status.ai} size="sm" />
            <span>{isGeneratingBudget ? 'Generando Cotización...' : 'Generar Presupuesto con IA'}</span>
          </Button>
        </div>
      </TechnicalCard>

    </div>
  );
}
