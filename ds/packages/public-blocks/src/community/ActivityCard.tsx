'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Calendar, Check, ChevronRight, Clock, MapPin } from 'lucide-react';
import { CrewAvatarGroup } from './CrewAvatarGroup';
import type { ActivityCardProps } from './types';

const getSportEmoji = (sport: string) => {
  const s = sport.toLowerCase();
  if (s.includes('run')) return '🏃';
  if (s.includes('padel') || s.includes('pádel')) return '🎾';
  if (s.includes('hik') || s.includes('senderismo')) return '🥾';
  if (s.includes('cicl') || s.includes('bici')) return '🚴';
  if (s.includes('crossfit') || s.includes('wod')) return '🏋️';
  return '⚡';
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  data,
  onJoin,
  onSelect,
  isSelected = false,
  className,
}) => {
  const isFull = data.currentMembers.length >= data.maxMembers;
  const isUserInCrew = Boolean(data.isJoined);
  const sportEmoji = getSportEmoji(data.sport);

  return (
    <div
      onClick={() => onSelect?.(data.id)}
      className={clsx(
        'bg-white rounded-3xl overflow-hidden border transition-all duration-200 cursor-pointer group',
        isSelected
          ? 'border-[var(--lpd-brand-secondary,#1F4E5F)] ring-2 ring-[var(--lpd-brand-secondary,#1F4E5F)]/20 shadow-md'
          : 'border-[#1F4E5F]/10 shadow-xs hover:border-[#1F4E5F]/30',
        className,
      )}
    >
      {/* Image & Header Overlay */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1F4E5F]/5">
        {data.image ? (
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1F4E5F]/80 to-[#1F4E5F] flex items-center justify-center text-4xl">
            {sportEmoji}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E5F]/85 via-transparent to-transparent" />

        {/* Sport & Level Tag */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full font-black text-xs bg-white text-[#1F4E5F] shadow-xs flex items-center gap-1">
            <span>{sportEmoji}</span>
            <span className="capitalize">{data.sport}</span>
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#1F4E5F]/80 text-white backdrop-blur-md">
            {data.level}
          </span>
        </div>

        {/* Title & Location on Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-extrabold text-base leading-tight drop-shadow-xs">{data.title}</h3>
          <div className="flex items-center gap-1.5 text-xs text-white/90 mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#7FB77E]" />
            <span className="truncate">{data.location}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        {/* Captain & Date Row */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F7F7F7]">
          <div className="flex items-center gap-2.5">
            {data.captain.avatarUrl ? (
              <img
                src={data.captain.avatarUrl}
                alt={data.captain.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#1F4E5F]/20"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#1F4E5F]/10 text-[#1F4E5F] font-extrabold text-xs flex items-center justify-center border-2 border-[#1F4E5F]/20">
                {data.captain.name.charAt(0)}
              </div>
            )}
            <div>
              <span className="text-[10px] font-extrabold text-[#7FB77E] uppercase tracking-wider block leading-none">
                Captain
              </span>
              <span className="text-xs font-bold text-[#1F4E5F]">
                {data.captain.name}
                {data.captain.age ? `, ${data.captain.age} años` : ''}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-xs font-bold text-[#1F4E5F]">
              <Calendar className="w-3.5 h-3.5 text-[#7FB77E]" />
              <span>{data.date}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#1F4E5F]/60 justify-end mt-0.5">
              <Clock className="w-3 h-3" />
              <span>{data.time} h</span>
            </div>
          </div>
        </div>

        {/* Pace / Details pill */}
        {data.paceOrDetails && (
          <div className="text-xs font-semibold text-[#1F4E5F] bg-[#F7F7F7] px-3 py-1.5 rounded-xl inline-block border border-[#1F4E5F]/5">
            ⚡ {data.paceOrDetails}
          </div>
        )}

        {/* Footer: Crew Members & CTA Button */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <CrewAvatarGroup members={data.currentMembers} size="sm" />
            <span className="text-xs font-bold text-[#1F4E5F]/70">
              Crew {data.currentMembers.length}/{data.maxMembers}
            </span>
          </div>

          <button
            type="button"
            disabled={isFull && !isUserInCrew}
            onClick={(e) => {
              e.stopPropagation();
              onJoin?.(data.id);
            }}
            className={clsx(
              'px-4 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer',
              isUserInCrew
                ? 'bg-[#7FB77E] text-white shadow-[#7FB77E]/20'
                : isFull
                  ? 'bg-[#1F4E5F]/10 text-[#1F4E5F]/50 cursor-not-allowed'
                  : 'bg-[#1F4E5F] hover:bg-[#183e4c] text-white active:scale-95 shadow-[#1F4E5F]/15',
            )}
          >
            {isUserInCrew ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>You're In</span>
              </>
            ) : isFull ? (
              <span>Crew Completo</span>
            ) : (
              <>
                <span>Join Crew</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
