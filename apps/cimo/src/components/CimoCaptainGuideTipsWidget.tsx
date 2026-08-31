import React from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  Compass,
  Lightbulb,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';

export const CimoCaptainGuideTipsWidget: React.FC = () => {
  return (
    <aside className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-3.5 text-[#1F4E5F] w-full h-full overflow-y-auto" aria-label="Guía del Capitán">
      {/* 1. Cabecera */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1F4E5F]/8">
        <div className="flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-[#7FB77E]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
            Estudio del Capitán
          </span>
        </div>
        <span className="text-[9px] font-black text-[#7FB77E] bg-[#7FB77E]/10 px-2 py-0.2 rounded-full">
          Buenas Prácticas
        </span>
      </div>

      {/* 2. Los 4 Pilares de un Buen Entreno */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2.5">
        <span className="text-[10px] font-black uppercase text-[#1F4E5F]/60 tracking-wider">
          Guía del Capitán CIMO
        </span>

        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2 text-xs">
            <span className="w-4 h-4 rounded-full bg-[#7FB77E]/20 text-[#1F4E5F] text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div>
              <h4 className="text-[11px] font-black text-[#1F4E5F]">Punto de encuentro inconfundible</h4>
              <p className="text-[10px] text-[#1F4E5F]/65 mt-0.2 leading-tight">
                Elige una estatua o puerta reconocible.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs">
            <span className="w-4 h-4 rounded-full bg-[#7FB77E]/20 text-[#1F4E5F] text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div>
              <h4 className="text-[11px] font-black text-[#1F4E5F]">Ritmo claro y honesto</h4>
              <p className="text-[10px] text-[#1F4E5F]/65 mt-0.2 leading-tight">
                Declara el ritmo objetivo (ej. 5:15 min/km).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs">
            <span className="w-4 h-4 rounded-full bg-[#7FB77E]/20 text-[#1F4E5F] text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div>
              <h4 className="text-[11px] font-black text-[#1F4E5F]">Plazas reducidas (4 a 8)</h4>
              <p className="text-[10px] text-[#1F4E5F]/65 mt-0.2 leading-tight">
                Los micro-grupos facilitan la conversación y la amistad.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs">
            <span className="w-4 h-4 rounded-full bg-[#7FB77E]/20 text-[#1F4E5F] text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5">
              4
            </span>
            <div>
              <h4 className="text-[11px] font-black text-[#1F4E5F]">Tercer Tiempo social</h4>
              <p className="text-[10px] text-[#1F4E5F]/65 mt-0.2 leading-tight">
                Un café o caña para conectar tras la sesión.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Checklist de Publicación */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-[#1F4E5F]/60 tracking-wider">
          Checklist de Convocatoria
        </span>
        <div className="flex flex-col gap-1.5 text-[11px] font-bold text-[#1F4E5F]">
          <div className="flex items-center gap-2 p-1.5 bg-[#EEF2F2]/50 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#7FB77E]" />
            <span>Foto de alta calidad vinculada</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 bg-[#EEF2F2]/50 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#7FB77E]" />
            <span>Cupo máximo entre 4 y 8 plazas</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 bg-[#EEF2F2]/50 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#7FB77E]" />
            <span>Chat del Crew activado</span>
          </div>
        </div>
      </div>

      {/* 4. Garantía del Capitán */}
      <div className="p-3 bg-[#EEF2F2]/40 rounded-2xl border border-[#7FB77E]/20 text-[#1F4E5F] flex items-start gap-2.5 mt-auto">
        <ShieldCheck className="w-4 h-4 text-[#7FB77E] flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[11px] font-black text-[#1F4E5F]">Rol de Capitán CIMO</h4>
          <p className="text-[10px] text-[#1F4E5F]/75 leading-relaxed mt-0.5 font-medium">
            Tus entrenos suman puntos de reputación y desbloquean insignias exclusivas en tu pasaporte.
          </p>
        </div>
      </div>
    </aside>
  );
};
