import React from 'react';
import {
  Award,
  CheckCircle2,
  Compass,
  Heart,
  HelpCircle,
  Lightbulb,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';

export const CimoCaptainGuideTipsWidget: React.FC = () => {
  return (
    <aside className="h-full flex flex-col gap-5 text-[#1F4E5F]" aria-label="Guía del Capitán">
      <div className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-[#7FB77E]/20 text-[#1F4E5F]">
            <Lightbulb className="w-4 h-4 text-[#1F4E5F]" />
          </span>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#7FB77E] block">
              Buenas Prácticas
            </span>
            <h3 className="font-black text-sm text-[#1F4E5F]">Guía del Capitán CIMO</h3>
          </div>
        </div>

        <p className="text-xs font-medium text-[#1F4E5F]/75 leading-relaxed">
          Como Capitán, tú marcas el tono y la energía del grupo. Sigue estos 4 pilares para una convocatoria exitosa:
        </p>

        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-start gap-2.5 bg-white p-3 rounded-2xl border border-[#1F4E5F]/8">
            <span className="w-5 h-5 rounded-full bg-[#7FB77E]/20 text-[#1F4E5F] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div>
              <h4 className="text-xs font-black text-[#1F4E5F]">Punto de encuentro inconfundible</h4>
              <p className="text-[11px] font-medium text-[#1F4E5F]/70 mt-0.5">
                Elige una estatua, fuente o puerta reconocible para que nadie se pierda.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-white p-3 rounded-2xl border border-[#1F4E5F]/8">
            <span className="w-5 h-5 rounded-full bg-[#7FB77E]/20 text-[#1F4E5F] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div>
              <h4 className="text-xs font-black text-[#1F4E5F]">Ritmo claro y honesto</h4>
              <p className="text-[11px] font-medium text-[#1F4E5F]/70 mt-0.5">
                Especifica si el entreno es suave o exigente para asegurar que el grupo vaya unido.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-white p-3 rounded-2xl border border-[#1F4E5F]/8">
            <span className="w-5 h-5 rounded-full bg-[#7FB77E]/20 text-[#1F4E5F] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div>
              <h4 className="text-xs font-black text-[#1F4E5F]">Plazas reducidas (4 a 8)</h4>
              <p className="text-[11px] font-medium text-[#1F4E5F]/70 mt-0.5">
                Los micro-grupos facilitan la conversación y generan conexiones reales de amistad.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-white p-3 rounded-2xl border border-[#1F4E5F]/8">
            <span className="w-5 h-5 rounded-full bg-[#7FB77E]/20 text-[#1F4E5F] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
              4
            </span>
            <div>
              <h4 className="text-xs font-black text-[#1F4E5F]">Tercer Tiempo social</h4>
              <p className="text-[11px] font-medium text-[#1F4E5F]/70 mt-0.5">
                Un café o refrigerio post-entreno es donde se forja la comunidad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
