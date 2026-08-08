'use client';

import React, { useState, useEffect } from 'react';
import { 
  TechnicalSurface, 
  LpdText, 
  Heading, 
  Icon, 
  Button, 
  IconButton,
  StatusPulse,
  Input
} from '@loopdev/ui';
import { Lead } from '../context';

interface QuotationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leadData: Omit<Lead, 'id' | 'aiScore' | 'aiInsights' | 'history'>) => void;
}

export function QuotationForm({ isOpen, onClose, onSubmit }: QuotationFormProps) {
  // Form states
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dealValue, setDealValue] = useState(100000);
  const [notes, setNotes] = useState('');
  
  // Validation / scan state simulating a high-tech terminal validation
  const [validationStates, setValidationStates] = useState<Record<string, 'idle' | 'scanning' | 'valid' | 'invalid'>>({
    name: 'idle',
    company: 'idle',
    email: 'idle',
    phone: 'idle',
    dealValue: 'idle'
  });

  const [activeSmartDefault, setActiveSmartDefault] = useState<'none' | 'sanitas' | 'adeslas'>('none');

  // Trigger field scan animation on change
  const triggerScan = (field: string, value: string, validator: (v: string) => boolean) => {
    if (!value) {
      setValidationStates(prev => ({ ...prev, [field]: 'idle' }));
      return;
    }
    
    setValidationStates(prev => ({ ...prev, [field]: 'scanning' }));
    
    const timeout = setTimeout(() => {
      const isValid = validator(value);
      setValidationStates(prev => ({ ...prev, [field]: isValid ? 'valid' : 'invalid' }));
    }, 400); // 400ms scanning delay

    return () => clearTimeout(timeout);
  };

  // Validators
  const validateName = (val: string) => val.trim().length >= 3;
  const validateCompany = (val: string) => val.trim().length >= 2;
  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const validatePhone = (val: string) => /^\+?[0-9\s-]{7,15}$/.test(val);
  const validateDealValue = (val: number) => val >= 10000;

  // Smart defaults triggered by email domain or company name typing
  useEffect(() => {
    const emailLower = email.toLowerCase();
    const companyLower = company.toLowerCase();

    queueMicrotask(() => {
    if (emailLower.includes('sanitas') || companyLower.includes('sanitas')) {
      if (activeSmartDefault !== 'sanitas') {
        setActiveSmartDefault('sanitas');
        setCompany('Sanitas');
        setDealValue(1250000);
        if (!notes) {
          setNotes('Solicitud de cotización corporativa Sanitas. Auto-detectado por dominio/firma.');
        }
      }
    } else if (emailLower.includes('adeslas') || companyLower.includes('adeslas')) {
      if (activeSmartDefault !== 'adeslas') {
        setActiveSmartDefault('adeslas');
        setCompany('Adeslas');
        setDealValue(850000);
        if (!notes) {
          setNotes('Solicitud de cotización corporativa Adeslas. Auto-detectado por dominio/firma.');
        }
      }
    } else {
      if (activeSmartDefault !== 'none' && !email && !company) {
        setActiveSmartDefault('none');
        setCompany('');
        setDealValue(100000);
        setNotes('');
      }
    }
    });
  }, [email, company, activeSmartDefault]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !email) return;

    // Direct submit
    onSubmit({
      name,
      company,
      email,
      phone,
      dealValue: Number(dealValue),
      stage: 'lead',
      status: 'active',
      assignee: 'Elena Gómez',
      labels: [],
      lastContactDate: new Date().toISOString().split('T')[0],
      notes: notes || 'Nuevo trato registrado.'
    });

    // Reset Form
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setDealValue(100000);
    setNotes('');
    setActiveSmartDefault('none');
    setValidationStates({
      name: 'idle',
      company: 'idle',
      email: 'idle',
      phone: 'idle',
      dealValue: 'idle'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-background-canvas/70 backdrop-blur-sm flex items-center justify-center p-4">
      <TechnicalSurface 
        variant="surface" 
        depth="overlay"
        className="p-6 bg-shell-surface border border-border-technical rounded-3xl shadow-2xl flex flex-col gap-5 max-w-xl w-full text-text-main font-sans animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-border-technical pb-3 select-none">
          <div className="flex flex-col gap-0.5">
            <Heading as="h3" size="sm" weight="bold" className="text-text-main uppercase tracking-wider">Registrar Nuevo Trato</Heading>
            <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">TECHNICAL_DRAFT_ENTRY</span>
          </div>
          <IconButton icon="close" size="sm" onClick={onClose} aria-label="Cerrar formulario de presupuesto" className="text-text-muted hover:text-text-main transition-colors" />
        </div>

        {/* Smart Default Status Badge */}
        {activeSmartDefault !== 'none' && (
          <div className="bg-primary/10 border border-primary/20 p-3 rounded-xl flex items-center gap-3 text-xs select-none">
            <StatusPulse variant="primary" size="sm" isAnimated />
            <div className="flex-1">
              <span className="font-mono text-primary font-bold">SMART_DEFAULT_TRIGGERED:</span>
                <span className="text-text-muted ml-1.5 font-semibold">
                Aplicando precios y cobertura por defecto para {activeSmartDefault === 'sanitas' ? 'Sanitas' : 'Adeslas'}.
              </span>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 text-xs">
          
          {/* Field: Name */}
          <div className="flex flex-col gap-1.5 relative group">
            <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider font-bold">
              <label className="text-text-muted">Nombre del Contacto</label>
              <ValidationBadge state={validationStates.name} />
            </div>
            <input 
              type="text" 
              value={name} 
              onChange={e => {
                setName(e.target.value);
                triggerScan('name', e.target.value, validateName);
              }} 
              required 
              placeholder="Ej. Carlos Mendoza"
              className={`bg-background-canvas p-2.5 rounded-xl border focus:outline-none text-text-main transition-all font-sans ${
                validationStates.name === 'valid' ? 'border-emerald-500/50 focus:border-emerald-500' :
                validationStates.name === 'invalid' ? 'border-rose-500/50 focus:border-rose-500' :
                'border-white/5 focus:border-primary/50'
              }`}
            />
          </div>

          {/* Field: Company */}
          <div className="flex flex-col gap-1.5 relative">
            <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider font-bold">
              <label className="text-text-muted">Compañía / Empresa</label>
              <ValidationBadge state={validationStates.company} />
            </div>
            <input 
              type="text" 
              value={company} 
              onChange={e => {
                setCompany(e.target.value);
                triggerScan('company', e.target.value, validateCompany);
              }} 
              required 
              placeholder="Ej. Sanitas"
              className={`bg-background-canvas p-2.5 rounded-xl border focus:outline-none text-text-main transition-all font-sans ${
                validationStates.company === 'valid' ? 'border-emerald-500/50 focus:border-emerald-500' :
                validationStates.company === 'invalid' ? 'border-rose-500/50 focus:border-rose-500' :
                'border-white/5 focus:border-primary/50'
              }`}
            />
          </div>

          {/* Field: Email */}
          <div className="flex flex-col gap-1.5 relative col-span-2 md:col-span-1">
            <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider font-bold">
              <label className="text-text-muted">Email Corporativo</label>
              <ValidationBadge state={validationStates.email} />
            </div>
            <input 
              type="email" 
              value={email} 
              onChange={e => {
                setEmail(e.target.value);
                triggerScan('email', e.target.value, validateEmail);
              }} 
              required 
              placeholder="Ej. c.mendoza@empresa.com"
              className={`bg-background-canvas p-2.5 rounded-xl border focus:outline-none text-text-main transition-all font-sans ${
                validationStates.email === 'valid' ? 'border-emerald-500/50 focus:border-emerald-500' :
                validationStates.email === 'invalid' ? 'border-rose-500/50 focus:border-rose-500' :
                'border-white/5 focus:border-primary/50'
              }`}
            />
          </div>

          {/* Field: Phone */}
          <div className="flex flex-col gap-1.5 relative col-span-2 md:col-span-1">
            <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider font-bold">
              <label className="text-text-muted">Teléfono Movil</label>
              <ValidationBadge state={validationStates.phone} />
            </div>
            <input 
              type="text" 
              value={phone} 
              onChange={e => {
                setPhone(e.target.value);
                triggerScan('phone', e.target.value, validatePhone);
              }} 
              placeholder="Ej. +57 312 456 7890"
              className={`bg-background-canvas p-2.5 rounded-xl border focus:outline-none text-text-main transition-all font-sans ${
                validationStates.phone === 'valid' ? 'border-emerald-500/50 focus:border-emerald-500' :
                validationStates.phone === 'invalid' ? 'border-rose-500/50 focus:border-rose-500' :
                'border-white/5 focus:border-primary/50'
              }`}
            />
          </div>

          {/* Field: Deal Value */}
          <div className="flex flex-col gap-1.5 col-span-2">
            <div className="flex justify-between items-center text-[10px] uppercase font-mono tracking-wider font-bold">
              <label className="text-text-muted">Valor Estimado del Trato (COP)</label>
              <ValidationBadge state={validationStates.dealValue} />
            </div>
            <input 
              type="number" 
              value={dealValue} 
              onChange={e => {
                const val = Number(e.target.value);
                setDealValue(val);
                triggerScan('dealValue', val.toString(), () => validateDealValue(val));
              }} 
              className={`bg-background-canvas p-2.5 rounded-xl border focus:outline-none text-text-main transition-all font-mono ${
                validationStates.dealValue === 'valid' ? 'border-emerald-500/50 focus:border-emerald-500' :
                validationStates.dealValue === 'invalid' ? 'border-rose-500/50 focus:border-rose-500' :
                'border-white/5 focus:border-primary/50'
              }`}
            />
          </div>

          {/* Field: Notes */}
          <div className="flex flex-col gap-1.5 col-span-2">
            <label className="text-text-muted text-[10px] uppercase font-mono tracking-wider font-bold">Notas Iniciales (Borrador)</label>
            <textarea 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              rows={2}
              placeholder="Notas de auditoría del primer contacto, requerimientos específicos del cliente..."
              className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5 focus:border-primary/50 focus:outline-none text-slate-200 resize-none font-sans" 
            />
          </div>

          {/* Submit Actions */}
          <div className="col-span-2 flex justify-end gap-3 mt-3 border-t border-white/5 pt-4 select-none">
            <Button 
              variant="outline" 
              size="sm" 
              type="button" 
              onClick={onClose} 
              className="border-border-technical hover:bg-background-subtle text-text-muted font-bold"
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              type="submit" 
              disabled={
                validationStates.name === 'invalid' || 
                validationStates.company === 'invalid' || 
                validationStates.email === 'invalid' || 
                validationStates.phone === 'invalid'
              }
              className="bg-primary hover:bg-primary/95 text-white font-bold"
            >
              Registrar Trato
            </Button>
          </div>

        </form>
      </TechnicalSurface>
    </div>
  );
}

// Sub-component: Validation badge inside text input label
function ValidationBadge({ state }: { state: 'idle' | 'scanning' | 'valid' | 'invalid' }) {
  if (state === 'idle') return null;

  if (state === 'scanning') {
    return (
      <span className="text-[8px] font-bold text-text-muted flex items-center gap-1 animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-ping" />
        VALIDANDO...
      </span>
    );
  }

  if (state === 'valid') {
    return (
      <span className="text-[8px] font-bold text-status-success flex items-center gap-1">
        <Icon name="check" size="sm" className="scale-75 text-status-success font-bold" />
        VAL_OK
      </span>
    );
  }

  return (
    <span className="text-[8px] font-bold text-status-error flex items-center gap-1">
      <Icon name="close" size="sm" className="scale-75 text-status-error font-bold" />
      FORMAT_ERR
    </span>
  );
}
