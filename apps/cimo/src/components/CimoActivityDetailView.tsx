import React, { useState } from 'react';
import {
  Apple,
  ArrowLeft,
  Beer,
  Bike,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coffee,
  Droplets,
  FileText,
  Flame,
  Footprints,
  Heart,
  MapPin,
  MessageSquare,
  Send,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sun,
  Wrench,
  Zap,
} from 'lucide-react';
import { TennisBallIcon } from './CimoCreatePlanView';
import { type ActivityCardData, type ChatMessage } from '@loopdev/public-blocks';
import { CimoMapPreviewCard } from './CimoMapPreviewCard';
import { CimoActivitySeoHead } from './CimoActivitySeoHead';

export interface CimoActivityDetailViewProps {
  activity: ActivityCardData;
  chatMessages: ChatMessage[];
  onBack: () => void;
  onJoin: (id: string) => void;
  onSendMessage: (activityId: string, text: string) => void;
  onNavigateToProfile?: (athleteId: string) => void;
}

export const CimoActivityDetailView: React.FC<CimoActivityDetailViewProps> = ({
  activity,
  chatMessages,
  onBack,
  onJoin,
  onSendMessage,
  onNavigateToProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
  const [inputText, setInputText] = useState('');
  const [shareCopied, setShareCopied] = useState(false);

  const isFull = activity.currentMembers.length >= activity.maxMembers;
  const isJoined = Boolean(activity.isJoined);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(activity.id, inputText.trim());
    setInputText('');
  };

  const city = activity.location.split(',')[1]?.trim() || 'Madrid';

  return (
    <div className="shadow-xs flex flex-col gap-6 rounded-3xl border border-[#1F4E5F]/10 bg-white p-6 text-[#1F4E5F] sm:p-8">
      {/* 🧭 SEO Head & Breadcrumbs */}
      <CimoActivitySeoHead activity={activity} />

      {/* Top Bar with Breadcrumbs & Back Button */}
      <div className="flex flex-col justify-between gap-3 border-b border-[#1F4E5F]/10 pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={onBack}
            className="mr-2 flex cursor-pointer items-center gap-1.5 font-black text-[#1F4E5F]/70 transition-colors hover:text-[#1F4E5F]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver a Explorar</span>
          </button>
          <span className="text-[#1F4E5F]/30">•</span>
          <nav
            aria-label="Migas de pan"
            className="flex flex-wrap items-center gap-1 text-[11px] font-bold text-[#1F4E5F]/60"
          >
            <span className="cursor-pointer hover:text-[#1F4E5F]" onClick={onBack}>
              CIMO
            </span>
            <span>›</span>
            <span>{city}</span>
            <span>›</span>
            <span className="capitalize text-[#7FB77E]">{activity.sport}</span>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label="Compartir entreno"
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-[#1F4E5F]/10 bg-[#F7F7F7] px-3 py-1.5 text-xs font-black text-[#1F4E5F] transition-colors hover:bg-[#7FB77E]/15"
          >
            {shareCopied ? (
              <Check className="h-3.5 w-3.5 text-[#7FB77E]" />
            ) : (
              <Share2 className="h-3.5 w-3.5" />
            )}
            <span>{shareCopied ? '¡Enlace copiado!' : 'Compartir'}</span>
          </button>
          <button
            type="button"
            aria-label="Guardar en favoritos"
            className="cursor-pointer rounded-full border border-[#1F4E5F]/10 p-2 text-[#1F4E5F] transition-colors hover:bg-[#F7F7F7]"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Panoramic Cover */}
      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl bg-[#1F4E5F]/5 shadow-sm sm:aspect-[16/7]">
        {activity.image ? (
          <img src={activity.image} alt={activity.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#1F4E5F] font-black text-white">
            CIMO
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E5F]/95 via-[#1F4E5F]/20 to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="shadow-xs rounded-full bg-white px-3.5 py-1 text-xs font-black uppercase text-[#1F4E5F]">
            {activity.sport}
          </span>
          <span className="rounded-full bg-[#1F4E5F]/90 px-3 py-1 text-xs font-extrabold text-white backdrop-blur-md">
            {activity.level}
          </span>
        </div>

        <div className="absolute bottom-4 left-5 right-5 text-white">
          <h1 className="drop-shadow-xs text-xl font-black sm:text-2xl">{activity.title}</h1>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-white/90 sm:text-sm">
            <MapPin className="h-4 w-4 shrink-0 text-[#7FB77E]" />
            <span>{activity.location}</span>
          </div>
        </div>
      </div>

      {/* Tabs: Detalles del Entreno vs Chat del Crew */}
      <div className="flex items-center gap-2 border-b border-[#1F4E5F]/10 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`cursor-pointer border-b-2 px-3 pb-2 text-xs font-black transition-all ${
            activeTab === 'details'
              ? 'border-[#1F4E5F] text-[#1F4E5F]'
              : 'border-transparent text-[#1F4E5F]/50 hover:text-[#1F4E5F]'
          }`}
        >
          Información del Plan
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`flex cursor-pointer items-center gap-1.5 border-b-2 px-3 pb-2 text-xs font-black transition-all ${
            activeTab === 'chat'
              ? 'border-[#1F4E5F] text-[#1F4E5F]'
              : 'border-transparent text-[#1F4E5F]/50 hover:text-[#1F4E5F]'
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Chat del Crew ({chatMessages.length})</span>
        </button>
      </div>

      {activeTab === 'details' ? (
        <div className="flex flex-col gap-6">
          {/* Captain Card */}
          <div
            onClick={() => onNavigateToProfile?.(activity.captain.id)}
            className="group flex cursor-pointer flex-col justify-between gap-4 rounded-3xl border border-[#1F4E5F]/5 bg-[#F7F7F7] p-4 transition-all hover:border-[#7FB77E]/30 hover:bg-[#7FB77E]/10 sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-3">
              {activity.captain.avatarUrl ? (
                <img
                  src={activity.captain.avatarUrl}
                  alt={activity.captain.name}
                  className="shadow-xs h-14 w-14 rounded-full border-2 border-[#1F4E5F]/20 object-cover group-hover:border-[#7FB77E]"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1F4E5F] text-lg font-black text-white">
                  {activity.captain.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold text-[#1F4E5F]">
                    {activity.captain.name}
                  </span>
                  <span className="rounded-full bg-[#7FB77E]/20 px-2 py-0.5 text-xs font-extrabold text-[#1F4E5F]">
                    Capitán
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#1F4E5F]/70">
                  {activity.captain.bio ??
                    'Organizador activo en CIMO. Apasionado por entrenar en grupo y con buen rollo.'}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-left sm:text-right">
              <div className="flex items-center gap-1 text-xs font-bold text-[#1F4E5F] sm:justify-end">
                <Calendar className="h-3.5 w-3.5 text-[#7FB77E]" />
                <span>{activity.date}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-[#1F4E5F]/70 sm:justify-end">
                <Clock className="h-3.5 w-3.5" />
                <span>{activity.time} h</span>
              </div>
            </div>
          </div>

          {/* ⚡ Métricas Clave del Plan (Tipografía Clara y Legible) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="border-[#1F4E5F]/8 flex flex-col justify-center rounded-2xl border bg-[#EEF2F2]/50 p-4">
              <span className="mb-1 block text-[11px] font-black uppercase tracking-wider text-[#7FB77E]">
                Ritmo & Exigencia
              </span>
              <p className="text-sm font-black text-[#1F4E5F]">
                {activity.paceOrDetails ?? 'Ritmo cómodo y adaptado al grupo'}
              </p>
            </div>

            <div className="border-[#1F4E5F]/8 flex flex-col justify-center rounded-2xl border bg-[#EEF2F2]/50 p-4">
              <span className="mb-1 block text-[11px] font-black uppercase tracking-wider text-[#7FB77E]">
                Nivel Recomendado
              </span>
              <p className="text-sm font-black text-[#1F4E5F]">{activity.level}</p>
            </div>

            <div className="border-[#1F4E5F]/8 flex flex-col justify-center rounded-2xl border bg-[#EEF2F2]/50 p-4">
              <span className="mb-1 block text-[11px] font-black uppercase tracking-wider text-[#7FB77E]">
                Fecha & Horario
              </span>
              <p className="text-sm font-black text-[#1F4E5F]">
                {activity.date} a las {activity.time}h
              </p>
            </div>
          </div>

          {/* 📖 Acerca del Entrenamiento / Qué Haremos */}
          {activity.description && (
            <div className="shadow-2xs flex flex-col gap-2.5 rounded-3xl border border-[#1F4E5F]/10 bg-white p-6">
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
                <FileText className="h-4 w-4 text-[#7FB77E]" />
                <span>Acerca de este entrenamiento</span>
              </span>
              <p className="text-sm font-normal leading-relaxed text-[#1F4E5F]/90 sm:text-base">
                {activity.description}
              </p>
            </div>
          )}

          {/* 💬 Instrucciones del Capitán (Bloque Editorial Destacado) */}
          {activity.instructions ? (
            <div className="shadow-2xs flex flex-col gap-2 rounded-3xl border border-[#7FB77E]/30 bg-gradient-to-br from-[#7FB77E]/15 via-[#7FB77E]/5 to-transparent p-5">
              <div className="flex items-center gap-2 text-[#7FB77E]">
                <Sparkles className="h-4 w-4 text-[#7FB77E]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
                  Instrucciones & Claves del Capitán ({activity.captain.name})
                </span>
              </div>
              <p className="text-sm font-semibold italic leading-relaxed text-[#1F4E5F] sm:text-base">
                "{activity.instructions}"
              </p>
            </div>
          ) : null}

          {/* 🎒 Qué debes traer & Material Recomendado (100% Vectorial sin Emojis OS) */}
          <div className="shadow-2xs flex flex-col gap-3 rounded-3xl border border-[#1F4E5F]/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
                <ShoppingBag className="h-4 w-4 text-[#7FB77E]" />
                <span>Qué debes traer para esta sesión</span>
              </span>
              <span className="rounded-full bg-[#7FB77E]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#7FB77E]">
                Checklist Recomendado
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1 sm:grid-cols-3 lg:grid-cols-5">
              {activity.sport === 'hiking' ? (
                <>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-[#1F4E5F]/5 bg-[#EEF2F2]/50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
                      <Footprints className="h-4 w-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-black text-[#1F4E5F]">
                        Calzado Trail
                      </span>
                      <span className="block truncate text-[10px] font-medium text-[#1F4E5F]/60">
                        Suela con agarre
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-[#1F4E5F]/5 bg-[#EEF2F2]/50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
                      <Droplets className="h-4 w-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-black text-[#1F4E5F]">
                        Agua (1.5L)
                      </span>
                      <span className="block truncate text-[10px] font-medium text-[#1F4E5F]/60">
                        Mínimo sugerido
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-[#1F4E5F]/5 bg-[#EEF2F2]/50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
                      <ShieldCheck className="h-4 w-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-black text-[#1F4E5F]">
                        Cortavientos
                      </span>
                      <span className="block truncate text-[10px] font-medium text-[#1F4E5F]/60">
                        Capa de abrigo
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-[#1F4E5F]/5 bg-[#EEF2F2]/50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
                      <Apple className="h-4 w-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-black text-[#1F4E5F]">
                        Snack / Fruta
                      </span>
                      <span className="block truncate text-[10px] font-medium text-[#1F4E5F]/60">
                        Frutos secos
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-[#1F4E5F]/5 bg-[#EEF2F2]/50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
                      <Sun className="h-4 w-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-black text-[#1F4E5F]">
                        Protección Solar
                      </span>
                      <span className="block truncate text-[10px] font-medium text-[#1F4E5F]/60">
                        Gorra y crema
                      </span>
                    </div>
                  </div>
                </>
              ) : activity.sport === 'padel' ? (
                <>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-[#1F4E5F]/5 bg-[#EEF2F2]/50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
                      <TennisBallIcon className="h-4 w-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-black text-[#1F4E5F]">
                        Pala de Pádel
                      </span>
                      <span className="block truncate text-[10px] font-medium text-[#1F4E5F]/60">
                        Propia o alquilada
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-[#1F4E5F]/5 bg-[#EEF2F2]/50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
                      <Footprints className="h-4 w-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-black text-[#1F4E5F]">
                        Calzado Pádel
                      </span>
                      <span className="block truncate text-[10px] font-medium text-[#1F4E5F]/60">
                        Suela espiga / clay
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-[#1F4E5F]/5 bg-[#EEF2F2]/50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
                      <Droplets className="h-4 w-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-black text-[#1F4E5F]">
                        Botella de Agua
                      </span>
                      <span className="block truncate text-[10px] font-medium text-[#1F4E5F]/60">
                        Para cambios de lado
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-[#1F4E5F]/5 bg-[#EEF2F2]/50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
                      <CheckCircle2 className="h-4 w-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-black text-[#1F4E5F]">
                        Bolas Incluidas
                      </span>
                      <span className="block truncate text-[10px] font-medium text-[#1F4E5F]/60">
                        Las pone el capitán
                      </span>
                    </div>
                  </div>
                </>
              ) : activity.sport === 'cycling' ? (
                <>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-[#1F4E5F]/5 bg-[#EEF2F2]/50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
                      <Bike className="h-4 w-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-black text-[#1F4E5F]">
                        Bici a Punto
                      </span>
                      <span className="block truncate text-[10px] font-medium text-[#1F4E5F]/60">
                        Presión y frenos
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-[#1F4E5F]/5 bg-[#EEF2F2]/50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
                      <ShieldCheck className="h-4 w-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-black text-[#1F4E5F]">
                        Casco Obligatorio
                      </span>
                      <span className="block truncate text-[10px] font-medium text-[#1F4E5F]/60">
                        Homologado
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-[#1F4E5F]/5 bg-[#EEF2F2]/50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
                      <Droplets className="h-4 w-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-black text-[#1F4E5F]">
                        Bidón de Agua
                      </span>
                      <span className="block truncate text-[10px] font-medium text-[#1F4E5F]/60">
                        Con sales o agua
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-[#1F4E5F]/5 bg-[#EEF2F2]/50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
                      <Wrench className="h-4 w-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-black text-[#1F4E5F]">
                        Cámara / Bomba
                      </span>
                      <span className="block truncate text-[10px] font-medium text-[#1F4E5F]/60">
                        Kit de repuesto
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-[#1F4E5F]/5 bg-[#EEF2F2]/50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
                      <Footprints className="h-4 w-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-black text-[#1F4E5F]">
                        Calzado Técnico
                      </span>
                      <span className="block truncate text-[10px] font-medium text-[#1F4E5F]/60">
                        Zapatillas adecuadas
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-[#1F4E5F]/5 bg-[#EEF2F2]/50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
                      <Flame className="h-4 w-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-black text-[#1F4E5F]">
                        Ropa Cómoda
                      </span>
                      <span className="block truncate text-[10px] font-medium text-[#1F4E5F]/60">
                        Tejido transpirable
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-[#1F4E5F]/5 bg-[#EEF2F2]/50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
                      <Droplets className="h-4 w-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-black text-[#1F4E5F]">
                        Hidratación
                      </span>
                      <span className="block truncate text-[10px] font-medium text-[#1F4E5F]/60">
                        Botella de agua
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-[#1F4E5F]/5 bg-[#EEF2F2]/50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F]">
                      <Zap className="h-4 w-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-black text-[#1F4E5F]">
                        Buena Energía
                      </span>
                      <span className="block truncate text-[10px] font-medium text-[#1F4E5F]/60">
                        Ganas de entrenar
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tercer Tiempo Post-Entreno (CIMO Social Blue) */}
          {activity.thirdHalf?.enabled && (
            <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-[#1F4E5F]/20 bg-gradient-to-r from-[#1F4E5F]/10 via-[#1F4E5F]/5 to-transparent p-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3.5">
                <div className="shadow-2xs flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1F4E5F]/15 text-[#1F4E5F]">
                  {activity.thirdHalf.type === 'beer' ? (
                    <Beer className="h-6 w-6 text-[#1F4E5F]" />
                  ) : activity.thirdHalf.type === 'smoothie' ? (
                    <Sparkles className="h-6 w-6 text-[#1F4E5F]" />
                  ) : activity.thirdHalf.type === 'picnic' ? (
                    <Sun className="h-6 w-6 text-[#1F4E5F]" />
                  ) : (
                    <Coffee className="h-6 w-6 text-[#1F4E5F]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
                      Tercer Tiempo Organizado
                    </span>
                    <span className="rounded-full bg-[#1F4E5F] px-2 py-0.5 text-[10px] font-black text-white">
                      Social & Recovery
                    </span>
                  </div>
                  <h4 className="mt-0.5 text-base font-black text-[#1F4E5F]">
                    {activity.thirdHalf.venue || 'Cafetería cercana'}
                  </h4>
                  {activity.thirdHalf.notes && (
                    <p className="mt-1 text-xs font-medium leading-relaxed text-[#1F4E5F]/75 sm:text-sm">
                      {activity.thirdHalf.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="shadow-2xs flex shrink-0 items-center gap-1.5 rounded-xl border border-[#1F4E5F]/20 bg-white px-3.5 py-1.5 text-xs font-bold text-[#1F4E5F]">
                <Coffee className="h-3.5 w-3.5 text-[#1F4E5F]" />
                <span>Post-Entreno (~30-40 min)</span>
              </div>
            </div>
          )}

          {/* Map Preview & GPS Navigation Button */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
              Punto de encuentro y navegación GPS
            </span>
            <CimoMapPreviewCard
              location={activity.location}
              city={
                activity.location.includes('Barcelona')
                  ? 'Barcelona'
                  : activity.location.includes('Valencia')
                    ? 'Valencia'
                    : 'Madrid'
              }
              postalCode={activity.postalCode}
            />
          </div>
        </div>
      ) : (
        /* Embedded Crew Chat */
        <div className="flex h-96 flex-col rounded-3xl border border-[#1F4E5F]/5 bg-[#F7F7F7] p-4">
          {/* Ephemeral Chat Expiration Header */}
          <div className="shadow-2xs mb-3 flex items-center justify-between rounded-2xl border border-[#7FB77E]/20 bg-white px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <Clock className="h-3.5 w-3.5 shrink-0 text-[#7FB77E]" />
              <span className="truncate text-[11px] font-black text-[#1F4E5F]">
                Chat Temporal del Evento
              </span>
            </div>
            <span className="shrink-0 rounded-full bg-[#7FB77E]/10 px-2 py-0.5 text-[9px] font-bold text-[#7FB77E]">
              ⏳ Cierra 24h tras el entreno
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {chatMessages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-[#1F4E5F]/50">
                Aún no hay mensajes en este Crew. ¡Sé el primero en saludar!
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-2.5">
                  {msg.senderAvatar ? (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="mt-0.5 h-7 w-7 shrink-0 rounded-full border border-[#1F4E5F]/10 object-cover"
                    />
                  ) : (
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1F4E5F]/10 text-xs font-bold text-[#1F4E5F]">
                      {msg.senderName.charAt(0)}
                    </div>
                  )}
                  <div className="shadow-2xs flex-1 rounded-2xl border border-[#1F4E5F]/5 bg-white p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#1F4E5F]">
                        {msg.senderName}
                      </span>
                      <span className="text-[10px] text-[#1F4E5F]/40">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#1F4E5F]/90">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSend} className="flex gap-2 pt-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe un mensaje al Crew..."
              className="flex-1 rounded-full border border-[#1F4E5F]/15 bg-white px-4 py-2 text-xs font-medium text-[#1F4E5F] focus:border-[#7FB77E] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex cursor-pointer items-center justify-center rounded-full bg-[#7FB77E] px-4 py-2 text-xs font-black text-white transition-colors hover:bg-[#6ea26d] disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile/Tablet Sticky Bottom Action CTA (Hidden on Desktop) */}
      <div className="flex items-center justify-between gap-4 border-t border-[#1F4E5F]/10 pt-4 lg:hidden">
        <div>
          <span className="block text-xs font-black text-[#1F4E5F]">
            {activity.date} a las {activity.time}h
          </span>
          <span className="text-[11px] font-bold text-[#7FB77E]">
            {activity.currentMembers.length}/{activity.maxMembers} plazas ocupadas
          </span>
        </div>

        <button
          type="button"
          disabled={isFull && !isJoined}
          onClick={() => onJoin(activity.id)}
          className={`flex cursor-pointer items-center gap-2 rounded-full px-7 py-3 text-xs font-black shadow-md transition-all ${
            isJoined
              ? 'shadow-xs bg-[#7FB77E] text-white'
              : isFull
                ? 'cursor-not-allowed bg-[#1F4E5F]/10 text-[#1F4E5F]/50'
                : 'bg-[#7FB77E] text-white hover:bg-[#6ea26d] active:scale-95'
          }`}
        >
          {isJoined ? (
            <>
              <Check className="h-4 w-4 stroke-[3]" />
              <span>You're In</span>
            </>
          ) : isFull ? (
            <span>Crew Completo</span>
          ) : (
            <>
              <span>Unirme al Crew</span>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
