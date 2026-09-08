import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

export interface UserProfileData {
  name: string;
  email: string;
  avatarUrl?: string;
  coverUrl?: string;
  city?: string;
  bio?: string;
  sports?: Array<{ sport: string; level: string; pace?: string }>;
  completedWorkouts?: number;
  totalKm?: number;
  rating?: number;
  reviewsCount?: number;
  streakWeeks?: number;
}

export interface CimoEditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfileData;
  onSave: (updated: UserProfileData) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
];

const AVAILABLE_SPORTS = [
  { id: 'Running', defaultLevel: 'Intermedio', defaultPace: '5:15 min/km' },
  { id: 'Pádel', defaultLevel: 'Nivel 3.5 (Intermedio)', defaultPace: 'Drive / Revés' },
  { id: 'Hiking', defaultLevel: 'Rutas 10-15 km', defaultPace: 'Desnivel medio' },
  { id: 'Crossfit', defaultLevel: 'RX / Scaled', defaultPace: '3 días/sem' },
  { id: 'Ciclismo', defaultLevel: 'Carretera 50-80 km', defaultPace: '26-28 km/h' },
];

export const CimoEditProfileModal: React.FC<CimoEditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [name, setName] = useState(user.name);
  const [city, setCity] = useState(user.city ?? 'Madrid, España');
  const [bio, setBio] = useState(
    user.bio ??
      'Apasionado del running matutino y las partidas de pádel. ¡Siempre dispuesto a sumar nuevos kilómetros!',
  );
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? AVATAR_PRESETS[0]);
  const [selectedSports, setSelectedSports] = useState<
    Array<{ sport: string; level: string; pace?: string }>
  >(
    user.sports ?? [
      { sport: 'Running', level: 'Intermedio (5-10K)', pace: '5:15 min/km' },
      { sport: 'Pádel', level: 'Nivel 3.5', pace: 'Derecha/Revés' },
      { sport: 'Hiking', level: 'Rutas 10-15 km', pace: 'Medio' },
    ],
  );

  if (!isOpen) return null;

  const handleToggleSport = (sportItem: (typeof AVAILABLE_SPORTS)[0]) => {
    if (selectedSports.some((s) => s.sport === sportItem.id)) {
      setSelectedSports(selectedSports.filter((s) => s.sport !== sportItem.id));
    } else {
      setSelectedSports([
        ...selectedSports,
        { sport: sportItem.id, level: sportItem.defaultLevel, pace: sportItem.defaultPace },
      ]);
    }
  };

  const handleUpdateSportPace = (sportName: string, newPace: string) => {
    setSelectedSports((prev) =>
      prev.map((s) => (s.sport === sportName ? { ...s, pace: newPace } : s)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...user,
      name: name.trim() || user.name,
      city: city.trim() || 'Madrid, España',
      bio: bio.trim(),
      avatarUrl,
      sports: selectedSports,
    });
    onClose();
  };

  return (
    <div className="backdrop-blur-xs animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-[#1F4E5F]/60 p-4 duration-200">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-y-auto rounded-3xl border border-[#1F4E5F]/15 bg-white text-[#1F4E5F] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#1F4E5F]/10 bg-white p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-black text-[#1F4E5F] sm:text-xl">
              Editar Perfil de Atleta
            </h2>
            <p className="mt-0.5 text-xs text-[#1F4E5F]/70">
              Personaliza tu identidad deportiva en la comunidad CIMO.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 text-[#1F4E5F]/60 transition-colors hover:bg-[#F7F7F7] hover:text-[#1F4E5F]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-5 sm:p-6">
          {/* Avatar Selector */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
              Foto de Perfil
            </label>
            <div className="flex items-center gap-4">
              <img
                src={avatarUrl}
                alt={name}
                className="h-16 w-16 shrink-0 rounded-full border-2 border-[#7FB77E] object-cover shadow-md"
              />
              <div className="flex flex-1 flex-col gap-1.5">
                <span className="text-[11px] font-extrabold text-[#1F4E5F]/70">
                  Elige un avatar o pega una URL:
                </span>
                <div className="flex items-center gap-2">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(preset)}
                      className={`h-8 w-8 cursor-pointer overflow-hidden rounded-full border-2 transition-all ${
                        avatarUrl === preset
                          ? 'scale-110 border-[#7FB77E] ring-2 ring-[#7FB77E]/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset}
                        alt={`Preset ${idx}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Name & City */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
                Nombre y Apellidos
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo"
                required
                className="w-full rounded-xl border border-[#1F4E5F]/20 bg-[#F7F7F7] px-4 py-2.5 text-xs font-bold text-[#1F4E5F] outline-none focus:border-[#7FB77E] focus:bg-white focus:ring-2 focus:ring-[#7FB77E]/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
                Ciudad Base
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ej: Madrid, España"
                required
                className="w-full rounded-xl border border-[#1F4E5F]/20 bg-[#F7F7F7] px-4 py-2.5 text-xs font-bold text-[#1F4E5F] outline-none focus:border-[#7FB77E] focus:bg-white focus:ring-2 focus:ring-[#7FB77E]/20"
              />
            </div>
          </div>

          {/* Sports & Levels */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
                Tus Deportes y Ritmos
              </label>
              <span className="text-[10px] font-bold text-[#7FB77E]">
                {selectedSports.length} seleccionados
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {AVAILABLE_SPORTS.map((sp) => {
                const isSelected = selectedSports.some((s) => s.sport === sp.id);
                const currentObj = selectedSports.find((s) => s.sport === sp.id);

                return (
                  <div
                    key={sp.id}
                    className={`flex flex-col gap-2 rounded-2xl border p-3 transition-all ${
                      isSelected
                        ? 'border-[#7FB77E] bg-[#7FB77E]/5'
                        : 'border-[#1F4E5F]/15 bg-[#F7F7F7]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleToggleSport(sp)}
                        className="flex cursor-pointer items-center gap-2 text-left"
                      >
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-md border text-xs ${
                            isSelected
                              ? 'border-[#7FB77E] bg-[#7FB77E] text-white'
                              : 'border-[#1F4E5F]/30 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-black text-[#1F4E5F]">{sp.id}</span>
                      </button>
                    </div>

                    {isSelected && (
                      <input
                        type="text"
                        value={currentObj?.pace ?? sp.defaultPace}
                        onChange={(e) => handleUpdateSportPace(sp.id, e.target.value)}
                        placeholder="Ej: 5:15 min/km o Nivel 3.5"
                        className="w-full rounded-lg border border-[#1F4E5F]/15 bg-white px-2.5 py-1 text-[11px] font-extrabold text-[#1F4E5F] outline-none focus:border-[#7FB77E]"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bio / Motivation */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
                Bio Deportiva & Motivación
              </label>
              <span className="text-[10px] font-bold text-[#1F4E5F]/50">{bio.length}/200</span>
            </div>
            <textarea
              rows={3}
              maxLength={200}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Cuéntale al Crew qué te gusta del deporte, tus metas o tu estilo de entrenamiento..."
              className="w-full resize-none rounded-2xl border border-[#1F4E5F]/20 bg-[#F7F7F7] p-3.5 text-xs font-bold leading-relaxed text-[#1F4E5F] outline-none focus:border-[#7FB77E] focus:bg-white focus:ring-2 focus:ring-[#7FB77E]/20"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-[#1F4E5F]/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full px-5 py-2.5 text-xs font-extrabold text-[#1F4E5F] transition-colors hover:bg-[#F7F7F7]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex cursor-pointer items-center gap-2 rounded-full bg-[#7FB77E] px-7 py-2.5 text-xs font-black text-white shadow-md transition-all hover:bg-[#6ea26d] active:scale-95"
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>Guardar Perfil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
