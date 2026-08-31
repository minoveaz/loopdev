import React from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  Heart,
  Lock,
  Medal,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Sunrise,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

export interface CimoBadgesShowcaseWidgetProps {
  onNavigateToLeaderboard?: () => void;
}

export const CimoBadgesShowcaseWidget: React.FC<CimoBadgesShowcaseWidgetProps> = () => {
  return (
    <aside className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-3.5 text-[#1F4E5F] w-full h-full overflow-y-auto" aria-label="Insignias y Logros">
      {/* 1. Cabecera */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1F4E5F]/8">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-[#E0A96D]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
            Vitrina de Insignias CIMO
          </span>
        </div>
        <span className="text-[9px] font-black text-[#7FB77E] bg-[#7FB77E]/10 px-2 py-0.2 rounded-full">
          3 Desbloqueadas
        </span>
      </div>

      {/* 2. Insignias Destacadas */}
      <div className="flex flex-col gap-2">
        {/* Badge 1 */}
        <div className="bg-white p-2.5 rounded-2xl border border-amber-500/30 flex items-start gap-2.5 shadow-2xs">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-700 shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[#1F4E5F]">Capitán 5 Estrellas</h4>
              <span className="text-[9px] font-black text-amber-600">Completada</span>
            </div>
            <p className="text-[10px] font-medium text-[#1F4E5F]/70 mt-0.5 leading-tight">
              5+ entrenos liderados con valoración de 4.8 o superior.
            </p>
          </div>
        </div>

        {/* Badge 2 */}
        <div className="bg-white p-2.5 rounded-2xl border border-[#7FB77E]/30 flex items-start gap-2.5 shadow-2xs">
          <div className="p-2 rounded-xl bg-[#7FB77E]/20 text-[#1F4E5F] shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#1F4E5F]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[#1F4E5F]">Palabra de Honor</h4>
              <span className="text-[9px] font-black text-[#7FB77E]">Completada</span>
            </div>
            <p className="text-[10px] font-medium text-[#1F4E5F]/70 mt-0.5 leading-tight">
              100% asistencia puntual a convocatorias confirmadas.
            </p>
          </div>
        </div>

        {/* Badge 3: En Progreso */}
        <div className="bg-white p-2.5 rounded-2xl border border-slate-200/80 flex items-start gap-2.5 shadow-2xs">
          <div className="p-2 rounded-xl bg-[#EEF2F2] text-[#1F4E5F]/60 shrink-0 relative">
            <Sunrise className="w-4 h-4" />
            <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1 text-slate-600 bg-white rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[#1F4E5F]">Club del Amanecer</h4>
              <span className="text-[9px] font-black text-[#1F4E5F]/60">2/3 Entrenos</span>
            </div>
            <div className="w-full h-1.5 bg-[#EEF2F2] rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-[#7FB77E] rounded-full w-2/3" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Progreso a Nivel Platino */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-[#1F4E5F]/60 tracking-wider">
            Siguiente Nivel: Platino
          </span>
          <span className="text-[10px] font-black text-[#7FB77E]">82%</span>
        </div>
        <div className="w-full bg-[#EEF2F2] h-2 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-[#7FB77E] to-[#E0A96D] h-full rounded-full" style={{ width: '82%' }} />
        </div>
        <p className="text-[10px] text-[#1F4E5F]/70 font-medium leading-tight">
          Te faltan <strong>2 entrenos liderados</strong> para desbloquear la insignia de Capitán Leyenda.
        </p>
      </div>

      {/* 4. Garantía Deportiva */}
      <div className="p-3 bg-[#EEF2F2]/40 rounded-2xl border border-[#7FB77E]/20 text-[#1F4E5F] flex items-start gap-2.5 mt-auto">
        <ShieldCheck className="w-4 h-4 text-[#7FB77E] flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[11px] font-black text-[#1F4E5F]">Pasaporte Certificado</h4>
          <p className="text-[10px] text-[#1F4E5F]/75 leading-relaxed mt-0.5 font-medium">
            Tus insignias y marcas son verificadas automáticamente tras cada entrenamiento completado.
          </p>
        </div>
      </div>
    </aside>
  );
};
