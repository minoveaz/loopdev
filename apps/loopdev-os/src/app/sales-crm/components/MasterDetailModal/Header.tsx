'use client';

import { Heading, LpdText, Icon, Button, TechnicalStatusBadge, IconButton } from '@loopdev/ui';
import { useLeadDetail } from '../../context/LeadDetailContext';
import { stageLabels, stageSeverityMap } from '../leadStageConfig';

interface HeaderProps {
  onClose: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onClose }) => {
  const {
    lead,
    editedLead,
    isEditing,
    isReadOnly,
    activeCreator,
    setActiveCreator,
    startEdit,
    cancelEdit,
    handleSave,
    whatsAppClick,
  } = useLeadDetail();

  /* const stageLabels: Record<import('../../context').Lead['stage'], string> = {
    lead: 'Nuevo Lead',
    contacted: 'Contactado',
    proposal: 'Propuesta',
    negotiation: 'Negociación',
    won: 'Ganado',
    lost: 'Perdido',
    rejected: 'Rechazado',
    discarded: 'Descartado'
  };

  const stageSeverityMap: Record<import('../../context').Lead['stage'], 'info' | 'warning' | 'danger' | 'success' | 'innovation' | 'neutral' | 'primary'> = {
    lead: 'neutral',
    contacted: 'info',
    proposal: 'innovation',
    negotiation: 'warning',
    won: 'success',
    lost: 'danger',
    rejected: 'danger',
    discarded: 'neutral',
  }; */

  return (
    <div className="bg-white/70 dark:bg-[#0f172a]/70 backdrop-blur-md border-b border-slate-200/60 dark:border-white/5 flex-shrink-0 select-none">
      <div className="p-5 flex flex-col gap-4">
        {/* Top Row: Identity, Badges & Close controls */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-grow min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white truncate">
              {editedLead.name}
            </h2>
            <div className="flex items-center gap-2.5 mt-1 text-xs">
              <TechnicalStatusBadge
                label={stageLabels[editedLead.stage]}
                severity={stageSeverityMap[editedLead.stage]}
              />
              <span className="text-slate-300 dark:text-slate-600 font-mono">•</span>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                ID: {editedLead.id} • {editedLead.company}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Button variant="danger" size="sm" onClick={cancelEdit}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={handleSave}>
                  Guardar
                </Button>
              </div>
            ) : (
              !isReadOnly && (
                <IconButton
                  icon="edit"
                  size="sm"
                  variant="neutral"
                  onClick={startEdit}
                  aria-label="Editar Ficha"
                  className="border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                />
              )
            )}

            <div className="w-px h-6 bg-slate-200 dark:bg-white/5 mx-1 flex-shrink-0" />

            <IconButton
              icon="close"
              size="sm"
              variant="ghost"
              onClick={onClose}
              aria-label="Cerrar Modal"
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
            />
          </div>
        </div>

        {/* Bottom Row: Communication & Action Strip */}
        <fieldset
          disabled={isReadOnly}
          className="flex items-center gap-3 overflow-x-auto hide-scrollbar pt-1 disabled:opacity-50 min-w-0"
        >
          {/* Call creator trigger */}
          <button
            onClick={() => setActiveCreator(activeCreator === 'call' ? null : 'call')}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full transition-all text-xs font-semibold border ${
              activeCreator === 'call'
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10'
                : 'bg-slate-100/80 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
            }`}
            title="Registrar Llamada"
          >
            <svg
              className={`w-4 h-4 shrink-0 ${activeCreator === 'call' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Registrar Llamada</span>
          </button>

          {/* Task creator trigger */}
          <button
            onClick={() => setActiveCreator(activeCreator === 'task' ? null : 'task')}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full transition-all text-xs font-semibold border ${
              activeCreator === 'task'
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10'
                : 'bg-slate-100/80 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
            }`}
            title="Nueva Tarea"
          >
            <svg
              className={`w-4 h-4 shrink-0 ${activeCreator === 'task' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <path d="m9 14 2 2 4-4" />
            </svg>
            <span>Nueva Tarea</span>
          </button>

          {/* Note creator trigger */}
          <button
            onClick={() => setActiveCreator(activeCreator === 'note' ? null : 'note')}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full transition-all text-xs font-semibold border ${
              activeCreator === 'note'
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10'
                : 'bg-slate-100/80 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
            }`}
            title="Tomar Nota"
          >
            <svg
              className={`w-4 h-4 shrink-0 ${activeCreator === 'note' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M9 14h6" />
              <path d="M9 17h3" />
            </svg>
            <span>Tomar Nota</span>
          </button>

          <div className="w-px h-6 bg-slate-200 dark:bg-white/5 mx-1 flex-shrink-0 hidden md:block" />

          {/* WhatsApp Action */}
          <button
            onClick={() => setActiveCreator(activeCreator === 'whatsapp' ? null : 'whatsapp')}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full transition-all text-xs font-semibold border ${
              activeCreator === 'whatsapp'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/10'
                : 'bg-slate-100/80 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
            }`}
            title="Registrar WhatsApp"
          >
            <svg
              className={`w-4 h-4 shrink-0 fill-current ${activeCreator === 'whatsapp' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM12.04 20.1c-1.53 0-3.01-.4-4.29-1.15l-.3-.18-3.18.83.85-3.1-.2-.32c-.82-1.33-1.25-2.83-1.25-4.38 0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.23.86 5.82 2.45s2.45 3.62 2.45 5.82c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.2c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.15.17-.29.18-.54.06s-1.02-.38-1.94-1.2c-.72-.64-1.2-1.43-1.34-1.67-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07s.88 2.4 1 2.56c.12.17 1.73 2.63 4.2 3.7.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.07-.12-.23-.18-.48-.3z" />
            </svg>
            <span>WhatsApp</span>
          </button>

          {/* Email trigger */}
          <button
            onClick={() => setActiveCreator(activeCreator === 'email' ? null : 'email')}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full transition-all text-xs font-semibold border ${
              activeCreator === 'email'
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10'
                : 'bg-slate-100/80 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
            }`}
            title="Redactar Correo"
          >
            <svg
              className={`w-4 h-4 shrink-0 ${activeCreator === 'email' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span>Enviar Correo</span>
          </button>
        </fieldset>
      </div>
    </div>
  );
};
