import React from 'react';
import {
  Activity,
  Calendar,
  Clock,
  Coffee,
  Eye,
  Flame,
  Layers,
  MapPin,
  Mountain,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import type { ActivityCardData } from '@loopdev/public-blocks';

export interface CimoLivePlanPreviewWidgetProps {
  formData: {
    sport: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    capacity: number;
    level: string;
    thirdHalfType: string;
    thirdHalfTitle: string;
    thirdHalfLocation: string;
    image: string;
    price: string;
  };
  currentUser: {
    name: string;
    avatarUrl?: string;
  };
}

export const CimoLivePlanPreviewWidget: React.FC<CimoLivePlanPreviewWidgetProps> = ({
  formData,
  currentUser,
}) => {
  return (
    <aside className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-3.5 text-[#1F4E5F] w-full h-full overflow-y-auto" aria-label="Vista Previa de la Tarjeta">
      {/* 1. Cabecera */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1F4E5F]/8">
        <div className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-[#7FB77E]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1F4E5F]">
            Live Preview
          </span>
        </div>
        <span className="text-[9px] font-black text-[#7FB77E] bg-[#7FB77E]/10 px-2 py-0.2 rounded-full">
          En Vivo
        </span>
      </div>

      {/* 2. Tarjeta Mockup */}
      <div className="bg-white border border-[#1F4E5F]/10 rounded-2xl overflow-hidden shadow-2xs flex flex-col">
        {/* Imagen de Portada */}
        <div className="relative aspect-[16/9] w-full bg-[#1F4E5F]/5 overflow-hidden">
          <img
            src={formData.image || 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800'}
            alt={formData.title || 'Preview'}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-[#1F4E5F]/85 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider">
            {formData.sport || 'Running'}
          </div>
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-white text-[9px] font-bold flex items-center gap-1">
            <Users className="w-3 h-3 text-[#7FB77E]" />
            1 / {formData.capacity || 6}
          </div>
        </div>

        {/* Contenido de la Tarjeta */}
        <div className="p-3 flex flex-col gap-1.5">
          <h4 className="font-black text-xs text-[#1F4E5F] line-clamp-1">
            {formData.title || 'Título de tu entrenamiento'}
          </h4>
          <p className="text-[11px] font-medium text-[#1F4E5F]/70 line-clamp-2 leading-tight">
            {formData.description || 'Describe la ruta, el objetivo y el ritmo para tus compañeros del Crew.'}
          </p>

          <div className="pt-1.5 border-t border-[#1F4E5F]/8 flex items-center justify-between text-[10px] text-[#1F4E5F]/75 font-bold">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#7FB77E]" />
              {formData.date || 'Fecha'} • {formData.time || 'Hora'}
            </span>
            <span className="flex items-center gap-1 truncate max-w-[110px]">
              <MapPin className="w-3 h-3 text-[#7FB77E] shrink-0" />
              <span className="truncate">{formData.location || 'Ubicación'}</span>
            </span>
          </div>

          <div className="pt-1.5 flex items-center justify-between text-[10px]">
            <span className="font-bold text-[#1F4E5F]">Capitán {currentUser.name.split(' ')[0]}</span>
            <span className="font-black text-[#7FB77E]">{formData.price || 'Gratis'}</span>
          </div>
        </div>
      </div>

      {/* 3. Estimación de Afinidad del Crew */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#1F4E5F]/8 shadow-2xs flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-[#1F4E5F]/60 tracking-wider">
            Estimación de Asistencia
          </span>
          <span className="text-[10px] font-black text-[#7FB77E]">94% Alta</span>
        </div>
        <div className="w-full bg-[#EEF2F2] h-2 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-[#7FB77E] to-[#1F4E5F] h-full rounded-full" style={{ width: '94%' }} />
        </div>
        <p className="text-[10px] text-[#1F4E5F]/70 font-medium leading-tight">
          Hay <strong>12 atletas activos</strong> en tu zona con ritmo compatible ({formData.level || 'Intermedio'}).
        </p>
      </div>

      {/* 4. Tercer Tiempo Seleccionado */}
      <div className="p-3 bg-[#EEF2F2]/40 rounded-2xl border border-[#7FB77E]/20 text-[#1F4E5F] flex items-center gap-2.5 mt-auto">
        <Coffee className="w-4 h-4 text-[#7FB77E] shrink-0" />
        <div>
          <span className="text-[10px] font-black text-[#7FB77E] uppercase block">Tercer Tiempo Social</span>
          <p className="text-[11px] font-black text-[#1F4E5F]">
            {formData.thirdHalfTitle || 'Café & Desayuno Post-Entreno'}
          </p>
        </div>
      </div>
    </aside>
  );
};
