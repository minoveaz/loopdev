'use client';

import { Heading, LpdText, Icon, Button, TechnicalStatusBadge, IconButton } from '@loopdev/ui';
import { useLeadDetail } from '../../context/LeadDetailContext';
import { stageLabels, stageSeverityMap } from '../leadStageConfig';

const WhatsAppMark = ({ className = '' }: { className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className={`h-4 w-4 fill-current ${className}`}
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.1c-1.53 0-3.01-.4-4.29-1.15l-.3-.18-3.18.83.85-3.1-.2-.32c-.82-1.33-1.25-2.83-1.25-4.38 0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.23.86 5.82 2.45s2.45 3.62 2.45 5.82c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.2c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.15.17-.29.18-.54.06s-1.02-.38-1.94-1.2c-.72-.64-1.2-1.43-1.34-1.67-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07s.88 2.4 1 2.56c.12.17 1.73 2.63 4.2 3.7.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.07-.12-.23-.18-.48-.3z" />
  </svg>
);

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
    <div className="bg-white dark:bg-lpd-bg-dark border-b border-slate-200 dark:border-white/10 flex-shrink-0 select-none">
      <div className="p-5 flex flex-col gap-4">
        {/* Top Row: Identity, Badges & Close controls */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-grow min-w-0">
            <Heading as="h2" size="lg" weight="bold" className="text-slate-900 dark:text-white truncate">
              {editedLead.name}
            </Heading>
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
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pt-1 min-w-0">
          {/* Call creator trigger */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setActiveCreator(activeCreator === 'call' ? null : 'call')}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all text-xs font-semibold border ${
              activeCreator === 'call'
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10'
                : 'bg-slate-100/80 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
            }`}
            title="Registrar Llamada"
          >
            <Icon name="call" size="sm" className={activeCreator === 'call' ? 'text-white' : 'text-slate-500 dark:text-slate-400'} />
            <span>Registrar Llamada</span>
          </Button>

          {/* Task creator trigger */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setActiveCreator(activeCreator === 'task' ? null : 'task')}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all text-xs font-semibold border ${
              activeCreator === 'task'
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10'
                : 'bg-slate-100/80 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
            }`}
            title="Nueva Tarea"
          >
            <Icon name="task_alt" size="sm" className={activeCreator === 'task' ? 'text-white' : 'text-slate-500 dark:text-slate-400'} />
            <span>Nueva Tarea</span>
          </Button>

          {/* Note creator trigger */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setActiveCreator(activeCreator === 'note' ? null : 'note')}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all text-xs font-semibold border ${
              activeCreator === 'note'
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10'
                : 'bg-slate-100/80 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
            }`}
            title="Tomar Nota"
          >
            <Icon name="note_add" size="sm" className={activeCreator === 'note' ? 'text-white' : 'text-slate-500 dark:text-slate-400'} />
            <span>Tomar Nota</span>
          </Button>

          <div className="w-px h-6 bg-slate-200 dark:bg-white/5 mx-1 flex-shrink-0 hidden md:block" />

          {/* WhatsApp Action */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setActiveCreator(activeCreator === 'whatsapp' ? null : 'whatsapp')}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all text-xs font-semibold border ${
              activeCreator === 'whatsapp'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/10'
                : 'bg-slate-100/80 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
            }`}
            title="Registrar WhatsApp"
          >
            <WhatsAppMark className={activeCreator === 'whatsapp' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'} />
            <span>WhatsApp</span>
          </Button>

          {/* Email trigger */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setActiveCreator(activeCreator === 'email' ? null : 'email')}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all text-xs font-semibold border ${
              activeCreator === 'email'
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10'
                : 'bg-slate-100/80 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
            }`}
            title="Redactar Correo"
          >
            <Icon name="mail" size="sm" className={activeCreator === 'email' ? 'text-white' : 'text-slate-500 dark:text-slate-400'} />
            <span>Enviar Correo</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
