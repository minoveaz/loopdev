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
    <aside className="h-full overflow-y-auto flex flex-col gap-3.5 text-[#1F4E5F] pr-0.5" aria-label="Vista Previa de la Tarjeta">
      <div className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#7FB77E] flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </span>
          <span className="text-[10px] font-bold text-[#1F4E5F]/60 bg-white px-2 py-0.5 rounded-full border border-[#1F4E5F]/8">
            Así se verá en el Feed
          </span>
        </div>

        {/* Tarjeta Mockup */}
        <div className="bg-white border border-[#1F4E5F]/10 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          {/* Imagen de Portada */}
          <div className="relative aspect-[16/9] w-full bg-[#1F4E5F]/5 overflow-hidden">
            <img
              src={formData.image || 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800'}
              alt={formData.title || 'Preview'}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-lg bg-[#1F4E5F]/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider">
              {formData.sport || 'Running'}
            </div>
            <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
              <Users className="w-3 h-3 text-[#7FB77E]" />
              1 / {formData.capacity || 6}
            </div>
          </div>

          {/* Contenido de la Tarjeta */}
          <div className="p-3.5 flex flex-col gap-2">
            <h4 className="font-black text-sm text-[#1F4E5F] line-clamp-1">
              {formData.title || 'Título de tu entrenamiento'}
            </h4>
            <p className="text-xs font-medium text-[#1F4E5F]/70 line-clamp-2">
              {formData.description || 'Describe la ruta, el objetivo y el ritmo para tus compañeros del Crew.'}
            </p>

            <div className="pt-2 border-t border-[#1F4E5F]/8 flex items-center justify-between text-[11px] text-[#1F4E5F]/75">
              <span className="flex items-center gap-1 font-bold">
                <Calendar className="w-3 h-3 text-[#7FB77E]" />
                {formData.date || 'Fecha'} • {formData.time || 'Hora'}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3 text-[#7FB77E]" />
                {formData.location || 'Ubicación'}
              </span>
            </div>

            {/* Fila del Capitán */}
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-[#1F4E5F]/20">
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[11px] font-bold text-[#1F4E5F]">Capitán {currentUser.name.split(' ')[0]}</span>
              </div>
              <span className="text-xs font-black text-[#7FB77E]">
                {formData.price === 'Gratis' || !formData.price ? 'Gratis' : formData.price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
