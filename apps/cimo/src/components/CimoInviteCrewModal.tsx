import React, { useState } from 'react';
import { Check, CheckCircle2, MapPin, Send, Sparkles, Users, X, Zap } from 'lucide-react';
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
  targetSport = 'running',
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F4E5F]/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#1F4E5F]/15 rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-7 flex flex-col gap-5 relative animate-in zoom-in-95 duration-200 text-[#1F4E5F]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#1F4E5F]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7FB77E]/10 text-[#7FB77E] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#1F4E5F]">
                Invitar a tu Crew Habitual
              </h3>
              <p className="text-xs text-[#1F4E5F]/70 font-medium mt-0.5 truncate max-w-xs">
                {targetActivityTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F7F7F7] text-[#1F4E5F]/50 hover:text-[#1F4E5F] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {sentSuccess ? (
          <div className="py-10 flex flex-col items-center justify-center text-center gap-3 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-full bg-[#7FB77E]/15 text-[#7FB77E] flex items-center justify-center scale-110">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-black text-[#1F4E5F]">
                ¡Invitaciones enviadas con éxito!
              </h4>
              <p className="text-xs text-[#1F4E5F]/70 font-medium mt-1">
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
                className="text-[11px] font-black text-[#7FB77E] hover:underline cursor-pointer"
              >
                {selectedIds.length === connections.length
                  ? 'Deseleccionar todos'
                  : 'Seleccionar todos'}
              </button>
            </div>

            {/* Connections List */}
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
              {connections.map((conn) => {
                const isSelected = selectedIds.includes(conn.athlete.id);
                return (
                  <button
                    key={conn.id}
                    type="button"
                    onClick={() => toggleSelect(conn.athlete.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#1F4E5F] text-white border-transparent shadow-xs ring-2 ring-[#7FB77E]/40'
                        : 'bg-[#F7F7F7] hover:bg-white border-[#1F4E5F]/10 text-[#1F4E5F]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={conn.athlete.avatarUrl}
                        alt={conn.athlete.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white/50"
                      />
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black truncate">{conn.athlete.name}</span>
                          {conn.athlete.isCaptain && (
                            <span
                              className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#7FB77E]/10 text-[#7FB77E]'}`}
                            >
                              Capitán
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-[10px] block truncate mt-0.5 ${isSelected ? 'text-white/75' : 'text-[#1F4E5F]/60'}`}
                        >
                          {conn.stats.sharedWorkoutsCount} entrenos juntos • {conn.athlete.zone}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                        isSelected
                          ? 'bg-[#7FB77E] border-[#7FB77E] text-white'
                          : 'border-[#1F4E5F]/20 bg-white text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 border-t border-[#1F4E5F]/10 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-black text-[#1F4E5F]/70 hover:bg-[#F7F7F7] cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={selectedIds.length === 0}
                onClick={handleSend}
                className={`px-5 py-2.5 rounded-full text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                  selectedIds.length > 0
                    ? 'bg-[#7FB77E] hover:bg-[#6ea26d] text-white shadow-xs hover:scale-102 active:scale-98'
                    : 'bg-[#1F4E5F]/10 text-[#1F4E5F]/40 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
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
