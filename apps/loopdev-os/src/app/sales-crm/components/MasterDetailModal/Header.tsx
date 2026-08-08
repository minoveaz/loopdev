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
    <div className="bg-white/70 dark:bg-lpd-bg-dark/70 backdrop-blur-md border-b border-slate-200/60 dark:border-white/5 flex-shrink-0 select-none">
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
        <fieldset
          disabled={isReadOnly}
          className="flex items-center gap-3 overflow-x-auto hide-scrollbar pt-1 disabled:opacity-50 min-w-0"
        >
          {/* Call creator trigger */}
          <Button
            type="button"
            onClick={() => setActiveCreator(activeCreator === 'call' ? null : 'call')}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full transition-all text-xs font-semibold border ${
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
            onClick={() => setActiveCreator(activeCreator === 'task' ? null : 'task')}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full transition-all text-xs font-semibold border ${
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
            onClick={() => setActiveCreator(activeCreator === 'note' ? null : 'note')}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full transition-all text-xs font-semibold border ${
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
            onClick={() => setActiveCreator(activeCreator === 'whatsapp' ? null : 'whatsapp')}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full transition-all text-xs font-semibold border ${
              activeCreator === 'whatsapp'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/10'
                : 'bg-slate-100/80 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
            }`}
            title="Registrar WhatsApp"
          >
            <Icon name="chat" size="sm" className={activeCreator === 'whatsapp' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'} />
            <span>WhatsApp</span>
          </Button>

          {/* Email trigger */}
          <Button
            type="button"
            onClick={() => setActiveCreator(activeCreator === 'email' ? null : 'email')}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full transition-all text-xs font-semibold border ${
              activeCreator === 'email'
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10'
                : 'bg-slate-100/80 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
            }`}
            title="Redactar Correo"
          >
            <Icon name="mail" size="sm" className={activeCreator === 'email' ? 'text-white' : 'text-slate-500 dark:text-slate-400'} />
            <span>Enviar Correo</span>
          </Button>
        </fieldset>
      </div>
    </div>
  );
};
