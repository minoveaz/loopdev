'use client';

import React from 'react';
import { clsx } from 'clsx';
import type { CrewAvatarGroupProps } from './types';

const sizeClasses = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
} as const;

export const CrewAvatarGroup: React.FC<CrewAvatarGroupProps> = ({
  members,
  maxVisible = 3,
  size = 'md',
  className,
}) => {
  const visibleMembers = members.slice(0, maxVisible);
  const remainingCount = members.length - maxVisible;
  const sizeClass = sizeClasses[size];

  return (
    <div className={clsx('flex items-center -space-x-2', className)}>
      {visibleMembers.map((member) => (
        <div
          key={member.id}
          title={member.name}
          className={clsx(
            'relative inline-flex items-center justify-center rounded-full ring-2 ring-white font-bold text-slate-700 bg-slate-200 overflow-hidden flex-shrink-0',
            sizeClass,
          )}
        >
          {member.avatarUrl ? (
            <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            <span>{member.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className={clsx(
            'relative inline-flex items-center justify-center rounded-full ring-2 ring-white font-bold bg-slate-800 text-white flex-shrink-0',
            sizeClass,
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
