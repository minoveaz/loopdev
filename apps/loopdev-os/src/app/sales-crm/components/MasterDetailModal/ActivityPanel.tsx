'use client';

import React, { useState } from 'react';
import { 
  TechnicalCard, 
  LpdText, 
  Icon, 
  Button, 
  Input, 
  Select,
  Divider,
  Label,
  ICON_REGISTRY
} from '@loopdev/ui';
import { useLeadDetail } from '../../context/LeadDetailContext';

export function ActivityPanel() {
  const { 
    lead, 
    editedLead, 
    activeDetailCard,
    setActiveDetailCard,
    handleEditChange,
    handleSave,
    cancelEdit,
    handleDocumentUpload,
    handleDocumentDelete
  } = useLeadDetail();

  const [activeTab, setActiveTab] = useState<'timeline' | 'documents'>('timeline');
  const [uploadCategory, setUploadCategory] = useState<string>('Identificación');

  // Helper to handle mock file upload
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleDocumentUpload(file, uploadCategory);
      // Reset input value
      e.target.value = '';
    }
  };

  // Dynamic back button header for detailed forms
  const renderDetailHeader = (title: string) => (
    <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-3 mb-4 select-none">
      <button 
        type="button"
        onClick={() => {
          cancelEdit();
          setActiveDetailCard(null);
        }}
        className="flex items-center gap-1.5 text-xs text-primary hover:underline font-bold transition-all"
      >
        <Icon name="arrow_back" size="sm" />
        <span>Volver a Bitácora y Archivos</span>
      </button>
      <LpdText size="nano" weight="black" variant="mono" className="text-text-muted dark:text-slate-400 uppercase tracking-widest">
        {title}
      </LpdText>
    </div>
  );

  // 1. Detailed form: Contact Details ('contact')
  const renderContactDetails = () => (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
        setActiveDetailCard(null);
      }}
      className="flex flex-col gap-4 animate-in fade-in duration-200"
    >
      {renderDetailHeader('FICHA DE CONTACTO EXPANDIDA')}
      
      <TechnicalCard variant="flat" className="p-5 flex flex-col gap-4">
        <LpdText size="xs" weight="bold" className="text-text-main dark:text-white border-b border-slate-200 dark:border-white/5 pb-1 mb-1">
          Información Demográfica B2C
        </LpdText>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            name="dni" 
            label="Documento de Identidad (Cédula/DNI)"
            value={editedLead.dni || ''} 
            onChange={handleEditChange}
            size="sm"
          />
          <Input 
            name="birthDate" 
            label="Fecha de Nacimiento"
            type="date"
            value={editedLead.birthDate || ''} 
            onChange={handleEditChange}
            size="sm"
          />
          <Select 
            name="gender" 
            label="Género"
            value={editedLead.gender || ''} 
            onChange={handleEditChange}
            size="sm"
          >
            <option value="">Seleccione...</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro</option>
          </Select>
          <Select 
            name="maritalStatus" 
            label="Estado Civil"
            value={editedLead.maritalStatus || ''} 
            onChange={handleEditChange}
            size="sm"
          >
            <option value="">Seleccione...</option>
            <option value="Soltero">Soltero/a</option>
            <option value="Casado">Casado/a</option>
            <option value="Unión Libre">Unión Libre</option>
            <option value="Divorciado">Divorciado/a</option>
          </Select>
        </div>

        <Divider className="my-2" />
        
        <LpdText size="xs" weight="bold" className="text-text-main dark:text-white border-b border-slate-200 dark:border-white/5 pb-1 mb-1">
          Dirección Residencial
        </LpdText>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input 
              name="address" 
              label="Dirección"
              value={editedLead.address || ''} 
              onChange={handleEditChange}
              size="sm"
            />
          </div>
          <Input 
            name="city" 
            label="Ciudad"
            value={editedLead.city || ''} 
            onChange={handleEditChange}
            size="sm"
          />
          <Input 
            name="state" 
            label="Departamento / Estado"
            value={editedLead.state || ''} 
            onChange={handleEditChange}
            size="sm"
          />
          <Input 
            name="zipCode" 
            label="Código Postal"
            value={editedLead.zipCode || ''} 
            onChange={handleEditChange}
            size="sm"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-white/5 select-none">
          <Button 
            variant="outline" 
            size="sm" 
            type="button"
            onClick={() => {
              cancelEdit();
              setActiveDetailCard(null);
            }}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            type="submit"
          >
            Guardar Cambios
          </Button>
        </div>
      </TechnicalCard>
    </form>
  );

  // 2. Detailed form: Deal Forecast ('value')
  const renderValueDetails = () => (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
        setActiveDetailCard(null);
      }}
      className="flex flex-col gap-4 animate-in fade-in duration-200"
    >
      {renderDetailHeader('PLANIFICACIÓN Y FORECAST FINANCIERO')}
      
      <TechnicalCard variant="flat" className="p-5 flex flex-col gap-4">
        <LpdText size="xs" weight="bold" className="text-text-main dark:text-white border-b border-slate-200 dark:border-white/5 pb-1 mb-1">
          Desglose Financiero de Póliza
        </LpdText>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            name="annualPremium" 
            label="Prima Anual del Seguro (COP)"
            type="number"
            value={editedLead.annualPremium || 0} 
            onChange={handleEditChange}
            size="sm"
          />
          <Select 
            name="billingCycle" 
            label="Ciclo de Facturación"
            value={editedLead.billingCycle || 'Mensual'} 
            onChange={handleEditChange}
            size="sm"
          >
            <option value="Mensual">Mensual 📅</option>
            <option value="Trimestral">Trimestral 🗓️</option>
            <option value="Semestral">Semestral 🗓️</option>
            <option value="Anual">Anual 📆</option>
          </Select>
          <Select 
            name="contractType" 
            label="Modalidad de Contratación"
            value={editedLead.contractType || 'Individual'} 
            onChange={handleEditChange}
            size="sm"
          >
            <option value="Individual">Plan Individual 👤</option>
            <option value="Familiar">Plan Familiar Plus 👨‍👩‍👧‍👦</option>
            <option value="Corporativo">Plan Corporativo Colectivo 🏢</option>
          </Select>
        </div>

        <Divider className="my-2" />

        <LpdText size="xs" weight="bold" className="text-text-main dark:text-white border-b border-slate-200 dark:border-white/5 pb-1 mb-1 select-none">
          Historial de Auditoría de Forecast
        </LpdText>

        <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto custom-scrollbar text-[11px] text-slate-500 font-mono select-none">
          {lead.history?.map((h, idx) => (
            <div key={idx} className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-1">
              <span>{h.action}</span>
              <span className="text-text-muted">{h.date} - {h.actor}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-white/5 select-none">
          <Button 
            variant="outline" 
            size="sm" 
            type="button"
            onClick={() => {
              cancelEdit();
              setActiveDetailCard(null);
            }}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            type="submit"
          >
            Guardar Cambios
          </Button>
        </div>
      </TechnicalCard>
    </form>
  );

  // 3. Detailed form: Lead Acquisition Source ('source')
  const renderSourceDetails = () => (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
        setActiveDetailCard(null);
      }}
      className="flex flex-col gap-4 animate-in fade-in duration-200"
    >
      {renderDetailHeader('AUDITORÍA DE CANAL Y MARKETING B2C')}
      
      <TechnicalCard variant="flat" className="p-5 flex flex-col gap-4">
        <LpdText size="xs" weight="bold" className="text-text-main dark:text-white border-b border-slate-200 dark:border-white/5 pb-1 mb-1">
          Parámetros UTM de Campaña de Tráfico
        </LpdText>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
          <Input 
            name="utmSource" 
            label="utm_source"
            value={editedLead.utmSource || ''} 
            onChange={handleEditChange}
            size="sm"
            className="font-mono text-xs"
          />
          <Input 
            name="utmMedium" 
            label="utm_medium"
            value={editedLead.utmMedium || ''} 
            onChange={handleEditChange}
            size="sm"
            className="font-mono text-xs"
          />
          <Input 
            name="utmCampaign" 
            label="utm_campaign"
            value={editedLead.utmCampaign || ''} 
            onChange={handleEditChange}
            size="sm"
            className="font-mono text-xs"
          />
        </div>

        <Divider className="my-2" />

        <LpdText size="xs" weight="bold" className="text-text-main dark:text-white border-b border-slate-200 dark:border-white/5 pb-1 mb-1">
          Dispositivo y Navegación del Lead
        </LpdText>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            name="deviceType" 
            label="Dispositivo"
            value={editedLead.deviceType || ''} 
            onChange={handleEditChange}
            placeholder="Ej. Celular (iPhone iOS)"
            size="sm"
          />
          <Input 
            name="browser" 
            label="Navegador"
            value={editedLead.browser || ''} 
            onChange={handleEditChange}
            placeholder="Ej. Safari 19.4"
            size="sm"
          />
          <Input 
            name="simulatedIp" 
            label="Dirección IP de Registro"
            value={editedLead.simulatedIp || ''} 
            onChange={handleEditChange}
            placeholder="Ej. 186.29.102.45"
            size="sm"
            className="font-mono"
          />
          <Input 
            name="landingVisits" 
            label="Páginas Visitadas en Web"
            type="number"
            value={editedLead.landingVisits || 0} 
            onChange={handleEditChange}
            size="sm"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-white/5 select-none">
          <Button 
            variant="outline" 
            size="sm" 
            type="button"
            onClick={() => {
              cancelEdit();
              setActiveDetailCard(null);
            }}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            type="submit"
          >
            Guardar Cambios
          </Button>
        </div>
      </TechnicalCard>
    </form>
  );

  // 4. Detailed form: Medical and Plan details ('product')
  const renderProductDetails = () => {
    // Dynamic BMI Calculator
    const calculateBMI = (h?: number, w?: number) => {
      if (!h || !w) return null;
      const heightInMeters = h / 100;
      const bmi = w / (heightInMeters * heightInMeters);
      let classification = '';
      if (bmi < 18.5) classification = 'Peso Bajo 🔵';
      else if (bmi < 25) classification = 'Peso Normal ✅';
      else if (bmi < 30) classification = 'Sobrepeso ⚠️';
      else classification = 'Obesidad 🚨';
      
      return { val: bmi.toFixed(1), class: classification };
    };

    const bmi = calculateBMI(editedLead.height, editedLead.weight);

    return (
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
          setActiveDetailCard(null);
        }}
        className="flex flex-col gap-4 animate-in fade-in duration-200"
      >
        {renderDetailHeader('ESTADO DE PLAN Y DECLARACIÓN MÉDICA')}
        
        <TechnicalCard variant="flat" className="p-5 flex flex-col gap-4">
          <LpdText size="xs" weight="bold" className="text-text-main dark:text-white border-b border-slate-200 dark:border-white/5 pb-1 mb-1">
            Ficha Médica para Contratación (Medical Underwriting)
          </LpdText>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              name="height" 
              label="Estatura (cm)"
              type="number"
              value={editedLead.height || 0} 
              onChange={handleEditChange}
              size="sm"
            />
            <Input 
              name="weight" 
              label="Peso (kg)"
              type="number"
              value={editedLead.weight || 0} 
              onChange={handleEditChange}
              size="sm"
            />
            
            {bmi && (
              <div className="md:col-span-2 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-250/20 dark:border-white/5 flex items-center justify-between select-none">
                <div>
                  <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Índice de Masa Corporal (IMC) Calculado</Label>
                  <LpdText size="xs" weight="bold" variant="mono" className="text-slate-800 dark:text-slate-200 mt-0.5">
                    {bmi.val} kg/m²
                  </LpdText>
                </div>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900">
                  {bmi.class}
                </span>
              </div>
            )}

            <Select 
              name="smoker" 
              label="Consumo de Tabaco/Vapeador"
              value={editedLead.smoker || 'No'} 
              onChange={handleEditChange}
              size="sm"
            >
              <option value="No">No fuma 🚭</option>
              <option value="Sí">Sí fuma 🚬</option>
            </Select>
            <Input 
              name="preExistingConditions" 
              label="Enfermedades Preexistentes"
              value={editedLead.preExistingConditions || ''} 
              onChange={handleEditChange}
              placeholder="Ej. Hipertensión, Diabetes tipo 2"
              size="sm"
            />
            <div className="md:col-span-2">
              <Input 
                name="medicalNotes" 
                label="Observaciones Médicas / Tratamientos Activos"
                value={editedLead.medicalNotes || ''} 
                onChange={handleEditChange}
                size="sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-white/5 select-none">
            <Button 
              variant="outline" 
              size="sm" 
              type="button"
              onClick={() => {
                cancelEdit();
                setActiveDetailCard(null);
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              type="submit"
            >
              Guardar Cambios
            </Button>
          </div>
        </TechnicalCard>
      </form>
    );
  };

  // Render the specific active form
  if (activeDetailCard) {
    if (activeDetailCard === 'contact') return renderContactDetails();
    if (activeDetailCard === 'value') return renderValueDetails();
    if (activeDetailCard === 'source') return renderSourceDetails();
    if (activeDetailCard === 'product') return renderProductDetails();
  }

  // DEFAULT VIEW: Activity Feed / Documents Tab
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Dynamic Tab Bar */}
      <div className="flex border-b border-slate-200 dark:border-white/5 pb-0.5 mb-2 select-none">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-1.5 px-4 py-2 border-b-2 text-xs font-bold transition-all ${
            activeTab === 'timeline'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Icon name="feed" size="sm" />
          <span>⚡ Bitácora de Actividad</span>
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-1.5 px-4 py-2 border-b-2 text-xs font-bold transition-all ${
            activeTab === 'documents'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          <Icon name="upload" size="sm" />
          <span>📁 Documentos e Historial ({lead.documents?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Timeline Feed */}
      {activeTab === 'timeline' && (
        <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1 animate-in fade-in duration-200">
          {lead.activityLog && lead.activityLog.length > 0 ? (
            <div className="relative pl-6 border-l-2 border-slate-200 dark:border-white/5 flex flex-col gap-5 py-2 select-none">
              {lead.activityLog.map((entry, idx) => {
                // Determine icon mapping based on activity type
                let iconName: string = ICON_REGISTRY.status.info;
                let colorClasses = 'bg-slate-100 text-slate-500 border-slate-200';
                
                if (entry.type === 'CALL') {
                  iconName = 'phone';
                  colorClasses = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                } else if (entry.type === 'NOTE') {
                  iconName = 'feed';
                  colorClasses = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
                } else if (entry.type === 'TASK_CREATED' || entry.type === 'TASK_COMPLETED') {
                  iconName = 'task';
                  colorClasses = 'bg-violet-500/10 text-violet-500 border-violet-500/20';
                } else if (entry.type === 'DOCUMENT') {
                  iconName = 'upload';
                  colorClasses = 'bg-teal-500/10 text-teal-500 border-teal-500/20';
                } else if (entry.type === 'GENERIC') {
                  if (entry.action.toLowerCase().includes('whatsapp')) {
                    iconName = 'chat';
                    colorClasses = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
                  } else if (entry.action.toLowerCase().includes('correo') || entry.action.toLowerCase().includes('email')) {
                    iconName = 'mail';
                    colorClasses = 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
                  } else {
                    iconName = ICON_REGISTRY.status.info;
                    colorClasses = 'bg-slate-100 text-slate-500 border-slate-200';
                  }
                } else if (entry.type === 'STATUS_CHANGE') {
                  iconName = 'rocket';
                  colorClasses = 'bg-rose-500/10 text-rose-500 border-rose-500/20';
                }

                return (
                  <div key={idx} className="relative flex flex-col gap-1.5 animate-in fade-in duration-300">
                    {/* Circle icon marker on the timeline line */}
                    <div className={`absolute -left-[37px] top-0.5 w-6 h-6 rounded-full border flex items-center justify-center ${colorClasses} text-[10px]`}>
                      <Icon name={iconName} size="sm" />
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1">
                        <LpdText size="nano" weight="bold" className="text-text-main dark:text-white font-sans">{entry.actor}</LpdText>
                        {entry.category && (
                          <span className="text-[8px] font-bold uppercase tracking-wide bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 px-1.5 py-0.5 rounded-full select-none">
                            {entry.category}
                          </span>
                        )}
                      </div>
                      <LpdText size="nano" variant="mono" className="text-text-muted">{new Date(entry.timestamp).toLocaleString()}</LpdText>
                    </div>

                    <TechnicalCard variant="flat" className="p-3">
                      <LpdText size="xs" className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans font-medium">
                        {entry.action}
                      </LpdText>
                      {entry.details && (
                        <LpdText size="xs" className="text-slate-500 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-200/50 dark:border-white/5 font-sans leading-relaxed whitespace-pre-wrap">
                          {entry.details}
                        </LpdText>
                      )}
                    </TechnicalCard>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 font-sans select-none">
              No hay actividades registradas en la bitácora de este lead.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Document Attachments */}
      {activeTab === 'documents' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          {/* Uploader Card */}
          <TechnicalCard variant="flat" className="p-4 flex flex-col gap-3 font-sans select-none">
            <LpdText size="xs" weight="bold" className="text-text-main dark:text-white">
              Cargar Soporte Técnico / Médico
            </LpdText>
            
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex flex-col gap-1.5 flex-1 w-full">
                <Label textSize="nano" textWeight="black" className="uppercase text-text-muted">Categoría del Archivo</Label>
                <Select 
                  value={uploadCategory} 
                  onChange={(e) => setUploadCategory(e.target.value)}
                  size="sm"
                >
                  <option value="Identificación">Cédula / Identidad 🪪</option>
                  <option value="Soporte Médico">Declaración / Historial Médico 🏥</option>
                  <option value="Financiero">Soporte de Ingresos / Bancario 💵</option>
                  <option value="Contrato Firmado">Contrato / Póliza Firmada 📄</option>
                </Select>
              </div>

              <div className="w-full sm:w-auto">
                <label className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-xl cursor-pointer shadow-md shadow-blue-500/10 active:scale-[0.98] transition-all">
                  <Icon name="upload" size="sm" />
                  <span>Subir Documento</span>
                  <input 
                    type="file" 
                    onChange={onFileChange}
                    className="hidden" 
                    accept=".pdf,.png,.jpg,.jpeg"
                  />
                </label>
              </div>
            </div>
          </TechnicalCard>

          {/* Files List */}
          <div className="flex flex-col gap-2.5">
            <LpdText size="nano" weight="black" variant="mono" className="text-text-muted dark:text-slate-400 uppercase tracking-widest select-none">
              HISTORIAL DE DOCUMENTOS DE ONBOARDING
            </LpdText>

            {lead.documents && lead.documents.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {lead.documents.map((doc) => (
                  <TechnicalCard key={doc.id} variant="flat" className="p-3.5 flex items-center justify-between font-sans">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10 select-none">
                        <Icon name="feed" size="sm" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <LpdText size="xs" weight="bold" className="text-text-main dark:text-white truncate max-w-[220px]">
                          {doc.name}
                        </LpdText>
                        <div className="flex items-center gap-2 text-[10px] text-text-muted font-mono select-none">
                          <span>{doc.category}</span>
                          <span>•</span>
                          <span>{(doc.size / (1024 * 1024)).toFixed(2)} MB</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 select-none">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                        doc.status === 'verified'
                          ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5'
                          : doc.status === 'error'
                          ? 'text-rose-500 border-rose-500/20 bg-rose-500/5'
                          : 'text-amber-500 border-amber-500/20 bg-amber-500/5'
                      }`}>
                        {doc.status === 'verified' ? 'Validado ✅' : doc.status === 'error' ? 'Rechazado 🚨' : 'Pendiente ⏳'}
                      </span>
                      
                      <button 
                        onClick={() => handleDocumentDelete(doc.id)}
                        className="text-text-muted hover:text-rose-500 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                        title="Eliminar archivo"
                      >
                        <Icon name={ICON_REGISTRY.actions.delete} size="sm" />
                      </button>
                    </div>
                  </TechnicalCard>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 font-sans border border-dashed border-slate-200 dark:border-white/10 rounded-2xl select-none">
                No hay soportes de identidad ni documentos médicos subidos para este lead.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
