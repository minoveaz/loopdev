import React, { useState } from 'react';
import {
  Activity,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Coffee,
  Eye,
  Flame,
  Footprints,
  Info,
  Layers,
  Lightbulb,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { TennisBallIcon } from './CimoCreatePlanView';

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
    thirdHalfType?: string;
    thirdHalfTitle?: string;
    thirdHalfLocation?: string;
    image?: string;
    price?: string;
    instructions?: string;
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
  const [activeTab, setActiveTab] = useState<'preview' | 'assistant'>('preview');
  const [previewCardFormat, setPreviewCardFormat] = useState<'feed' | 'story'>('feed');

  // Dynamic attractiveness score calculation
  const hasGoodDescription = (formData.description || '').trim().length > 30;
  const hasThirdHalf = Boolean(formData.thirdHalfLocation || formData.thirdHalfTitle);
  const hasIdealCapacity = formData.capacity >= 4 && formData.capacity <= 8;
  const hasCustomOrRealPhoto = Boolean(formData.image);

  let score = 40;
  if (hasGoodDescription) score += 15;
  if (hasThirdHalf) score += 20;
  if (hasIdealCapacity) score += 15;
  if (hasCustomOrRealPhoto) score += 10;

  const scoreColor =
    score >= 85 ? 'text-[#7FB77E]' : score >= 70 ? 'text-[#1F4E5F]' : 'text-amber-600';
  const scoreBadgeBg =
    score >= 85 ? 'bg-[#7FB77E]/15 text-[#2E7D32]' : score >= 70 ? 'bg-[#1F4E5F]/10 text-[#1F4E5F]' : 'bg-amber-50 text-amber-700';

  const sportIcon =
    formData.sport?.toLowerCase() === 'padel' ? (
      <TennisBallIcon className="w-3.5 h-3.5" />
    ) : formData.sport?.toLowerCase() === 'hiking' ? (
      <Footprints className="w-3.5 h-3.5" />
    ) : (
      <Flame className="w-3.5 h-3.5" />
    );

  return (
    <aside
      className="bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] flex flex-col gap-4 text-[#1F4E5F] w-full h-full overflow-y-auto"
      aria-label="Co-Piloto del Capitán y Live Preview"
    >
      {/* 1. Cabecera con Segmented Control */}
      <div className="flex flex-col gap-2.5 pb-3 border-b border-[#1F4E5F]/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#7FB77E]/20 text-[#7FB77E] flex items-center justify-center shrink-0">
              <Zap className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F] block leading-none">
                Co-Piloto del Capitán
              </span>
              <span className="text-[10px] text-[#1F4E5F]/60 font-medium">Asistencia en tiempo real</span>
            </div>
          </div>

          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${scoreBadgeBg}`}>
            {score}% Atractivo
          </span>
        </div>

        {/* Selector de Pestañas: Live Preview vs Asistente & Demanda */}
        <div className="grid grid-cols-2 p-1 bg-[#F7F7F7] rounded-2xl border border-[#1F4E5F]/10">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-white text-[#1F4E5F] shadow-2xs border border-[#1F4E5F]/10'
                : 'text-[#1F4E5F]/60 hover:text-[#1F4E5F]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('assistant')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'assistant'
                ? 'bg-white text-[#1F4E5F] shadow-2xs border border-[#1F4E5F]/10'
                : 'text-[#1F4E5F]/60 hover:text-[#1F4E5F]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Demanda & Tips</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📱 PESTAÑA 1: LIVE PREVIEW (SIMULADOR MÓVIL)                              */}
      {/* ========================================================================= */}
      {activeTab === 'preview' && (
        <div className="flex flex-col gap-3.5 animate-in fade-in zoom-in-98 duration-150">
          {/* Format Sub-Toggle: Feed vs Story */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-extrabold text-[#1F4E5F]/70">Formato simulado:</span>
            <div className="flex items-center gap-1 bg-[#EEF2F2]/60 p-0.5 rounded-lg border border-[#1F4E5F]/10">
              <button
                type="button"
                onClick={() => setPreviewCardFormat('feed')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                  previewCardFormat === 'feed' ? 'bg-white text-[#1F4E5F] shadow-2xs' : 'text-[#1F4E5F]/60'
                }`}
              >
                Feed Móvil
              </button>
              <button
                type="button"
                onClick={() => setPreviewCardFormat('story')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                  previewCardFormat === 'story' ? 'bg-white text-[#1F4E5F] shadow-2xs' : 'text-[#1F4E5F]/60'
                }`}
              >
                Tarjeta Story
              </button>
            </div>
          </div>

          {/* Tarjeta Mockup Realista de CIMO */}
          <div className="bg-white border border-[#1F4E5F]/15 rounded-3xl overflow-hidden shadow-xs flex flex-col transition-all hover:border-[#7FB77E]/50">
            {/* Imagen de Portada con Badges */}
            <div className={`relative w-full bg-[#1F4E5F]/5 overflow-hidden ${previewCardFormat === 'story' ? 'aspect-[4/3]' : 'aspect-[16/9]'}`}>
              <img
                src={
                  formData.image ||
                  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=800'
                }
                alt={formData.title || 'Preview'}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              {/* Top Badges */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#1F4E5F] text-[10px] font-black uppercase tracking-wider shadow-2xs">
                  {sportIcon}
                  <span>{formData.sport || 'Running'}</span>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#7FB77E]" />
                  <span>1 / {formData.capacity || 6}</span>
                </div>
              </div>

              {/* Bottom Image Overlay: Title & Ritmo */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-col text-white">
                <span className="text-[10px] font-black text-[#7FB77E] uppercase tracking-wider flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  <span>{formData.level || 'Ritmo Medio'}</span>
                </span>
                <h4 className="font-black text-sm leading-tight text-white line-clamp-1 drop-shadow-xs">
                  {formData.title || 'Título de tu entrenamiento'}
                </h4>
              </div>
            </div>

            {/* Contenido de la Tarjeta */}
            <div className="p-4 flex flex-col gap-2.5">
              <p className="text-xs font-medium text-[#1F4E5F]/75 line-clamp-2 leading-relaxed">
                {formData.description || 'Describe la ruta, el objetivo y el ritmo para tus compañeros del Crew.'}
              </p>

              {/* Metadatos: Fecha, Hora y Punto */}
              <div className="pt-2 border-t border-[#1F4E5F]/8 flex flex-col gap-1.5 text-xs text-[#1F4E5F]/85 font-bold">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#7FB77E]" />
                    <span>{formData.date || 'Fecha'} • {formData.time || 'Hora'}h</span>
                  </span>
                  <span className="text-[11px] font-black text-[#7FB77E] bg-[#7FB77E]/10 px-2 py-0.2 rounded-full">
                    {formData.price || 'Gratis'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 truncate text-[11px] text-[#1F4E5F]/70">
                  <MapPin className="w-3.5 h-3.5 text-[#7FB77E] shrink-0" />
                  <span className="truncate">{formData.location || 'Lugar de encuentro'}</span>
                </div>
              </div>

              {/* Tercer Tiempo Pill si está activo */}
              {hasThirdHalf && (
                <div className="p-2.5 bg-[#EEF2F2] rounded-2xl border border-[#7FB77E]/30 flex items-center gap-2 text-xs">
                  <Coffee className="w-4 h-4 text-[#1F4E5F] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase text-[#1F4E5F]/60 block leading-tight">
                      Tercer Tiempo Social
                    </span>
                    <span className="font-extrabold text-[#1F4E5F] truncate block leading-tight">
                      {formData.thirdHalfLocation || formData.thirdHalfTitle || 'Café & Desayuno Post-Entreno'}
                    </span>
                  </div>
                </div>
              )}

              {/* Capitán Organizer Footer */}
              <div className="pt-2 border-t border-[#1F4E5F]/8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#7FB77E] text-white text-[10px] font-black flex items-center justify-center">
                    {currentUser.name[0]}
                  </div>
                  <span className="text-xs font-bold text-[#1F4E5F]">
                    Capitán {currentUser.name.split(' ')[0]}
                  </span>
                </div>
                <span className="text-[10px] font-extrabold text-[#7FB77E] bg-[#7FB77E]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#7FB77E]" />
                  <span>Verificado</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ⚡ PESTAÑA 2: ASISTENTE & DEMANDA COMUNITARIA                             */}
      {/* ========================================================================= */}
      {activeTab === 'assistant' && (
        <div className="flex flex-col gap-3.5 animate-in fade-in zoom-in-98 duration-150">
          {/* Score Card */}
          <div className="bg-white p-4 rounded-3xl border border-[#1F4E5F]/12 shadow-2xs flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
                Nivel de Atractivo del Plan
              </span>
              <span className={`text-base font-black ${scoreColor}`}>{score}%</span>
            </div>

            {/* Barra de progreso */}
            <div className="w-full bg-[#EEF2F2] h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-[#7FB77E] to-[#1F4E5F] h-full rounded-full transition-all duration-500"
                style={{ width: `${score}%` }}
              />
            </div>

            {/* Checklist items */}
            <div className="flex flex-col gap-1.5 pt-1.5 text-[11px] font-bold">
              <div className="flex items-center justify-between">
                <span className="text-[#1F4E5F]/75">Descripción completa:</span>
                <span className={hasGoodDescription ? 'text-[#7FB77E] font-black' : 'text-[#1F4E5F]/40'}>
                  {hasGoodDescription ? '✓ +15%' : 'Pendiente'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#1F4E5F]/75">Tercer Tiempo incluido:</span>
                <span className={hasThirdHalf ? 'text-[#7FB77E] font-black' : 'text-[#1F4E5F]/40'}>
                  {hasThirdHalf ? '✓ +20%' : 'Pendiente (+20%)'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#1F4E5F]/75">Grupo óptimo (4-8 plazas):</span>
                <span className={hasIdealCapacity ? 'text-[#7FB77E] font-black' : 'text-[#1F4E5F]/40'}>
                  {hasIdealCapacity ? '✓ +15%' : 'Pendiente'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#1F4E5F]/75">Foto real de portada:</span>
                <span className={hasCustomOrRealPhoto ? 'text-[#7FB77E] font-black' : 'text-[#1F4E5F]/40'}>
                  {hasCustomOrRealPhoto ? '✓ +10%' : 'Pendiente'}
                </span>
              </div>
            </div>
          </div>

          {/* Demanda en tu Zona */}
          <div className="bg-white p-4 rounded-3xl border border-[#1F4E5F]/12 shadow-2xs flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#7FB77E]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
                Demanda en {formData.location ? formData.location.split(',')[0] : 'tu zona'}
              </span>
            </div>

            <div className="p-3 bg-[#EEF2F2]/60 rounded-2xl border border-[#1F4E5F]/8 flex flex-col gap-1">
              <span className="text-[11px] font-black text-[#1F4E5F]">
                🔥 Horarios con más éxito en {formData.sport || 'este deporte'}:
              </span>
              <p className="text-[11px] text-[#1F4E5F]/70 font-medium leading-relaxed">
                Las convocatorias entre las <strong>19:00h y 20:30h</strong> se llenan en menos de <strong>2 horas</strong> de media.
              </p>
            </div>

            <div className="p-3 bg-[#7FB77E]/10 rounded-2xl border border-[#7FB77E]/25 flex flex-col gap-1">
              <span className="text-[11px] font-black text-[#1F4E5F] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#7FB77E]" />
                <span>Atletas afines activos:</span>
              </span>
              <p className="text-[11px] text-[#1F4E5F]/75 font-medium leading-relaxed">
                Hay <strong>~18 miembros de la comunidad</strong> con ritmo <em>{formData.level || 'intermedio'}</em> buscando quedadas en tu municipio esta semana.
              </p>
            </div>
          </div>

          {/* Consejos Proactivos del Capitán */}
          <div className="p-3.5 bg-gradient-to-br from-[#1F4E5F] to-[#163844] rounded-3xl text-white flex flex-col gap-2 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-black text-[#7FB77E]">
              <Lightbulb className="w-4 h-4 text-[#7FB77E]" />
              <span>Tip de Capitán CIMO</span>
            </div>
            <p className="text-[11px] text-white/85 font-medium leading-relaxed">
              {!hasThirdHalf
                ? 'Las quedadas que incluyen un café o cañas post-entreno reciben un 40% más de solicitudes de atletas nuevos.'
                : 'Puntualidad británica: cita al grupo 5 minutos antes para saludar y empezar a entrenar sin retrasos.'}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};
