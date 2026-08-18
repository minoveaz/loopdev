import React from 'react';

interface StatusDotProps {
  status: 'neutral' | 'primary' | 'energy' | 'innovation' | 'success' | 'error';
  isAnimated?: boolean;
}

export const StatusDot: React.FC<StatusDotProps> = ({ status, isAnimated }) => {
  const colorStyles: Record<string, React.CSSProperties> = {
    neutral: { backgroundColor: 'currentColor', opacity: 0.4 },
    primary: { backgroundColor: 'var(--lpd-color-brand-primary, #135bec)' },
    energy: {
      backgroundColor: 'var(--lpd-color-brand-energy, #ffd025)',
      boxShadow: '0 0 8px rgba(255, 208, 37, 0.6)',
    },
    innovation: {
      backgroundColor: 'var(--lpd-color-innovation-purple, #9333ea)',
      boxShadow: '0 0 8px rgba(147, 51, 234, 0.6)',
    },
    success: { backgroundColor: 'var(--lpd-color-status-success, #10b981)' },
    error: { backgroundColor: 'var(--lpd-color-status-error, #ef4444)' },
  };

  return (
    <span
      className={`h-1.5 w-1.5 shrink-0 rounded-full ${isAnimated ? 'animate-badge-pulse' : ''}`}
      style={colorStyles[status] || colorStyles.neutral}
    />
  );
};