'use client';

import React from 'react';
import { LpdText, Skeleton } from '@loopdev/ui';
import { ToneProfileCard } from '../ToneProfileCard';
import { VoiceToneBlockProps } from './types';

/**
 * @component VoiceToneBlock
 * @description Orchestrator for brand voice profiles.
 */
export const VoiceToneBlock: React.FC<VoiceToneBlockProps> = ({
  profiles,
  isLoading,
  isEditable,
  onProfileClick
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 pb-2 border-b border-border-technical/30">
        <LpdText size="sm" weight="bold" className="text-text-main uppercase tracking-tight">
          Voice & Tone Profiles
        </LpdText>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {profiles.map((profile) => (
          <ToneProfileCard
            key={profile.id}
            profile={profile}
            onClick={() => onProfileClick?.(profile)}
          />
        ))}
      </div>
    </div>
  );
};
