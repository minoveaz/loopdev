'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TechnicalSurface, Heading, Icon, Button, IconButton, Input, Select, ICON_REGISTRY } from '@loopdev/ui';
import { LeadDetailProvider, useLeadDetail } from '../../context/LeadDetailContext';
import { Header } from './Header';
import { EmailComposer } from './EmailComposer';
import { InfoPanel } from './InfoPanel';
import { ActivityPanel } from './ActivityPanel';

interface MasterDetailModalProps {
  isOpen: boolean;
  lead: import('../../context').Lead | null;
  onClose: () => void;
}

export function MasterDetailModal({ isOpen, lead, onClose }: MasterDetailModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!isOpen || !lead) return null;
  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-slate-950/40 dark:bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      <LeadDetailProvider initialLead={lead} onClose={onClose}>
        <MasterDetailModalContent onClose={onClose} />
      </LeadDetailProvider>
    </div>,
    document.body,
  );
}

const WHATSAPP_TEMPLATES = [
  {
    id: 'intro',
    label: 'Presentación Inicial',
    text: (name: string) =>
      `Hola ${name}, gracias por tu interés en LoopDev Salud. Soy Elena, tu asesora comercial. ¿Tienes unos minutos hoy para conversar sobre nuestros planes?`,
  },
  {
    id: 'proposal',
    label: 'Envío de Propuesta',
    text: (name: string) =>
      `Hola ${name}, acabo de enviarte la cotización formal a tu correo. Quedo atenta para resolver cualquier duda que tengas sobre la propuesta comercial.`,
  },
  {
    id: 'followup',
    label: 'Seguimiento de Trato',
    text: (name: string) =>
      `Hola ${name}, te escribo para saber si pudiste revisar la cotización que te enviamos y si hay algún ajuste que debamos realizar.`,
  },
  {
    id: 'meeting',
    label: 'Recordatorio de Cita',
    text: (name: string) =>
      `Hola ${name}, te recuerdo que tenemos agendada nuestra sesión técnica hoy en 30 minutos. Te comparto el enlace de la reunión en un momento.`,
  },
];

const CALL_TEMPLATES = [
  {
    id: 'discovery',
    label: 'Llamada de Descubrimiento',
    text: '• Interés Principal: \n• Presupuesto/Planes: \n• Tomador de Decisión: \n• Siguiente Reunión: ',
  },
  {
    id: 'proposal',
    label: 'Seguimiento de Propuesta',
    text: '• Feedback Comercial: \n• Dudas/Objeciones: \n• Fecha Límite de Cierre: \n• Compromisos: ',
  },
];

function MasterDetailModalContent({ onClose }: { onClose: () => void }) {
  const {
    lead,
    editedLead,
    activeCreator,
    setActiveCreator,
    isReadOnly,
    handleStatusChange,
    handleLeadClosure,
    handleMoveToOnboarding,
    newWhatsAppChat,
    setNewWhatsAppChat,
    logWhatsAppChat,
    whatsAppClick,
    newNote,
    setNewNote,
    addNote,
    noteCategory,
    setNoteCategory,
    notePinned,
    setNotePinned,
    newCall,
    setNewCall,
    logCall,
    newTask,
    setNewTask,
    addTask,
  } = useLeadDetail();

  // Call timer states for interactive call logging
  const [callTimer, setCallTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCreator === 'call') {
      queueMicrotask(() => {
        setIsTimerRunning(true);
        setCallTimer(0);
      });
      interval = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      queueMicrotask(() => setIsTimerRunning(false));
    }
    return () => clearInterval(interval);
  }, [activeCreator]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
    const minutes = Math.floor(callTimer / 60);
    const seconds = callTimer % 60;
    const durationStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    setNewCall((prev) => ({
      ...prev,
      summary: prev.summary
        ? `[Duración: ${durationStr}] ${prev.summary.replace(/\[Duración: [^\]]+\]\s*/g, '')}`
        : `[Duración: ${durationStr}] `,
    }));
  };

  // Latency calculation for WhatsApp
  const lastWhatsAppLog = lead.activityLog?.find(
    (entry) =>
      entry.action === 'Conversación de WhatsApp registrada' ||
      entry.action === 'Conversación de WhatsApp iniciada',
  );

  const getWhatsAppLatency = () => {
    if (!lastWhatsAppLog) {
      return {
        text: 'Sin chats previos registrados',
        colorClass: 'text-slate-400 dark:text-slate-500',
      };
    }
    const diffTime = Math.abs(new Date().getTime() - new Date(lastWhatsAppLog.timestamp).getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      return {
        text: 'Último contacto: Hoy',
        colorClass: 'text-emerald-600 dark:text-emerald-400 font-bold',
      };
    } else if (diffDays === 1) {
      return {
        text: 'Último contacto: Ayer',
        colorClass: 'text-slate-500 dark:text-slate-400 font-semibold',
      };
    } else if (diffDays <= 3) {
      return {
        text: `Último contacto: hace ${diffDays} días`,
        colorClass: 'text-slate-500 dark:text-slate-400',
      };
    } else {
      return {
        text: `Alerta: último contacto hace ${diffDays} días`,
        colorClass: 'text-rose-500 dark:text-rose-400 font-bold animate-pulse',
      };
    }
  };

  const latency = getWhatsAppLatency();

  // Temporary closure reasons state
  const [showClosureForm, setShowClosureForm] = useState<'rejected' | 'discarded' | null>(null);
  const [closureReason, setClosureReason] = useState('');
  const [closureDetails, setClosureDetails] = useState('');

  const handleConfirmClosure = (e: React.FormEvent) => {
    e.preventDefault();
    if (showClosureForm) {
      handleLeadClosure(showClosureForm, closureReason, closureDetails);
      setShowClosureForm(null);
      setClosureReason('');
      setClosureDetails('');
    }
  };

  const renderFooterActions = () => {
    const discardBtn = (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setClosureReason('Cliente no responde');
          setShowClosureForm('discarded');
        }}
        className="border-rose-500/20 text-rose-400 hover:bg-rose-500/10 font-bold"
      >
        <span className="flex items-center gap-1.5">
          <Icon name={ICON_REGISTRY.actions.close} size="sm" /> Descartar
        </span>
      </Button>
    );

    switch (editedLead.stage) {
      case 'lead':
        return (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStatusChange('contacted')}
              className="bg-primary hover:bg-primary/95 text-white font-bold"
            >
              Marcar como Contactado
            </Button>
            {discardBtn}
          </>
        );
      case 'contacted':
        return (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStatusChange('proposal')}
              className="bg-primary hover:bg-primary/95 text-white font-bold"
            >
              Marcar Presupuesto Enviado
            </Button>
            {discardBtn}
          </>
        );
      case 'proposal':
      case 'negotiation':
        return (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStatusChange('won')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold border-none"
            >
              Aceptar Presupuesto
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setClosureReason('Precio muy alto');
                setShowClosureForm('rejected');
              }}
              className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-bold"
            >
              Rechazar Presupuesto
            </Button>
            {discardBtn}
          </>
        );
      case 'won':
        return (
          <Button
            variant="primary"
            size="md"
            onClick={handleMoveToOnboarding}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black flex items-center justify-center gap-2 border-none py-3"
          >
            <Icon name="rocket" size="sm" /> Iniciar Proceso de Contratación
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-6xl h-[90vh] flex flex-col relative"
    >
      <TechnicalSurface
        variant="surface"
        depth="overlay"
        className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border-slate-200 dark:border-white/10"
      >
        <div className="flex flex-col h-full w-full bg-white dark:bg-lpd-bg-dark text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
          {/* 1. Header component */}
          <Header onClose={onClose} />

          {/* 2. Closure reasons popup overlay */}
          {showClosureForm && (
            <div className="absolute inset-0 bg-slate-950/40 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <TechnicalSurface
                variant="surface"
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl max-w-md w-full flex flex-col gap-4 text-xs font-sans"
              >
                <div className="flex flex-col gap-1 border-b border-slate-200 dark:border-white/5 pb-2">
                  <Heading as="h3" size="sm" weight="bold" className="text-slate-900 dark:text-white uppercase tracking-wider">
                    {showClosureForm === 'rejected' ? 'Rechazar Presupuesto' : 'Descartar Lead'}
                  </Heading>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Por favor, registra el motivo de la baja del trato.
                  </p>
                </div>
                <form onSubmit={handleConfirmClosure} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-500 dark:text-slate-400 font-bold font-mono text-[10px]">
                      MOTIVO DE CIERRE
                    </label>
                    <select
                      value={closureReason}
                      onChange={(e) => setClosureReason(e.target.value)}
                      className="bg-slate-100 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      {showClosureForm === 'rejected' ? (
                        <>
                          <option value="Precio muy alto">Precio muy alto</option>
                          <option value="Contratado con otra compañía">
                            Contratado con otra compañía
                          </option>
                          <option value="Ya no lo necesita">Ya no lo necesita</option>
                          <option value="Otro">Otro</option>
                        </>
                      ) : (
                        <>
                          <option value="Cliente no responde">Cliente no responde</option>
                          <option value="Datos de contacto incorrectos">
                            Datos de contacto incorrectos
                          </option>
                          <option value="No cumple requisitos">No cumple requisitos</option>
                          <option value="Otro">Otro</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-500 dark:text-slate-400 font-bold font-mono text-[10px]">
                      DETALLES DE LA BITÁCORA
                    </label>
                    <textarea
                      value={closureDetails}
                      onChange={(e) => setClosureDetails(e.target.value)}
                      rows={3}
                      placeholder="Detalles del cierre negativo..."
                      className="bg-slate-100 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 focus:outline-none resize-none font-sans"
                    />
                  </div>
                  <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-white/5 pt-3 mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => setShowClosureForm(null)}
                      className="border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-300"
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      type="submit"
                      className="bg-primary hover:bg-primary/95 text-white font-bold"
                    >
                      Confirmar Cierre
                    </Button>
                  </div>
                </form>
              </TechnicalSurface>
            </div>
          )}

          {/* 4. Active Inline Activity Creators (Notes / Calls / Tasks) */}
          {activeCreator && (
            <div className="p-4 bg-slate-100/50 dark:bg-slate-950/30 border-b border-slate-200 dark:border-white/5 animate-in slide-in-from-top-4 duration-200">
              <TechnicalSurface
                variant="surface"
                className="p-4 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl text-xs flex flex-col gap-3 font-sans"
              >
                <div className="flex justify-between items-center select-none">
                  <span className="font-mono text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                    [ TTY_CREATOR: {activeCreator.toUpperCase()} ]
                  </span>
                  <IconButton
                    icon="close"
                    size="sm"
                    onClick={() => setActiveCreator(null)}
                    className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200"
                    aria-label="Cerrar creador"
                  />
                </div>

                {activeCreator === 'note' && (
                  <div className="flex flex-col gap-3 font-sans">
                    {/* Atajos de Estructura */}
                    <div className="flex flex-wrap gap-1 select-none">
                      {[
                        { label: '+ Desafío', text: '• Desafío actual: ' },
                        { label: '+ Presupuesto', text: '• Presupuesto: ' },
                        { label: '+ Siguiente Contacto', text: '• Próximo paso: ' },
                      ].map((pill) => (
                        <Button
                          key={pill.label}
                          type="button"
                          onClick={() => {
                            setNewNote(newNote ? `${newNote}\n${pill.text}` : pill.text);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900 text-[10px] text-slate-650 dark:text-slate-400 border border-slate-200 dark:border-white/5 transition-all"
                        >
                          {pill.label}
                        </Button>
                      ))}
                    </div>

                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Detalla la nota o minuta del lead..."
                      rows={3}
                      className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 focus:outline-none resize-none font-sans"
                    />

                    {/* Categorías y Pin */}
                    <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center select-none py-1.5 border-t border-slate-200 dark:border-white/5 mt-1">
                      {/* Category Pills */}
                      <div className="flex flex-col gap-1 w-full md:w-auto">
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono uppercase">
                          Categoría de la Nota
                        </label>
                        <div className="flex gap-1.5">
                          {[
                            {
                              id: 'general',
                              label: 'General 📄',
                              colorClass:
                                'border-slate-400 text-slate-700 bg-slate-500/5 dark:text-slate-350',
                            },
                            {
                              id: 'requirement',
                              label: 'Requerimiento 🛠️',
                              colorClass: 'border-blue-500 text-blue-600 bg-blue-500/5',
                            },
                            {
                              id: 'pain_point',
                              label: 'Dolor ⚠️',
                              colorClass: 'border-amber-500 text-amber-600 bg-amber-500/5',
                            },
                            {
                              id: 'budget',
                              label: 'Presupuesto 💰',
                              colorClass: 'border-emerald-500 text-emerald-600 bg-emerald-500/5',
                            },
                          ].map((pill) => {
                            const isSelected = noteCategory === pill.id;
                            return (
                              <Button
                                key={pill.id}
                                type="button"
                                onClick={() =>
                                  setNoteCategory(
                                    pill.id as 'general' | 'requirement' | 'pain_point' | 'budget',
                                  )
                                }
                                className={`px-3 py-1 rounded-xl border text-[11px] font-semibold transition-all ${
                                  isSelected
                                    ? `${pill.colorClass} border-2 shadow-sm font-bold scale-[1.03]`
                                    : 'border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/30'
                                }`}
                              >
                                {pill.label}
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Pin checkbox */}
                      <div className="flex items-center gap-2 self-end md:self-center font-sans text-xs">
                        <input
                          type="checkbox"
                          id="pin-note-checkbox"
                          checked={notePinned}
                          onChange={(e) => setNotePinned(e.target.checked)}
                          className="rounded border-slate-250 text-primary focus:ring-primary w-4 h-4 bg-slate-50 dark:bg-slate-950 dark:border-white/5"
                        />
                        <label
                          htmlFor="pin-note-checkbox"
                          className="text-slate-700 dark:text-slate-300 font-bold select-none cursor-pointer"
                        >
                          📌 Fijar en el perfil
                        </label>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="self-end"
                      onClick={addNote}
                      disabled={!newNote.trim()}
                    >
                      Registrar Nota
                    </Button>
                  </div>
                )}

                {activeCreator === 'call' && (
                  <div className="flex flex-col gap-3 font-sans">
                    {/* Timer block & controls */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-red-500/5 dark:bg-red-500/10 p-3 rounded-xl border border-red-500/20 dark:border-red-500/10 select-none">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full bg-red-500 ${isTimerRunning ? 'animate-pulse' : ''}`}
                        />
                        <div className="flex flex-col gap-0.5">
                          <Heading as="h4" size="xs" weight="bold" className="text-red-800 dark:text-red-300">
                            Simulación de Llamada VoIP
                          </Heading>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            {isTimerRunning ? 'Llamada en progreso...' : 'Grabación finalizada'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-end md:self-center">
                        <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                          {formatTime(callTimer)}
                        </span>
                        {isTimerRunning ? (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={handleStopTimer}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                          >
                            Finalizar y Registrar Tiempo
                          </Button>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-450 dark:text-slate-500 uppercase font-bold">
                            Tiempo Registrado
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Outcome quick-pills & templates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end border-t border-slate-200 dark:border-white/5 pt-3 select-none">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-slate-400 dark:text-slate-500 font-bold font-mono uppercase">
                          Resultado de la Llamada
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            {
                              id: 'Conectado',
                              label: 'Contestó',
                              colorClass: 'border-emerald-500 text-emerald-600 bg-emerald-500/5',
                            },
                            {
                              id: 'Ocupado',
                              label: 'Volver a llamar',
                              colorClass: 'border-amber-500 text-amber-600 bg-amber-500/5',
                            },
                            {
                              id: 'Buzon',
                              label: 'Buzón',
                              colorClass: 'border-indigo-500 text-indigo-600 bg-indigo-500/5',
                            },
                            {
                              id: 'Sin Respuesta',
                              label: 'No Contestó',
                              colorClass: 'border-rose-500 text-rose-600 bg-rose-500/5',
                            },
                          ].map((pill) => {
                            const isSelected = newCall.outcome === pill.id;
                            return (
                              <Button
                                key={pill.id}
                                type="button"
                                onClick={() =>
                                  setNewCall((prev) => ({ ...prev, outcome: pill.id }))
                                }
                                className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
                                  isSelected
                                    ? `${pill.colorClass} border-2 shadow-sm font-bold scale-[1.03]`
                                    : 'border-slate-250 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/30'
                                }`}
                              >
                                {pill.label}
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] text-slate-450 dark:text-slate-500 font-bold font-mono uppercase">
                            Plantilla de Minuta
                          </label>
                          <Select
                            size="sm"
                            onChange={(e) => {
                              const template = CALL_TEMPLATES.find((t) => t.id === e.target.value);
                              if (template) {
                                setNewCall((prev) => ({ ...prev, summary: template.text }));
                              }
                            }}
                            className="w-full font-sans"
                          >
                            <option value="">-- Sin Plantilla --</option>
                            {CALL_TEMPLATES.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.label}
                              </option>
                            ))}
                          </Select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] text-slate-450 dark:text-slate-500 font-bold font-mono uppercase">
                            Fecha y Hora
                          </label>
                          <Input
                            type="datetime-local"
                            value={newCall.date}
                            onChange={(e) =>
                              setNewCall((prev) => ({ ...prev, date: e.target.value }))
                            }
                            size="sm"
                            className="w-full font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 mt-1">
                      <label className="text-[10px] text-slate-455 dark:text-slate-500 font-bold font-mono uppercase">
                        Resumen de la Llamada
                      </label>
                      <textarea
                        value={newCall.summary}
                        onChange={(e) =>
                          setNewCall((prev) => ({ ...prev, summary: e.target.value }))
                        }
                        placeholder="Detalla lo acordado en la llamada, compromisos u objeciones..."
                        rows={3}
                        className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 focus:outline-none resize-none font-sans"
                      />
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="self-end"
                      onClick={logCall}
                      disabled={!newCall.summary.trim()}
                    >
                      Registrar Llamada
                    </Button>
                  </div>
                )}

                {activeCreator === 'task' && (
                  <div className="flex flex-col gap-3 font-sans">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono">
                          TÍTULO DE LA TAREA
                        </label>
                        <Input
                          type="text"
                          value={newTask.title}
                          onChange={(e) =>
                            setNewTask((prev) => ({ ...prev, title: e.target.value }))
                          }
                          placeholder="Ej. Enviar propuesta ajustada"
                          size="sm"
                          className="w-full font-sans"
                        />

                        {/* Predefined Title Options */}
                        <div className="flex flex-wrap gap-1 mt-1.5 select-none">
                          {[
                            { label: '📞 Llamar', title: 'Llamar para seguimiento' },
                            { label: '📧 Enviar propuesta', title: 'Enviar propuesta comercial' },
                            { label: '📅 Reunión / Demo', title: 'Agendar Demo del producto' },
                            {
                              label: '📋 Solicitar docs',
                              title: 'Solicitar documentos pendientes',
                            },
                          ].map((pill) => (
                            <Button
                              key={pill.label}
                              type="button"
                              onClick={() => setNewTask((prev) => ({ ...prev, title: pill.title }))}
                              className="px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900 text-[10px] text-slate-650 dark:text-slate-400 border border-slate-200 dark:border-white/5 transition-all"
                            >
                              {pill.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono">
                          FECHA LÍMITE (VENCIMIENTO)
                        </label>
                        <Input
                          type="datetime-local"
                          value={newTask.dueDate}
                          onChange={(e) =>
                            setNewTask((prev) => ({ ...prev, dueDate: e.target.value }))
                          }
                          size="sm"
                          className="w-full font-mono"
                        />

                        {/* Predefined Date Options */}
                        <div className="flex flex-wrap gap-1 mt-1.5 select-none">
                          {[
                            {
                              label: 'Hoy',
                              getVal: () => {
                                const d = new Date();
                                d.setHours(17, 0, 0, 0);
                                return d.toISOString().slice(0, 16);
                              },
                            },
                            {
                              label: 'Mañana',
                              getVal: () => {
                                const d = new Date();
                                d.setDate(d.getDate() + 1);
                                d.setHours(10, 0, 0, 0);
                                return d.toISOString().slice(0, 16);
                              },
                            },
                            {
                              label: '3 días',
                              getVal: () => {
                                const d = new Date();
                                d.setDate(d.getDate() + 3);
                                d.setHours(10, 0, 0, 0);
                                return d.toISOString().slice(0, 16);
                              },
                            },
                            {
                              label: '1 semana',
                              getVal: () => {
                                const d = new Date();
                                d.setDate(d.getDate() + 7);
                                d.setHours(10, 0, 0, 0);
                                return d.toISOString().slice(0, 16);
                              },
                            },
                          ].map((pill) => (
                            <Button
                              key={pill.label}
                              type="button"
                              onClick={() =>
                                setNewTask((prev) => ({ ...prev, dueDate: pill.getVal() }))
                              }
                              className="px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900 text-[10px] text-slate-650 dark:text-slate-400 border border-slate-200 dark:border-white/5 transition-all"
                            >
                              {pill.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Priority Selection */}
                    <div className="flex flex-col gap-1.5 mt-1 select-none">
                      <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono">
                        PRIORIDAD DE LA TAREA
                      </label>
                      <div className="flex gap-2">
                        {[
                          {
                            id: 'high',
                            label: 'Alta 🔴',
                            colorClass: 'border-rose-500 text-rose-600 bg-rose-500/5',
                          },
                          {
                            id: 'medium',
                            label: 'Media 🟡',
                            colorClass: 'border-amber-500 text-amber-600 bg-amber-500/5',
                          },
                          {
                            id: 'low',
                            label: 'Baja 🔵',
                            colorClass: 'border-blue-500 text-blue-600 bg-blue-500/5',
                          },
                        ].map((pill) => {
                          const isSelected = newTask.priority === pill.id;
                          return (
                            <Button
                              key={pill.id}
                              type="button"
                              onClick={() =>
                                setNewTask((prev) => ({
                                  ...prev,
                                  priority: pill.id as 'low' | 'medium' | 'high',
                                }))
                              }
                              className={`px-3 py-1 rounded-xl border text-[11px] font-semibold transition-all ${
                                isSelected
                                  ? `${pill.colorClass} border-2 shadow-sm font-bold scale-[1.03]`
                                  : 'border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/30'
                              }`}
                            >
                              {pill.label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 mt-1">
                      <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono">
                        DETALLES ADICIONALES (OPCIONAL)
                      </label>
                      <textarea
                        value={newTask.description}
                        onChange={(e) =>
                          setNewTask((prev) => ({ ...prev, description: e.target.value }))
                        }
                        placeholder="Añade detalles adicionales de la tarea..."
                        rows={2}
                        className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 focus:outline-none resize-none font-sans"
                      />
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="self-end"
                      onClick={addTask}
                      disabled={!newTask.title.trim()}
                    >
                      Crear Tarea
                    </Button>
                  </div>
                )}

                {activeCreator === 'whatsapp' && (
                  <div className="flex flex-col gap-3 font-sans">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-emerald-500/5 dark:bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20 dark:border-emerald-500/10">
                      <div className="flex flex-col gap-0.5">
                        <Heading as="h4" size="xs" weight="bold" className="text-emerald-800 dark:text-emerald-300">
                          Enlace de Comunicación Directa
                        </Heading>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Continúa la conversación abriendo el chat oficial con el número del lead.
                        </p>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={whatsAppClick}
                        className="bg-emerald-600 hover:bg-emerald-700 border-none text-white whitespace-nowrap flex-shrink-0"
                      >
                        <span className="flex items-center gap-1.5 justify-center">
                          <svg
                            className="w-3.5 h-3.5 fill-current"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM12.04 20.1c-1.53 0-3.01-.4-4.29-1.15l-.3-.18-3.18.83.85-3.1-.2-.32c-.82-1.33-1.25-2.83-1.25-4.38 0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.23.86 5.82 2.45s2.45 3.62 2.45 5.82c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.2c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.15.17-.29.18-.54.06s-1.02-.38-1.94-1.2c-.72-.64-1.2-1.43-1.34-1.67-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07s.88 2.4 1 2.56c.12.17 1.73 2.63 4.2 3.7.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.07-.12-.23-.18-.48-.3z" />
                          </svg>
                          <span>Abrir Chat</span>
                        </span>
                      </Button>
                    </div>

                    {/* Template Selector & Latency Info */}
                    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between border-t border-slate-200 dark:border-white/5 pt-3 select-none">
                      <div className="flex flex-col gap-1 w-full md:w-auto">
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono uppercase">
                          Plantillas de Mensaje
                        </label>
                        <Select
                          size="sm"
                          onChange={(e) => {
                            const template = WHATSAPP_TEMPLATES.find(
                              (t) => t.id === e.target.value,
                            );
                            if (template) {
                              setNewWhatsAppChat(template.text(editedLead.name));
                            }
                          }}
                          className="w-full md:w-60 font-sans"
                        >
                          <option value="">-- Seleccionar Plantilla --</option>
                          {WHATSAPP_TEMPLATES.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.label}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div className="flex flex-col gap-1 items-start md:items-end font-mono text-[9px]">
                        <span className="text-slate-450 dark:text-slate-500 uppercase font-bold">
                          LATENCIA DE CONTACTO
                        </span>
                        <span className={latency.colorClass}>{latency.text}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono uppercase">
                        Pegar Registro de Conversación
                      </label>
                      <textarea
                        value={newWhatsAppChat}
                        onChange={(e) => setNewWhatsAppChat(e.target.value)}
                        placeholder="Pega aquí el contenido, notas o transcripción del chat con el lead..."
                        rows={4}
                        className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 focus:outline-none resize-none font-sans"
                      />
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="self-end"
                      onClick={logWhatsAppChat}
                      disabled={!newWhatsAppChat.trim()}
                    >
                      Registrar en Historial
                    </Button>
                  </div>
                )}

                {activeCreator === 'email' && <EmailComposer />}
              </TechnicalSurface>
            </div>
          )}

          {/* 5. Main Double Column Scrollable Layout */}
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-white/5 bg-slate-50/50 dark:bg-slate-950/20">
            {/* Left Column: Lead Info placeholder */}
            <div className="lg:col-span-1 p-5 overflow-y-auto custom-scrollbar flex flex-col gap-5 bg-slate-100/10 dark:bg-slate-950/10">
              <div className="flex flex-col gap-1.5 border-b border-slate-200 dark:border-white/5 pb-3">
                <span className="font-mono text-[9px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-widest select-none">
                  SEC_LEFT: OPPORTUNITY_PROFILE
                </span>
                <Heading as="h3" size="xs" weight="bold" className="text-slate-800 dark:text-white uppercase tracking-wider select-none">
                  Perfil de Datos
                </Heading>
              </div>
              <InfoPanel />

              {/* Pinned Notes Section */}
              {lead.activityLog?.some((entry) => entry.type === 'NOTE' && entry.pinned) && (
                <div className="flex flex-col gap-3 mt-2 animate-in fade-in duration-200">
                  <span className="font-mono text-[9px] text-slate-455 dark:text-slate-500 font-bold uppercase tracking-widest select-none">
                    📌 NOTAS CLAVE ANCLADAS
                  </span>
                  <div className="flex flex-col gap-2">
                    {lead.activityLog
                      .filter((entry) => entry.type === 'NOTE' && entry.pinned)
                      .map((entry) => {
                        const categoryColors = {
                          general:
                            'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-350 border-slate-200 dark:border-white/5',
                          requirement:
                            'bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/10',
                          pain_point:
                            'bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/10',
                          budget:
                            'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/10',
                        };
                        const categoryLabel = {
                          general: 'General',
                          requirement: 'Requerimiento',
                          pain_point: 'Dolor',
                          budget: 'Presupuesto',
                        };
                        return (
                          <div
                            key={entry.timestamp}
                            className={`p-3 rounded-xl border flex flex-col gap-1.5 bg-white dark:bg-slate-900 ${
                              entry.category === 'requirement'
                                ? 'border-blue-500/20 dark:border-blue-500/10'
                                : entry.category === 'pain_point'
                                  ? 'border-amber-500/20 dark:border-amber-500/10'
                                  : entry.category === 'budget'
                                    ? 'border-emerald-500/20 dark:border-emerald-500/10'
                                    : 'border-slate-200 dark:border-white/5'
                            }`}
                          >
                            <div className="flex justify-between items-center text-[10px] select-none">
                              <span
                                className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${categoryColors[entry.category || 'general']}`}
                              >
                                {categoryLabel[entry.category || 'general']}
                              </span>
                              <span className="text-slate-455 dark:text-slate-550 font-mono text-[9px]">
                                {new Date(entry.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed whitespace-pre-wrap font-sans">
                              {entry.details}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Columns: Activity Timeline & Details */}
            <div className="lg:col-span-2 p-5 overflow-y-auto custom-scrollbar flex flex-col gap-5 bg-white/50 dark:bg-lpd-bg-dark/30">
              <ActivityPanel />
            </div>
          </div>

          {/* 6. Footer Actions Panel */}
          {!isReadOnly && (
            <div className="p-5 bg-white/70 dark:bg-lpd-bg-dark/70 backdrop-blur-md border-t border-slate-200/60 dark:border-white/5 flex justify-end gap-3 flex-shrink-0 select-none">
              {renderFooterActions()}
            </div>
          )}
        </div>
      </TechnicalSurface>
    </div>
  );
}
