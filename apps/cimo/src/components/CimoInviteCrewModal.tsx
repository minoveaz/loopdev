import React, { useState } from 'react';
import { Check, CheckCircle2, Send, Users, X } from 'lucide-react';
import type { CrewConnection } from '../data/mockCrewNetwork';

export interface CimoInviteCrewModalProps {
  isOpen: boolean;
  onClose: () => void;
  connections: CrewConnection[];
  targetActivityTitle?: string;
  targetSport?: string;
  onSendInvites: (invitedAthleteIds: string[]) => void;
}

export const CimoInviteCrewModal: React.FC<CimoInviteCrewModalProps> = ({
  isOpen,
  onClose,
  connections,
  targetActivityTitle = 'Próximo Entrenamiento',
  onSendInvites,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === connections.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(connections.map((c) => c.athlete.id));
    }
  };

  const handleSend = () => {
    if (selectedIds.length === 0) return;
    onSendInvites(selectedIds);
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setSelectedIds([]);
      onClose();
    }, 1800);
  };

  return (
    <div
      className="backdrop-blur-xs animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-[#1F4E5F]/60 p-4 duration-200"
      onClick={onClose}
    >
      <div
        className="animate-in zoom-in-95 relative flex w-full max-w-lg flex-col gap-5 rounded-3xl border border-[#1F4E5F]/15 bg-white p-6 text-[#1F4E5F] shadow-2xl duration-200 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1F4E5F]/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#7FB77E]/10 text-[#7FB77E]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#1F4E5F] sm:text-lg">
                Invitar a tu Crew Habitual
              </h3>
              <p className="mt-0.5 max-w-xs truncate text-xs font-medium text-[#1F4E5F]/70">
                {targetActivityTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full p-1.5 text-[#1F4E5F]/50 transition-colors hover:bg-[#F7F7F7] hover:text-[#1F4E5F]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success State */}
        {sentSuccess ? (
          <div className="animate-in fade-in flex flex-col items-center justify-center gap-3 py-10 text-center duration-200">
            <div className="flex h-14 w-14 scale-110 items-center justify-center rounded-full bg-[#7FB77E]/15 text-[#7FB77E]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-base font-black text-[#1F4E5F]">
                ¡Invitaciones enviadas con éxito!
              </h4>
              <p className="mt-1 text-xs font-medium text-[#1F4E5F]/70">
                Tus compañeros de Crew recibirán el enlace prioritario para unirse.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Quick Actions Bar */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1F4E5F]/60">
                Selecciona a quién quieres invitar:
              </span>
              <button
                type="button"
                onClick={handleSelectAll}
                className="cursor-pointer text-[11px] font-black text-[#7FB77E] hover:underline"
              >
                {selectedIds.length === connections.length
                  ? 'Deseleccionar todos'
                  : 'Seleccionar todos'}
              </button>
            </div>

            {/* Connections List */}
            <div className="flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
              {connections.map((conn) => {
                const isSelected = selectedIds.includes(conn.athlete.id);
                return (
                  <button
                    key={conn.id}
                    type="button"
                    onClick={() => toggleSelect(conn.athlete.id)}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-3 text-left transition-all ${
                      isSelected
                        ? 'shadow-xs border-transparent bg-[#1F4E5F] text-white ring-2 ring-[#7FB77E]/40'
                        : 'border-[#1F4E5F]/10 bg-[#F7F7F7] text-[#1F4E5F] hover:bg-white'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={conn.athlete.avatarUrl}
                        alt={conn.athlete.name}
                        className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white/50"
                      />
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-xs font-black">{conn.athlete.name}</span>
                          {conn.athlete.isCaptain && (
                            <span
                              className={`py-0.2 rounded-full px-1.5 text-[9px] font-black ${isSelected ? 'bg-white/20 text-white' : 'bg-[#7FB77E]/10 text-[#7FB77E]'}`}
                            >
                              Capitán
                            </span>
                          )}
                        </div>
                        <span
                          className={`mt-0.5 block truncate text-[10px] ${isSelected ? 'text-white/75' : 'text-[#1F4E5F]/60'}`}
                        >
                          {conn.stats.sharedWorkoutsCount} entrenos juntos • {conn.athlete.zone}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                        isSelected
                          ? 'border-[#7FB77E] bg-[#7FB77E] text-white'
                          : 'border-[#1F4E5F]/20 bg-white text-transparent'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 border-t border-[#1F4E5F]/10 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-full px-4 py-2 text-xs font-black text-[#1F4E5F]/70 transition-colors hover:bg-[#F7F7F7]"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={selectedIds.length === 0}
                onClick={handleSend}
                className={`flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black transition-all ${
                  selectedIds.length > 0
                    ? 'shadow-xs hover:scale-102 active:scale-98 bg-[#7FB77E] text-white hover:bg-[#6ea26d]'
                    : 'cursor-not-allowed bg-[#1F4E5F]/10 text-[#1F4E5F]/40'
                }`}
              >
                <Send className="h-3.5 w-3.5" />
                <span>
                  Enviar {selectedIds.length > 0 ? `${selectedIds.length} ` : ''}Invitación
                  {selectedIds.length === 1 ? '' : 'es'}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
