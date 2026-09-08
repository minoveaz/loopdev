import React, { useState } from 'react';
import {
  Calendar,
  Coffee,
  Flame,
  Footprints,
  Heart,
  Lightbulb,
  MapPin,
  Smartphone,
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
      <TennisBallIcon className="h-3.5 w-3.5" />
    ) : formData.sport?.toLowerCase() === 'hiking' ? (
      <Footprints className="h-3.5 w-3.5" />
    ) : (
      <Flame className="h-3.5 w-3.5" />
    );

  const safeImageSrc = React.useMemo(() => {
    const raw = (formData.image || '').trim();
    if (!raw) {
      return 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=800';
    }
    try {
      const url = new URL(raw);
      if (url.protocol === 'https:' || url.protocol === 'http:') {
        return encodeURI(url.href);
      }
    } catch {
      if (raw.startsWith('data:image/')) {
        return encodeURI(raw);
      }
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
      className={`flex w-full flex-col gap-5 text-[#1F4E5F] ${
        hideHeader
          ? 'border-0 bg-transparent p-0 shadow-none'
          : 'border-[#1F4E5F]/12 h-full overflow-y-auto rounded-3xl border bg-[#FCFDFD] p-5 shadow-[0_4px_24px_-4px_rgba(31,78,95,0.05)]'
      }`}
      aria-label="Co-Piloto del Capitán y Live Preview"
    >
      {/* 1. Cabecera Principal (Desktop / Full view only) */}
      {!hideHeader && (
        <div className="flex items-center justify-between border-b border-[#1F4E5F]/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="shadow-2xs flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#7FB77E]/20 text-[#7FB77E]">
              <Zap className="h-4 w-4" />
            </span>
            <div>
              <span className="block text-xs font-black uppercase leading-none tracking-wider text-[#1F4E5F]">
                Co-Piloto del Capitán
              </span>
              <span className="mt-0.5 block text-[10px] font-medium text-[#1F4E5F]/60">
                Asistencia & Live Preview
              </span>
            </div>
          </div>

          <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${scoreBadgeBg}`}>
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
            <Smartphone className="h-3.5 w-3.5 text-[#7FB77E]" />
            <span>Simulador Móvil en Vivo</span>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-[#1F4E5F]/10 bg-[#EEF2F2]/60 p-0.5">
            <button
              type="button"
              onClick={() => setPreviewCardFormat('feed')}
              className={`cursor-pointer rounded-md px-2 py-0.5 text-[10px] font-black transition-all ${
                previewCardFormat === 'feed'
                  ? 'shadow-2xs bg-white text-[#1F4E5F]'
                  : 'text-[#1F4E5F]/60'
              }`}
            >
              Feed
            </button>
            <button
              type="button"
              onClick={() => setPreviewCardFormat('story')}
              className={`cursor-pointer rounded-md px-2 py-0.5 text-[10px] font-black transition-all ${
                previewCardFormat === 'story'
                  ? 'shadow-2xs bg-white text-[#1F4E5F]'
                  : 'text-[#1F4E5F]/60'
              }`}
            >
              Story
            </button>
          </div>
        </div>

        {/* Tarjeta Mockup Realista de CIMO (Idéntica al Feed Principal) */}
        <div className="shadow-xs group flex flex-col overflow-hidden rounded-3xl border border-[#1F4E5F]/15 bg-white transition-all hover:border-[#7FB77E]/50">
          {/* 1. Imagen de Portada con Badges y Título */}
          <div
            className={`relative w-full overflow-hidden bg-[#1F4E5F]/5 ${previewCardFormat === 'story' ? 'aspect-[4/3]' : 'aspect-[16/9]'}`}
          >
            <img
              src={safeImageSrc}
              alt={safeTitle}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Top Tags */}
            <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
              <span className="shadow-xs flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-black text-[#1F4E5F] backdrop-blur-md">
                {sportIcon}
                <span className="capitalize">{safeSport}</span>
              </span>
              <span className="py-0.8 rounded-full border border-white/10 bg-black/60 px-2 text-[10px] font-black text-white backdrop-blur-md">
                {safeLevel}
              </span>
            </div>

            {/* Favorite Heart Button */}
            <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md">
              <Heart className="h-4 w-4 fill-transparent text-white" />
            </div>

            {/* Title on the Cover Overlay */}
            <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
              <h3 className="drop-shadow-xs line-clamp-1 text-base font-black leading-tight">
                {safeTitle}
              </h3>
            </div>
          </div>

          {/* 2. Cuerpo de la Tarjeta */}
          <div className="flex flex-col gap-3 p-4 text-[#1F4E5F] sm:p-5">
            {/* Logistics Row: Location & Date/Time */}
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex items-center justify-between gap-2 font-bold text-slate-600">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#7FB77E]" />
                  <span className="truncate">{safeLocation}</span>
                </div>
                <div className="flex shrink-0 items-center gap-1 font-black text-[#1F4E5F]">
                  <Calendar className="h-3.5 w-3.5 text-[#7FB77E]" />
                  <span>
                    {formData.date || 'Fecha'}, {formData.time || '19:30'}h
                  </span>
                </div>
              </div>

              {/* Pace / Level Line */}
              <div className="flex items-center gap-1.5 font-medium text-slate-600">
                <Zap className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                <span>
                  Ritmo: <strong>{safeLevel}</strong>
                </span>
              </div>

              {/* Description preview */}
              <p className="mt-0.5 line-clamp-2 text-xs font-medium leading-relaxed text-slate-600">
                {safeDescription}
              </p>
            </div>

            {/* 3. Compact 1-Line Third Half Pill (Social Blue) */}
            {hasThirdHalf && (
              <div className="flex items-center justify-between gap-2 rounded-xl border border-[#1F4E5F]/15 bg-[#EEF2F2]/70 px-3 py-1.5 text-xs font-bold text-[#1F4E5F]">
                <div className="flex items-center gap-1.5 truncate">
                  <Coffee className="h-3.5 w-3.5 shrink-0 text-[#1F4E5F]" />
                  <span className="truncate">
                    <strong>Tercer Tiempo:</strong> {safeThirdHalf}
                  </span>
                </div>
                <span className="py-0.2 shrink-0 rounded-md bg-[#1F4E5F] px-1.5 text-[9px] font-black uppercase text-white">
                  Social
                </span>
              </div>
            )}

            {/* 4. Footer: Crew Avatars + Action Button */}
            <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
              <div className="flex items-center gap-2">
                <div className="shadow-2xs flex h-7 w-7 items-center justify-center rounded-full bg-[#7FB77E] text-xs font-black text-white ring-2 ring-white">
                  {currentUser.name[0]}
                </div>
                <div>
                  <span className="block text-xs font-black leading-none text-[#1F4E5F]">
                    1/{formData.capacity || 6}
                  </span>
                  <span className="mt-0.5 block text-[10px] font-bold text-[#7FB77E]">
                    {(formData.capacity || 6) - 1} libre(s)
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="shadow-xs flex w-28 cursor-default items-center justify-center gap-1.5 rounded-xl bg-[#7FB77E] py-2 text-xs font-black text-white">
                <span>Unirme</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ⚡ SECCIÓN 2: SCORE DE ATRACTIVO & CHECKLIST DINÁMICO                     */}
      {/* ========================================================================= */}
      <div className="border-[#1F4E5F]/12 shadow-2xs flex flex-col gap-2.5 rounded-3xl border bg-white p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
            Score de Atractivo del Plan
          </span>
          <span className={`text-sm font-black ${scoreColor}`}>{score}%</span>
        </div>

        {/* Barra de progreso con gradiente */}
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#EEF2F2] p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7FB77E] to-[#1F4E5F] transition-all duration-500"
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Checklist en vivo */}
        <div className="flex flex-col gap-1.5 pt-1 text-[11px] font-bold">
          <div className="flex items-center justify-between">
            <span className="text-[#1F4E5F]/75">Descripción completa:</span>
            <span
              className={hasGoodDescription ? 'font-black text-[#7FB77E]' : 'text-[#1F4E5F]/40'}
            >
              {hasGoodDescription ? '✓ +15%' : 'Pendiente'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#1F4E5F]/75">Tercer Tiempo incluido:</span>
            <span className={hasThirdHalf ? 'font-black text-[#7FB77E]' : 'text-[#1F4E5F]/40'}>
              {hasThirdHalf ? '✓ +20%' : 'Pendiente (+20%)'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#1F4E5F]/75">Grupo óptimo (4-8 plazas):</span>
            <span className={hasIdealCapacity ? 'font-black text-[#7FB77E]' : 'text-[#1F4E5F]/40'}>
              {hasIdealCapacity ? '✓ +15%' : 'Pendiente'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#1F4E5F]/75">Foto real de portada:</span>
            <span
              className={hasCustomOrRealPhoto ? 'font-black text-[#7FB77E]' : 'text-[#1F4E5F]/40'}
            >
              {hasCustomOrRealPhoto ? '✓ +10%' : 'Pendiente'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📈 SECCIÓN 3: DEMANDA COMUNITARIA EN TU ZONA                              */}
      {/* ========================================================================= */}
      <div className="border-[#1F4E5F]/12 shadow-2xs flex flex-col gap-2.5 rounded-3xl border bg-white p-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#7FB77E]" />
          <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
            Demanda en {formData.location ? formData.location.split(',')[0] : 'tu zona'}
          </span>
        </div>

        <div className="border-[#1F4E5F]/8 flex flex-col gap-1 rounded-2xl border bg-[#EEF2F2]/60 p-3">
          <span className="text-[11px] font-black text-[#1F4E5F]">
            🔥 Horarios con más éxito en {formData.sport || 'este deporte'}:
          </span>
          <p className="text-[11px] font-medium leading-relaxed text-[#1F4E5F]/70">
            Las convocatorias entre las <strong>19:00h y 20:30h</strong> se llenan en menos de{' '}
            <strong>2 horas</strong> de media.
          </p>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl border border-[#7FB77E]/25 bg-[#7FB77E]/10 p-3">
          <span className="flex items-center gap-1.5 text-[11px] font-black text-[#1F4E5F]">
            <Users className="h-3.5 w-3.5 text-[#7FB77E]" />
            <span>Atletas afines activos:</span>
          </span>
          <p className="text-[11px] font-medium leading-relaxed text-[#1F4E5F]/75">
            Hay <strong>~18 miembros de la comunidad</strong> con ritmo{' '}
            <em>{formData.level || 'intermedio'}</em> buscando quedadas en tu municipio esta semana.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 💡 SECCIÓN 4: CONSEJO PROACTIVO DEL CAPITÁN                               */}
      {/* ========================================================================= */}
      <div className="shadow-xs flex flex-col gap-2 rounded-3xl bg-gradient-to-br from-[#1F4E5F] to-[#163844] p-4 text-white">
        <div className="flex items-center gap-1.5 text-xs font-black text-[#7FB77E]">
          <Lightbulb className="h-4 w-4 text-[#7FB77E]" />
          <span>Tip de Capitán CIMO</span>
        </div>
        <p className="text-[11px] font-medium leading-relaxed text-white/85">
          {!hasThirdHalf
            ? 'Las quedadas que incluyen un café o cañas post-entreno reciben un 40% más de solicitudes de atletas nuevos.'
            : 'Puntualidad británica: cita al grupo 5 minutos antes para saludar y empezar a entrenar sin retrasos.'}
        </p>
      </div>
    </aside>
  );
};
