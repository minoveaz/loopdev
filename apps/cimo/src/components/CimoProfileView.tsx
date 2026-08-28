import React from 'react';
import { Award, CheckCircle2, Flame, MapPin, Trophy, Users } from 'lucide-react';

export interface CimoProfileViewProps {
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
    city?: string;
    profession?: string;
    bio?: string;
    sports?: Array<{ sport: string; level: string }>;
    completedWorkouts?: number;
  };
  onEditProfile?: () => void;
}

export const CimoProfileView: React.FC<CimoProfileViewProps> = ({ user }) => {
  return (
    <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 shadow-xs flex flex-col gap-6 text-[#1F4E5F]">
      {/* Header Profile Info */}
      <div className="flex items-center gap-4 pb-4 border-b border-[#1F4E5F]/10">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#1F4E5F]/20 shadow-inner"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[#1F4E5F] text-white font-black text-xl flex items-center justify-center shadow-xs">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#1F4E5F]">{user.name}</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#7FB77E]/20 text-[#1F4E5F] border border-[#7FB77E]/30">
              Verificado
            </span>
          </div>
          <p className="text-xs text-[#1F4E5F]/70 mt-0.5">{user.profession ?? 'Deportista CIMO'}</p>
          <div className="flex items-center gap-1.5 text-xs text-[#1F4E5F]/60 mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#7FB77E]" />
            <span>{user.city ?? 'Madrid, España'}</span>
          </div>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/5 text-center">
          <Flame className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <span className="text-lg font-black text-[#1F4E5F] block">{user.completedWorkouts ?? 12}</span>
          <span className="text-[10px] font-bold text-[#1F4E5F]/60 uppercase">Entrenos</span>
        </div>
        <div className="p-3.5 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/5 text-center">
          <Users className="w-5 h-5 text-[#7FB77E] mx-auto mb-1" />
          <span className="text-lg font-black text-[#1F4E5F] block">14</span>
          <span className="text-[10px] font-bold text-[#1F4E5F]/60 uppercase">Compañeros</span>
        </div>
        <div className="p-3.5 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/5 text-center">
          <Trophy className="w-5 h-5 text-[#00B894] mx-auto mb-1" />
          <span className="text-lg font-black text-[#1F4E5F] block">100%</span>
          <span className="text-[10px] font-bold text-[#1F4E5F]/60 uppercase">Puntualidad</span>
        </div>
      </div>

      {/* Sports & Levels */}
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#1F4E5F] block mb-2.5">
          Mis Deportes & Niveles
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(user.sports ?? [
            { sport: 'Running', level: 'Intermedio (5-10K)' },
            { sport: 'Pádel', level: 'Intermedio (Nivel 3.5)' },
            { sport: 'Hiking', level: 'Principiante' },
          ]).map((s, idx) => (
            <div key={idx} className="p-3 bg-[#F7F7F7] rounded-xl border border-[#1F4E5F]/5">
              <span className="text-xs font-extrabold text-[#1F4E5F] block">{s.sport}</span>
              <span className="text-[11px] text-[#7FB77E] font-bold block mt-0.5">{s.level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation Prompts */}
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#1F4E5F] block mb-2.5">
          Sobre mi estilo de entrenamiento
        </span>
        <div className="flex flex-col gap-2.5">
          <div className="p-3.5 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/5">
            <span className="text-[10px] font-extrabold uppercase text-[#7FB77E] block">
              Mi entrenamiento favorito es...
            </span>
            <p className="text-xs text-[#1F4E5F] mt-1 font-medium">
              Correr 8k al atardecer por el Parque del Retiro y estirar escuchando música.
            </p>
          </div>
          <div className="p-3.5 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/5">
            <span className="text-[10px] font-extrabold uppercase text-[#7FB77E] block">
              Después de entrenar siempre...
            </span>
            <p className="text-xs text-[#1F4E5F] mt-1 font-medium">
              Parar a tomar un café o zumo natural con el Crew para charlar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
