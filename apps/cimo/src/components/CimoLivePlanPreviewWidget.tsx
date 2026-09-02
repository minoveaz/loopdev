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
  Heart,
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
  hideHeader?: boolean;
}

export const CimoLivePlanPreviewWidget: React.FC<CimoLivePlanPreviewWidgetProps> = ({
  formData,
  currentUser,
  hideHeader = false,
}) => {
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
    score >= 85
      ? 'bg-[#7FB77E]/15 text-[#2E7D32]'
      : score >= 70
        ? 'bg-[#1F4E5F]/10 text-[#1F4E5F]'
        : 'bg-amber-50 text-amber-700';

  const sportIcon =
    formData.sport?.toLowerCase() === 'padel' ? (
      <TennisBallIcon className="w-3.5 h-3.5" />
    ) : formData.sport?.toLowerCase() === 'hiking' ? (
      <Footprints className="w-3.5 h-3.5" />
    ) : (
      <Flame className="w-3.5 h-3.5" />
    );

  const safeImageSrc = React.useMemo(() => {
    const raw = (formData.image || '').trim();
    if (
      raw &&
      (raw.startsWith('https://') || raw.startsWith('http://') || raw.startsWith('data:image/'))
    ) {
      return raw;
    }
    return 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=800';
  }, [formData.image]);

  const safeTitle = (formData.title || 'Título de tu entrenamiento').replace(/[<>&"']/g, '');
  const safeLocation = (formData.location || 'Punto de encuentro').replace(/[<>&"']/g, '');
  const safeDescription = (
    formData.description || 'Describe la ruta, el objetivo y el ritmo para tus compañeros del Crew.'
  ).replace(/[<>&"']/g, '');
  const safeThirdHalf = (
    formData.thirdHalfLocation ||
    formData.thirdHalfTitle ||
    'Café & Charla Post-Entreno'
  ).replace(/[<>&"']/g, '');
  const safeLevel = (formData.level || 'Intermedio').replace(/[<>&"']/g, '');
  const safeSport = (formData.sport || 'Running').replace(/[<>&"']/g, '');

  return (
    <aside
      className={`flex flex-col gap-5 text-[#1F4E5F] w-full ${
        hideHeader
          ? 'bg-transparent border-0 p-0 shadow-none'
          : 'bg-[#FCFDFD] border border-[#1F4E5F]/12 rounded-3xl p-5 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)] h-full overflow-y-auto'
      }`}
      aria-label="Co-Piloto del Capitán y Live Preview"
    >
      {/* 1. Cabecera Principal (Desktop / Full view only) */}
      {!hideHeader && (
        <div className="flex items-center justify-between pb-3 border-b border-[#1F4E5F]/10">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#7FB77E]/20 text-[#7FB77E] flex items-center justify-center shrink-0 shadow-2xs">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F] block leading-none">
                Co-Piloto del Capitán
              </span>
              <span className="text-[10px] text-[#1F4E5F]/60 font-medium mt-0.5 block">
                Asistencia & Live Preview
              </span>
            </div>
          </div>

          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${scoreBadgeBg}`}>
            {score}% Atractivo
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📱 SECCIÓN 1: LIVE PREVIEW (SIMULADOR MÓVIL)                              */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
            <Smartphone className="w-3.5 h-3.5 text-[#7FB77E]" />
            <span>Simulador Móvil en Vivo</span>
          </div>

          <div className="flex items-center gap-1 bg-[#EEF2F2]/60 p-0.5 rounded-lg border border-[#1F4E5F]/10">
            <button
              type="button"
              onClick={() => setPreviewCardFormat('feed')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                previewCardFormat === 'feed'
                  ? 'bg-white text-[#1F4E5F] shadow-2xs'
                  : 'text-[#1F4E5F]/60'
              }`}
            >
              Feed
            </button>
            <button
              type="button"
              onClick={() => setPreviewCardFormat('story')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                previewCardFormat === 'story'
                  ? 'bg-white text-[#1F4E5F] shadow-2xs'
                  : 'text-[#1F4E5F]/60'
              }`}
            >
              Story
            </button>
          </div>
        </div>

        {/* Tarjeta Mockup Realista de CIMO (Idéntica al Feed Principal) */}
        <div className="bg-white border border-[#1F4E5F]/15 rounded-3xl overflow-hidden shadow-xs flex flex-col transition-all hover:border-[#7FB77E]/50 group">
          {/* 1. Imagen de Portada con Badges y Título */}
          <div
            className={`relative w-full bg-[#1F4E5F]/5 overflow-hidden ${previewCardFormat === 'story' ? 'aspect-[4/3]' : 'aspect-[16/9]'}`}
          >
            <img
              src={safeImageSrc}
              alt={safeTitle}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Top Tags */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-full font-black text-xs bg-white/95 text-[#1F4E5F] shadow-xs flex items-center gap-1.5 backdrop-blur-md">
                {sportIcon}
                <span className="capitalize">{safeSport}</span>
              </span>
              <span className="px-2 py-0.8 rounded-full text-[10px] font-black bg-black/60 text-white backdrop-blur-md border border-white/10">
                {safeLevel}
              </span>
            </div>

            {/* Favorite Heart Button */}
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md">
              <Heart className="w-4 h-4 fill-transparent text-white" />
            </div>

            {/* Title on the Cover Overlay */}
            <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
              <h3 className="font-black text-base leading-tight drop-shadow-xs line-clamp-1">
                {safeTitle}
              </h3>
            </div>
          </div>

          {/* 2. Cuerpo de la Tarjeta */}
          <div className="p-4 sm:p-5 flex flex-col gap-3 text-[#1F4E5F]">
            {/* Logistics Row: Location & Date/Time */}
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-600 font-bold gap-2">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#7FB77E] shrink-0" />
                  <span className="truncate">{safeLocation}</span>
                </div>
                <div className="flex items-center gap-1 font-black text-[#1F4E5F] shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-[#7FB77E]" />
                  <span>
                    {formData.date || 'Fecha'}, {formData.time || '19:30'}h
                  </span>
                </div>
              </div>

              {/* Pace / Level Line */}
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>
                  Ritmo: <strong>{safeLevel}</strong>
                </span>
              </div>

              {/* Description preview */}
              <p className="text-xs font-medium text-slate-600 line-clamp-2 leading-relaxed mt-0.5">
                {safeDescription}
              </p>
            </div>

            {/* 3. Compact 1-Line Third Half Pill (Social Blue) */}
            {hasThirdHalf && (
              <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#1F4E5F] bg-[#EEF2F2]/70 px-3 py-1.5 rounded-xl border border-[#1F4E5F]/15">
                <div className="flex items-center gap-1.5 truncate">
                  <Coffee className="w-3.5 h-3.5 text-[#1F4E5F] shrink-0" />
                  <span className="truncate">
                    <strong>Tercer Tiempo:</strong> {safeThirdHalf}
                  </span>
                </div>
                <span className="text-[9px] font-black uppercase text-white bg-[#1F4E5F] px-1.5 py-0.2 rounded-md shrink-0">
                  Social
                </span>
              </div>
            )}

            {/* 4. Footer: Crew Avatars + Action Button */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#7FB77E] text-white text-xs font-black flex items-center justify-center ring-2 ring-white shadow-2xs">
                  {currentUser.name[0]}
                </div>
                <div>
                  <span className="text-xs font-black text-[#1F4E5F] block leading-none">
                    1/{formData.capacity || 6}
                  </span>
                  <span className="text-[10px] font-bold text-[#7FB77E] block mt-0.5">
                    {(formData.capacity || 6) - 1} libre(s)
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="w-28 py-2 rounded-xl text-xs font-black bg-[#7FB77E] text-white flex items-center justify-center gap-1.5 shadow-xs cursor-default">
                <span>Unirme</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ⚡ SECCIÓN 2: SCORE DE ATRACTIVO & CHECKLIST DINÁMICO                     */}
      {/* ========================================================================= */}
      <div className="bg-white p-4 rounded-3xl border border-[#1F4E5F]/12 shadow-2xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
            Score de Atractivo del Plan
          </span>
          <span className={`text-sm font-black ${scoreColor}`}>{score}%</span>
        </div>

        {/* Barra de progreso con gradiente */}
        <div className="w-full bg-[#EEF2F2] h-2.5 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-[#7FB77E] to-[#1F4E5F] h-full rounded-full transition-all duration-500"
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Checklist en vivo */}
        <div className="flex flex-col gap-1.5 pt-1 text-[11px] font-bold">
          <div className="flex items-center justify-between">
            <span className="text-[#1F4E5F]/75">Descripción completa:</span>
            <span
              className={hasGoodDescription ? 'text-[#7FB77E] font-black' : 'text-[#1F4E5F]/40'}
            >
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
            <span
              className={hasCustomOrRealPhoto ? 'text-[#7FB77E] font-black' : 'text-[#1F4E5F]/40'}
            >
              {hasCustomOrRealPhoto ? '✓ +10%' : 'Pendiente'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📈 SECCIÓN 3: DEMANDA COMUNITARIA EN TU ZONA                              */}
      {/* ========================================================================= */}
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
            Las convocatorias entre las <strong>19:00h y 20:30h</strong> se llenan en menos de{' '}
            <strong>2 horas</strong> de media.
          </p>
        </div>

        <div className="p-3 bg-[#7FB77E]/10 rounded-2xl border border-[#7FB77E]/25 flex flex-col gap-1">
          <span className="text-[11px] font-black text-[#1F4E5F] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#7FB77E]" />
            <span>Atletas afines activos:</span>
          </span>
          <p className="text-[11px] text-[#1F4E5F]/75 font-medium leading-relaxed">
            Hay <strong>~18 miembros de la comunidad</strong> con ritmo{' '}
            <em>{formData.level || 'intermedio'}</em> buscando quedadas en tu municipio esta semana.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 💡 SECCIÓN 4: CONSEJO PROACTIVO DEL CAPITÁN                               */}
      {/* ========================================================================= */}
      <div className="p-4 bg-gradient-to-br from-[#1F4E5F] to-[#163844] rounded-3xl text-white flex flex-col gap-2 shadow-xs">
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
    </aside>
  );
};
