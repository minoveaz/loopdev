import React from 'react';

interface StatusDotProps {
  status: 'neutral' | 'primary' | 'energy' | 'innovation' | 'success' | 'error';
  isAnimated?: boolean;
}

export const StatusDot: React.FC<StatusDotProps> = ({ status, isAnimated }) => {
  const colors: Record<string, string> = {
    neutral: 'bg-current opacity-40',
    primary: 'bg-[var(--comp-primary,#135bec)]',
    energy: 'bg-energy shadow-[0_0_8px_rgba(255,208,37,0.6)]',
    innovation: 'bg-innovation-purple shadow-[0_0_8px_rgba(147,51,234,0.6)]',
    success: 'bg-status-success',
    error: 'bg-danger'
  };

  return (
    <span className={`
      h-1.5 w-1.5 rounded-full flex-shrink-0
      ${colors[status] || colors.neutral}
      ${isAnimated ? 'animate-badge-pulse' : ''}
    `}></span>
  );
};