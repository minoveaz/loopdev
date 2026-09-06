import React, { useState } from 'react';
import { Camera, Check, MapPin, Sparkles, User, X } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F4E5F]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#1F4E5F]/15 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col text-[#1F4E5F]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#1F4E5F]/10 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#1F4E5F]">
              Editar Perfil de Atleta
            </h2>
            <p className="text-xs text-[#1F4E5F]/70 mt-0.5">
              Personaliza tu identidad deportiva en la comunidad CIMO.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F7F7F7] text-[#1F4E5F]/60 hover:text-[#1F4E5F] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 flex flex-col gap-6">
          {/* Avatar Selector */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]/70">
              Foto de Perfil
            </label>
            <div className="flex items-center gap-4">
              <img
                src={avatarUrl}
                alt={name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#7FB77E] shadow-md shrink-0"
              />
              <div className="flex flex-col gap-1.5 flex-1">
                <span className="text-[11px] font-extrabold text-[#1F4E5F]/70">
                  Elige un avatar o pega una URL:
                </span>
                <div className="flex items-center gap-2">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(preset)}
                      className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        avatarUrl === preset
                          ? 'border-[#7FB77E] ring-2 ring-[#7FB77E]/30 scale-110'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset}
                        alt={`Preset ${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Name & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="w-full px-4 py-2.5 rounded-xl border border-[#1F4E5F]/20 focus:border-[#7FB77E] focus:ring-2 focus:ring-[#7FB77E]/20 text-xs font-bold text-[#1F4E5F] outline-none bg-[#F7F7F7] focus:bg-white"
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
                className="w-full px-4 py-2.5 rounded-xl border border-[#1F4E5F]/20 focus:border-[#7FB77E] focus:ring-2 focus:ring-[#7FB77E]/20 text-xs font-bold text-[#1F4E5F] outline-none bg-[#F7F7F7] focus:bg-white"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_SPORTS.map((sp) => {
                const isSelected = selectedSports.some((s) => s.sport === sp.id);
                const currentObj = selectedSports.find((s) => s.sport === sp.id);

                return (
                  <div
                    key={sp.id}
                    className={`p-3 rounded-2xl border transition-all flex flex-col gap-2 ${
                      isSelected
                        ? 'border-[#7FB77E] bg-[#7FB77E]/5'
                        : 'border-[#1F4E5F]/15 bg-[#F7F7F7]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleToggleSport(sp)}
                        className="flex items-center gap-2 cursor-pointer text-left"
                      >
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center border text-xs ${
                            isSelected
                              ? 'bg-[#7FB77E] text-white border-[#7FB77E]'
                              : 'border-[#1F4E5F]/30 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
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
                        className="w-full px-2.5 py-1 text-[11px] font-extrabold rounded-lg border border-[#1F4E5F]/15 bg-white text-[#1F4E5F] outline-none focus:border-[#7FB77E]"
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
              className="w-full p-3.5 rounded-2xl border border-[#1F4E5F]/20 focus:border-[#7FB77E] focus:ring-2 focus:ring-[#7FB77E]/20 text-xs font-bold text-[#1F4E5F] outline-none bg-[#F7F7F7] focus:bg-white resize-none leading-relaxed"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F4E5F]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-extrabold text-[#1F4E5F] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-7 py-2.5 rounded-full text-xs font-black bg-[#7FB77E] hover:bg-[#6ea26d] text-white transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Guardar Perfil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
