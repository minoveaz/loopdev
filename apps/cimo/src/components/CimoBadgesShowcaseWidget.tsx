import React from 'react';
import {
  Award,
  Lock,
  ShieldCheck,
  Sunrise,
  Trophy,
} from 'lucide-react';

export interface CimoBadgesShowcaseWidgetProps {
  onNavigateToLeaderboard?: () => void;
}

export const CimoBadgesShowcaseWidget: React.FC<CimoBadgesShowcaseWidgetProps> = () => {
  return (
    <aside
      className="border-[#1F4E5F]/12 flex h-full w-full flex-col gap-3.5 overflow-y-auto rounded-3xl border bg-[#FCFDFD] p-5 text-[#1F4E5F] shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)]"
      aria-label="Insignias y Logros"
    >
      {/* 1. Cabecera */}
      <div className="border-[#1F4E5F]/8 flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-1.5">
          <Trophy className="h-3.5 w-3.5 text-[#E0A96D]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
            Vitrina de Insignias CIMO
          </span>
        </div>
        <span className="py-0.2 rounded-full bg-[#7FB77E]/10 px-2 text-[9px] font-black text-[#7FB77E]">
          3 Desbloqueadas
        </span>
      </div>

      {/* 2. Insignias Destacadas */}
      <div className="flex flex-col gap-2">
        {/* Badge 1 */}
        <div className="shadow-2xs flex items-start gap-2.5 rounded-2xl border border-amber-500/30 bg-white p-2.5">
          <div className="shrink-0 rounded-xl bg-amber-500/15 p-2 text-amber-700">
            <Award className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[#1F4E5F]">Capitán 5 Estrellas</h4>
              <span className="text-[9px] font-black text-amber-600">Completada</span>
            </div>
            <p className="mt-0.5 text-[10px] font-medium leading-tight text-[#1F4E5F]/70">
              5+ entrenos liderados con valoración de 4.8 o superior.
            </p>
          </div>
        </div>

        {/* Badge 2 */}
        <div className="shadow-2xs flex items-start gap-2.5 rounded-2xl border border-[#7FB77E]/30 bg-white p-2.5">
          <div className="shrink-0 rounded-xl bg-[#7FB77E]/20 p-2 text-[#1F4E5F]">
            <ShieldCheck className="h-4 w-4 text-[#1F4E5F]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[#1F4E5F]">Palabra de Honor</h4>
              <span className="text-[9px] font-black text-[#7FB77E]">Completada</span>
            </div>
            <p className="mt-0.5 text-[10px] font-medium leading-tight text-[#1F4E5F]/70">
              100% asistencia puntual a convocatorias confirmadas.
            </p>
          </div>
        </div>

        {/* Badge 3: En Progreso */}
        <div className="shadow-2xs flex items-start gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-2.5">
          <div className="relative shrink-0 rounded-xl bg-[#EEF2F2] p-2 text-[#1F4E5F]/60">
            <Sunrise className="h-4 w-4" />
            <Lock className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-white text-slate-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[#1F4E5F]">Club del Amanecer</h4>
              <span className="text-[9px] font-black text-[#1F4E5F]/60">2/3 Entrenos</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#EEF2F2]">
              <div className="h-full w-2/3 rounded-full bg-[#7FB77E]" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Progreso a Nivel Platino */}
      <div className="border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2 rounded-2xl border bg-white p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]/60">
            Siguiente Nivel: Platino
          </span>
          <span className="text-[10px] font-black text-[#7FB77E]">82%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F2]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7FB77E] to-[#E0A96D]"
            style={{ width: '82%' }}
          />
        </div>
        <p className="text-[10px] font-medium leading-tight text-[#1F4E5F]/70">
          Te faltan <strong>2 entrenos liderados</strong> para desbloquear la insignia de Capitán
          Leyenda.
        </p>
      </div>

      {/* 4. Garantía Deportiva */}
      <div className="mt-auto flex items-start gap-2.5 rounded-2xl border border-[#7FB77E]/20 bg-[#EEF2F2]/40 p-3 text-[#1F4E5F]">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#7FB77E]" />
        <div>
          <h4 className="text-[11px] font-black text-[#1F4E5F]">Pasaporte Certificado</h4>
          <p className="mt-0.5 text-[10px] font-medium leading-relaxed text-[#1F4E5F]/75">
            Tus insignias y marcas son verificadas automáticamente tras cada entrenamiento
            completado.
          </p>
        </div>
      </div>
    </aside>
  );
};
