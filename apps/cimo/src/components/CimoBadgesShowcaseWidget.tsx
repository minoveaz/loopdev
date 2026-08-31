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
    <aside className="h-full overflow-y-auto flex flex-col gap-3.5 text-[#1F4E5F] pr-0.5" aria-label="Insignias y Logros">
      <div className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#7FB77E] flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" />
            Vitrina de Insignias CIMO
          </span>
          <span className="text-xs font-black text-[#1F4E5F]">3 Desbloqueadas</span>
        </div>

        <div className="flex flex-col gap-3">
          {/* Badge 1: Desbloqueada */}
          <div className="bg-white p-3 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-50/50 to-white flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-700 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[#1F4E5F]">Capitán 5 Estrellas</h4>
                <span className="text-[10px] font-black text-amber-600">Completada</span>
              </div>
              <p className="text-[11px] font-medium text-[#1F4E5F]/70 mt-0.5">
                5+ entrenos liderados con valoración media de 4.8 o superior.
              </p>
            </div>
          </div>

          {/* Badge 2: Desbloqueada */}
          <div className="bg-white p-3 rounded-2xl border border-[#7FB77E]/30 bg-gradient-to-r from-emerald-50/50 to-white flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#7FB77E]/20 text-[#1F4E5F] shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#1F4E5F]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[#1F4E5F]">Palabra de Honor</h4>
                <span className="text-[10px] font-black text-[#7FB77E]">Completada</span>
              </div>
              <p className="text-[11px] font-medium text-[#1F4E5F]/70 mt-0.5">
                100% de asistencia puntual a todas las convocatorias confirmadas.
              </p>
            </div>
          </div>

          {/* Badge 3: En Progreso (Bloqueada) */}
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 flex items-start gap-3 opacity-80">
            <div className="p-2.5 rounded-xl bg-slate-200/80 text-slate-500 shrink-0 relative">
              <Sunrise className="w-5 h-5" />
              <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1 text-slate-600 bg-white rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-700">Club del Amanecer</h4>
                <span className="text-[10px] font-black text-slate-500">2/3 Entrenos</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                Entrena 3 veces antes de las 8:00 AM.
              </p>
              {/* Barra de Progreso */}
              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
