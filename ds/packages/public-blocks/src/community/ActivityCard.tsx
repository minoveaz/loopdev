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
        'group cursor-pointer overflow-hidden rounded-3xl border bg-white transition-all duration-200',
        isSelected
          ? 'ring-[var(--lpd-brand-secondary,#1F4E5F)]/20 border-[var(--lpd-brand-secondary,#1F4E5F)] shadow-md ring-2'
          : 'shadow-xs border-[#1F4E5F]/10 hover:border-[#1F4E5F]/30',
        className,
      )}
    >
      {/* Image & Header Overlay */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1F4E5F]/5">
        {data.image ? (
          <img
            src={data.image}
            alt={data.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1F4E5F]/80 to-[#1F4E5F] text-4xl">
            {sportEmoji}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F4E5F]/85 via-transparent to-transparent" />

        {/* Sport & Level Tag */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="shadow-xs flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-black text-[#1F4E5F]">
            <span>{sportEmoji}</span>
            <span className="capitalize">{data.sport}</span>
          </span>
          <span className="rounded-full bg-[#1F4E5F]/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
            {data.level}
          </span>
        </div>

        {/* Title & Location on Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="drop-shadow-xs text-base font-extrabold leading-tight">{data.title}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-white/90">
            <MapPin className="h-3.5 w-3.5 text-[#7FB77E]" />
            <span className="truncate">{data.location}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="space-y-3 p-4">
        {/* Captain & Date Row */}
        <div className="flex items-center justify-between border-b border-[#F7F7F7] pb-3">
          <div className="flex items-center gap-2.5">
            {data.captain.avatarUrl ? (
              <img
                src={data.captain.avatarUrl}
                alt={data.captain.name}
                className="h-9 w-9 rounded-full border-2 border-[#1F4E5F]/20 object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#1F4E5F]/20 bg-[#1F4E5F]/10 text-xs font-extrabold text-[#1F4E5F]">
                {data.captain.name.charAt(0)}
              </div>
            )}
            <div>
              <span className="block text-[10px] font-extrabold uppercase leading-none tracking-wider text-[#7FB77E]">
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
              <Calendar className="h-3.5 w-3.5 text-[#7FB77E]" />
              <span>{data.date}</span>
            </div>
            <div className="mt-0.5 flex items-center justify-end gap-1 text-xs text-[#1F4E5F]/60">
              <Clock className="h-3 w-3" />
              <span>{data.time} h</span>
            </div>
          </div>
        </div>

        {/* Pace / Details pill */}
        {data.paceOrDetails && (
          <div className="inline-block rounded-xl border border-[#1F4E5F]/5 bg-[#F7F7F7] px-3 py-1.5 text-xs font-semibold text-[#1F4E5F]">
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
              'shadow-xs flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-extrabold transition-all',
              isUserInCrew
                ? 'bg-[#7FB77E] text-white shadow-[#7FB77E]/20'
                : isFull
                  ? 'cursor-not-allowed bg-[#1F4E5F]/10 text-[#1F4E5F]/50'
                  : 'bg-[#1F4E5F] text-white shadow-[#1F4E5F]/15 hover:bg-[#183e4c] active:scale-95',
            )}
          >
            {isUserInCrew ? (
              <>
                <Check className="h-3.5 w-3.5 stroke-[3]" />
                <span>You're In</span>
              </>
            ) : isFull ? (
              <span>Crew Completo</span>
            ) : (
              <>
                <span>Join Crew</span>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
