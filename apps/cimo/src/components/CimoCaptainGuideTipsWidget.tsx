import React from 'react';
import {
  CheckCircle2,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react';

export const CimoCaptainGuideTipsWidget: React.FC = () => {
  return (
    <aside
      className="border-[#1F4E5F]/12 flex h-full w-full flex-col gap-3.5 overflow-y-auto rounded-3xl border bg-[#FCFDFD] p-5 text-[#1F4E5F] shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)]"
      aria-label="Guía del Capitán"
    >
      {/* 1. Cabecera */}
      <div className="border-[#1F4E5F]/8 flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-1.5">
          <Lightbulb className="h-3.5 w-3.5 text-[#7FB77E]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
            Estudio del Capitán
          </span>
        </div>
        <span className="py-0.2 rounded-full bg-[#7FB77E]/10 px-2 text-[9px] font-black text-[#7FB77E]">
          Buenas Prácticas
        </span>
      </div>

      {/* 2. Los 4 Pilares de un Buen Entreno */}
      <div className="border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2.5 rounded-2xl border bg-white p-3.5">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
          Guía del Capitán CIMO
        </span>

        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2 text-xs">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7FB77E]/20 text-[9px] font-black text-[#1F4E5F]">
              1
            </span>
            <div>
              <h4 className="text-[11px] font-black text-[#1F4E5F]">
                Punto de encuentro inconfundible
              </h4>
              <p className="mt-0.2 text-[10px] leading-tight text-[#1F4E5F]/65">
                Elige una estatua o puerta reconocible.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7FB77E]/20 text-[9px] font-black text-[#1F4E5F]">
              2
            </span>
            <div>
              <h4 className="text-[11px] font-black text-[#1F4E5F]">Ritmo claro y honesto</h4>
              <p className="mt-0.2 text-[10px] leading-tight text-[#1F4E5F]/65">
                Declara el ritmo objetivo (ej. 5:15 min/km).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7FB77E]/20 text-[9px] font-black text-[#1F4E5F]">
              3
            </span>
            <div>
              <h4 className="text-[11px] font-black text-[#1F4E5F]">Plazas reducidas (4 a 8)</h4>
              <p className="mt-0.2 text-[10px] leading-tight text-[#1F4E5F]/65">
                Los micro-grupos facilitan la conversación y la amistad.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7FB77E]/20 text-[9px] font-black text-[#1F4E5F]">
              4
            </span>
            <div>
              <h4 className="text-[11px] font-black text-[#1F4E5F]">Tercer Tiempo social</h4>
              <p className="mt-0.2 text-[10px] leading-tight text-[#1F4E5F]/65">
                Un café o caña para conectar tras la sesión.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Checklist de Publicación */}
      <div className="border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2 rounded-2xl border bg-white p-3.5">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
          Checklist de Convocatoria
        </span>
        <div className="flex flex-col gap-1.5 text-[11px] font-bold text-[#1F4E5F]">
          <div className="flex items-center gap-2 rounded-xl bg-[#EEF2F2]/50 p-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#7FB77E]" />
            <span>Foto de alta calidad vinculada</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[#EEF2F2]/50 p-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#7FB77E]" />
            <span>Cupo máximo entre 4 y 8 plazas</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[#EEF2F2]/50 p-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#7FB77E]" />
            <span>Chat del Crew activado</span>
          </div>
        </div>
      </div>

      {/* 4. Garantía del Capitán */}
      <div className="mt-auto flex items-start gap-2.5 rounded-2xl border border-[#7FB77E]/20 bg-[#EEF2F2]/40 p-3 text-[#1F4E5F]">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#7FB77E]" />
        <div>
          <h4 className="text-[11px] font-black text-[#1F4E5F]">Rol de Capitán CIMO</h4>
          <p className="mt-0.5 text-[10px] font-medium leading-relaxed text-[#1F4E5F]/75">
            Tus entrenos suman puntos de reputación y desbloquean insignias exclusivas en tu
            pasaporte.
          </p>
        </div>
      </div>
    </aside>
  );
};
