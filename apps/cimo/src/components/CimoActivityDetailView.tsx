import React, { useState } from 'react';
import {
  Activity,
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
  Timer,
  Users,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { TennisBallIcon } from './CimoCreatePlanView';
import { CrewAvatarGroup, type ActivityCardData, type ChatMessage } from '@loopdev/public-blocks';
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
    <div className="bg-white border border-[#1F4E5F]/10 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6 text-[#1F4E5F]">
      {/* 🧭 SEO Head & Breadcrumbs */}
      <CimoActivitySeoHead activity={activity} />

      {/* Top Bar with Breadcrumbs & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1F4E5F]/10">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 font-black text-[#1F4E5F]/70 hover:text-[#1F4E5F] transition-colors cursor-pointer mr-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Explorar</span>
          </button>
          <span className="text-[#1F4E5F]/30">•</span>
          <nav
            aria-label="Migas de pan"
            className="flex items-center gap-1 text-[11px] font-bold text-[#1F4E5F]/60 flex-wrap"
          >
            <span className="hover:text-[#1F4E5F] cursor-pointer" onClick={onBack}>
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
            className="px-3 py-1.5 rounded-full bg-[#F7F7F7] hover:bg-[#7FB77E]/15 text-[#1F4E5F] transition-colors flex items-center gap-1.5 text-xs font-black cursor-pointer border border-[#1F4E5F]/10"
          >
            {shareCopied ? (
              <Check className="w-3.5 h-3.5 text-[#7FB77E]" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            <span>{shareCopied ? '¡Enlace copiado!' : 'Compartir'}</span>
          </button>
          <button
            type="button"
            aria-label="Guardar en favoritos"
            className="p-2 rounded-full hover:bg-[#F7F7F7] text-[#1F4E5F] transition-colors cursor-pointer border border-[#1F4E5F]/10"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Panoramic Cover */}
      <div className="relative aspect-[21/9] sm:aspect-[16/7] w-full rounded-3xl overflow-hidden bg-[#1F4E5F]/5 shadow-sm">
        {activity.image ? (
          <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#1F4E5F] text-white flex items-center justify-center font-black">
            CIMO
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E5F]/95 via-[#1F4E5F]/20 to-transparent" />

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3.5 py-1 rounded-full font-black text-xs bg-white text-[#1F4E5F] shadow-xs uppercase">
            {activity.sport}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#1F4E5F]/90 text-white backdrop-blur-md">
            {activity.level}
          </span>
        </div>

        <div className="absolute bottom-4 left-5 right-5 text-white">
          <h1 className="text-xl sm:text-2xl font-black drop-shadow-xs">{activity.title}</h1>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-white/90 mt-1.5">
            <MapPin className="w-4 h-4 text-[#7FB77E] shrink-0" />
            <span>{activity.location}</span>
          </div>
        </div>
      </div>

      {/* Tabs: Detalles del Entreno vs Chat del Crew */}
      <div className="flex items-center gap-2 border-b border-[#1F4E5F]/10 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`pb-2 px-3 text-xs font-black transition-all cursor-pointer border-b-2 ${
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
          className={`pb-2 px-3 text-xs font-black transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'chat'
              ? 'border-[#1F4E5F] text-[#1F4E5F]'
              : 'border-transparent text-[#1F4E5F]/50 hover:text-[#1F4E5F]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat del Crew ({chatMessages.length})</span>
        </button>
      </div>

      {activeTab === 'details' ? (
        <div className="flex flex-col gap-6">
          {/* Captain Card */}
          <div
            onClick={() => onNavigateToProfile?.(activity.captain.id)}
            className="p-4 bg-[#F7F7F7] hover:bg-[#7FB77E]/10 rounded-3xl border border-[#1F4E5F]/5 hover:border-[#7FB77E]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              {activity.captain.avatarUrl ? (
                <img
                  src={activity.captain.avatarUrl}
                  alt={activity.captain.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#1F4E5F]/20 shadow-xs group-hover:border-[#7FB77E]"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#1F4E5F] text-white font-black text-lg flex items-center justify-center">
                  {activity.captain.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold text-[#1F4E5F]">
                    {activity.captain.name}
                  </span>
                  <span className="text-xs font-extrabold bg-[#7FB77E]/20 text-[#1F4E5F] px-2 py-0.5 rounded-full">
                    Capitán
                  </span>
                </div>
                <p className="text-xs text-[#1F4E5F]/70 mt-0.5">
                  {activity.captain.bio ??
                    'Organizador activo en CIMO. Apasionado por entrenar en grupo y con buen rollo.'}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="flex items-center sm:justify-end gap-1 text-xs font-bold text-[#1F4E5F]">
                <Calendar className="w-3.5 h-3.5 text-[#7FB77E]" />
                <span>{activity.date}</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1 text-xs text-[#1F4E5F]/70 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{activity.time} h</span>
              </div>
            </div>
          </div>

          {/* ⚡ Métricas Clave del Plan (Tipografía Clara y Legible) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-[#EEF2F2]/50 rounded-2xl border border-[#1F4E5F]/8 flex flex-col justify-center">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#7FB77E] block mb-1">
                Ritmo & Exigencia
              </span>
              <p className="text-sm font-black text-[#1F4E5F]">
                {activity.paceOrDetails ?? 'Ritmo cómodo y adaptado al grupo'}
              </p>
            </div>

            <div className="p-4 bg-[#EEF2F2]/50 rounded-2xl border border-[#1F4E5F]/8 flex flex-col justify-center">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#7FB77E] block mb-1">
                Nivel Recomendado
              </span>
              <p className="text-sm font-black text-[#1F4E5F]">{activity.level}</p>
            </div>

            <div className="p-4 bg-[#EEF2F2]/50 rounded-2xl border border-[#1F4E5F]/8 flex flex-col justify-center">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#7FB77E] block mb-1">
                Fecha & Horario
              </span>
              <p className="text-sm font-black text-[#1F4E5F]">
                {activity.date} a las {activity.time}h
              </p>
            </div>
          </div>

          {/* 📖 Acerca del Entrenamiento / Qué Haremos */}
          {activity.description && (
            <div className="p-6 bg-white rounded-3xl border border-[#1F4E5F]/10 flex flex-col gap-2.5 shadow-2xs">
              <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#7FB77E]" />
                <span>Acerca de este entrenamiento</span>
              </span>
              <p className="text-sm sm:text-base text-[#1F4E5F]/90 font-normal leading-relaxed">
                {activity.description}
              </p>
            </div>
          )}

          {/* 💬 Instrucciones del Capitán (Bloque Editorial Destacado) */}
          {activity.instructions ? (
            <div className="p-5 bg-gradient-to-br from-[#7FB77E]/15 via-[#7FB77E]/5 to-transparent border border-[#7FB77E]/30 rounded-3xl flex flex-col gap-2 shadow-2xs">
              <div className="flex items-center gap-2 text-[#7FB77E]">
                <Sparkles className="w-4 h-4 text-[#7FB77E]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
                  Instrucciones & Claves del Capitán ({activity.captain.name})
                </span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-[#1F4E5F] leading-relaxed italic">
                "{activity.instructions}"
              </p>
            </div>
          ) : null}

          {/* 🎒 Qué debes traer & Material Recomendado (100% Vectorial sin Emojis OS) */}
          <div className="p-5 bg-white rounded-3xl border border-[#1F4E5F]/10 flex flex-col gap-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#7FB77E]" />
                <span>Qué debes traer para esta sesión</span>
              </span>
              <span className="text-[10px] font-bold text-[#7FB77E] bg-[#7FB77E]/10 px-2.5 py-0.5 rounded-full">
                Checklist Recomendado
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
              {activity.sport === 'hiking' ? (
                <>
                  <div className="p-3 bg-[#EEF2F2]/50 rounded-2xl border border-[#1F4E5F]/5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F] flex items-center justify-center shrink-0">
                      <Footprints className="w-4 h-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-[#1F4E5F] block truncate">
                        Calzado Trail
                      </span>
                      <span className="text-[10px] text-[#1F4E5F]/60 font-medium block truncate">
                        Suela con agarre
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#EEF2F2]/50 rounded-2xl border border-[#1F4E5F]/5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F] flex items-center justify-center shrink-0">
                      <Droplets className="w-4 h-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-[#1F4E5F] block truncate">
                        Agua (1.5L)
                      </span>
                      <span className="text-[10px] text-[#1F4E5F]/60 font-medium block truncate">
                        Mínimo sugerido
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#EEF2F2]/50 rounded-2xl border border-[#1F4E5F]/5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-[#1F4E5F] block truncate">
                        Cortavientos
                      </span>
                      <span className="text-[10px] text-[#1F4E5F]/60 font-medium block truncate">
                        Capa de abrigo
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#EEF2F2]/50 rounded-2xl border border-[#1F4E5F]/5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F] flex items-center justify-center shrink-0">
                      <Apple className="w-4 h-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-[#1F4E5F] block truncate">
                        Snack / Fruta
                      </span>
                      <span className="text-[10px] text-[#1F4E5F]/60 font-medium block truncate">
                        Frutos secos
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#EEF2F2]/50 rounded-2xl border border-[#1F4E5F]/5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F] flex items-center justify-center shrink-0">
                      <Sun className="w-4 h-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-[#1F4E5F] block truncate">
                        Protección Solar
                      </span>
                      <span className="text-[10px] text-[#1F4E5F]/60 font-medium block truncate">
                        Gorra y crema
                      </span>
                    </div>
                  </div>
                </>
              ) : activity.sport === 'padel' ? (
                <>
                  <div className="p-3 bg-[#EEF2F2]/50 rounded-2xl border border-[#1F4E5F]/5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F] flex items-center justify-center shrink-0">
                      <TennisBallIcon className="w-4 h-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-[#1F4E5F] block truncate">
                        Pala de Pádel
                      </span>
                      <span className="text-[10px] text-[#1F4E5F]/60 font-medium block truncate">
                        Propia o alquilada
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#EEF2F2]/50 rounded-2xl border border-[#1F4E5F]/5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F] flex items-center justify-center shrink-0">
                      <Footprints className="w-4 h-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-[#1F4E5F] block truncate">
                        Calzado Pádel
                      </span>
                      <span className="text-[10px] text-[#1F4E5F]/60 font-medium block truncate">
                        Suela espiga / clay
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#EEF2F2]/50 rounded-2xl border border-[#1F4E5F]/5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F] flex items-center justify-center shrink-0">
                      <Droplets className="w-4 h-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-[#1F4E5F] block truncate">
                        Botella de Agua
                      </span>
                      <span className="text-[10px] text-[#1F4E5F]/60 font-medium block truncate">
                        Para cambios de lado
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#EEF2F2]/50 rounded-2xl border border-[#1F4E5F]/5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-[#1F4E5F] block truncate">
                        Bolas Incluidas
                      </span>
                      <span className="text-[10px] text-[#1F4E5F]/60 font-medium block truncate">
                        Las pone el capitán
                      </span>
                    </div>
                  </div>
                </>
              ) : activity.sport === 'cycling' ? (
                <>
                  <div className="p-3 bg-[#EEF2F2]/50 rounded-2xl border border-[#1F4E5F]/5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F] flex items-center justify-center shrink-0">
                      <Bike className="w-4 h-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-[#1F4E5F] block truncate">
                        Bici a Punto
                      </span>
                      <span className="text-[10px] text-[#1F4E5F]/60 font-medium block truncate">
                        Presión y frenos
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#EEF2F2]/50 rounded-2xl border border-[#1F4E5F]/5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-[#1F4E5F] block truncate">
                        Casco Obligatorio
                      </span>
                      <span className="text-[10px] text-[#1F4E5F]/60 font-medium block truncate">
                        Homologado
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#EEF2F2]/50 rounded-2xl border border-[#1F4E5F]/5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F] flex items-center justify-center shrink-0">
                      <Droplets className="w-4 h-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-[#1F4E5F] block truncate">
                        Bidón de Agua
                      </span>
                      <span className="text-[10px] text-[#1F4E5F]/60 font-medium block truncate">
                        Con sales o agua
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#EEF2F2]/50 rounded-2xl border border-[#1F4E5F]/5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F] flex items-center justify-center shrink-0">
                      <Wrench className="w-4 h-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-[#1F4E5F] block truncate">
                        Cámara / Bomba
                      </span>
                      <span className="text-[10px] text-[#1F4E5F]/60 font-medium block truncate">
                        Kit de repuesto
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 bg-[#EEF2F2]/50 rounded-2xl border border-[#1F4E5F]/5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F] flex items-center justify-center shrink-0">
                      <Footprints className="w-4 h-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-[#1F4E5F] block truncate">
                        Calzado Técnico
                      </span>
                      <span className="text-[10px] text-[#1F4E5F]/60 font-medium block truncate">
                        Zapatillas adecuadas
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#EEF2F2]/50 rounded-2xl border border-[#1F4E5F]/5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F] flex items-center justify-center shrink-0">
                      <Flame className="w-4 h-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-[#1F4E5F] block truncate">
                        Ropa Cómoda
                      </span>
                      <span className="text-[10px] text-[#1F4E5F]/60 font-medium block truncate">
                        Tejido transpirable
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#EEF2F2]/50 rounded-2xl border border-[#1F4E5F]/5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F] flex items-center justify-center shrink-0">
                      <Droplets className="w-4 h-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-[#1F4E5F] block truncate">
                        Hidratación
                      </span>
                      <span className="text-[10px] text-[#1F4E5F]/60 font-medium block truncate">
                        Botella de agua
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#EEF2F2]/50 rounded-2xl border border-[#1F4E5F]/5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#7FB77E]/15 text-[#1F4E5F] flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4 text-[#1F4E5F]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-[#1F4E5F] block truncate">
                        Buena Energía
                      </span>
                      <span className="text-[10px] text-[#1F4E5F]/60 font-medium block truncate">
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
            <div className="p-5 bg-gradient-to-r from-[#1F4E5F]/10 via-[#1F4E5F]/5 to-transparent border border-[#1F4E5F]/20 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#1F4E5F]/15 text-[#1F4E5F] flex items-center justify-center shrink-0 shadow-2xs">
                  {activity.thirdHalf.type === 'beer' ? (
                    <Beer className="w-6 h-6 text-[#1F4E5F]" />
                  ) : activity.thirdHalf.type === 'smoothie' ? (
                    <Sparkles className="w-6 h-6 text-[#1F4E5F]" />
                  ) : activity.thirdHalf.type === 'picnic' ? (
                    <Sun className="w-6 h-6 text-[#1F4E5F]" />
                  ) : (
                    <Coffee className="w-6 h-6 text-[#1F4E5F]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#1F4E5F]">
                      Tercer Tiempo Organizado
                    </span>
                    <span className="text-[10px] font-black text-white bg-[#1F4E5F] px-2 py-0.5 rounded-full">
                      Social & Recovery
                    </span>
                  </div>
                  <h4 className="text-base font-black text-[#1F4E5F] mt-0.5">
                    {activity.thirdHalf.venue || 'Cafetería cercana'}
                  </h4>
                  {activity.thirdHalf.notes && (
                    <p className="text-xs sm:text-sm text-[#1F4E5F]/75 font-medium mt-1 leading-relaxed">
                      {activity.thirdHalf.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-white border border-[#1F4E5F]/20 text-xs font-bold text-[#1F4E5F] shrink-0 shadow-2xs flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-[#1F4E5F]" />
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
        <div className="flex flex-col h-96 bg-[#F7F7F7] rounded-3xl p-4 border border-[#1F4E5F]/5">
          {/* Ephemeral Chat Expiration Header */}
          <div className="mb-3 px-3 py-2 bg-white rounded-2xl border border-[#7FB77E]/20 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <Clock className="w-3.5 h-3.5 text-[#7FB77E] shrink-0" />
              <span className="text-[11px] font-black text-[#1F4E5F] truncate">
                Chat Temporal del Evento
              </span>
            </div>
            <span className="text-[9px] font-bold text-[#7FB77E] bg-[#7FB77E]/10 px-2 py-0.5 rounded-full shrink-0">
              ⏳ Cierra 24h tras el entreno
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {chatMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[#1F4E5F]/50">
                Aún no hay mensajes en este Crew. ¡Sé el primero en saludar!
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-2.5">
                  {msg.senderAvatar ? (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-full object-cover border border-[#1F4E5F]/10 shrink-0 mt-0.5"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {msg.senderName.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 bg-white p-3 rounded-2xl shadow-2xs border border-[#1F4E5F]/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold text-[#1F4E5F]">
                        {msg.senderName}
                      </span>
                      <span className="text-[10px] text-[#1F4E5F]/40">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#1F4E5F]/90 leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSend} className="pt-3 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe un mensaje al Crew..."
              className="flex-1 px-4 py-2 bg-white rounded-full text-xs font-medium text-[#1F4E5F] border border-[#1F4E5F]/15 focus:border-[#7FB77E] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2 rounded-full bg-[#7FB77E] hover:bg-[#6ea26d] disabled:opacity-40 text-white text-xs font-black flex items-center justify-center cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile/Tablet Sticky Bottom Action CTA (Hidden on Desktop) */}
      <div className="pt-4 border-t border-[#1F4E5F]/10 flex lg:hidden items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#1F4E5F] block">
            {activity.date} a las {activity.time}h
          </span>
          <span className="text-[11px] text-[#7FB77E] font-bold">
            {activity.currentMembers.length}/{activity.maxMembers} plazas ocupadas
          </span>
        </div>

        <button
          type="button"
          disabled={isFull && !isJoined}
          onClick={() => onJoin(activity.id)}
          className={`px-7 py-3 rounded-full text-xs font-black transition-all flex items-center gap-2 shadow-md cursor-pointer ${
            isJoined
              ? 'bg-[#7FB77E] text-white shadow-xs'
              : isFull
                ? 'bg-[#1F4E5F]/10 text-[#1F4E5F]/50 cursor-not-allowed'
                : 'bg-[#7FB77E] hover:bg-[#6ea26d] text-white active:scale-95'
          }`}
        >
          {isJoined ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>You're In</span>
            </>
          ) : isFull ? (
            <span>Crew Completo</span>
          ) : (
            <>
              <span>Unirme al Crew</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
