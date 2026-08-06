'use client';

'use client';

import { useMemo } from 'react';

export const useBadge = (props: any) => {
  const { 
    variant = 'ghost', 
    status = 'neutral', 
    isTechnical = false, 
    isLive = false,
    className = '' 
  } = props;

  const dynamicStyles = useMemo(() => {
    // 1. PRIMARY STATUS (Conectado a la DB)
    if (status === 'primary') {
      if (variant === 'solid') return 'bg-[var(--comp-primary,#135bec)] text-white border-transparent';
      if (variant === 'outline') return 'bg-transparent border border-[var(--comp-primary,#135bec)]/30 text-[var(--comp-primary,#135bec)]';
      if (variant === 'ghost') return 'bg-[var(--comp-primary-soft,rgba(19,91,236,0.1))] text-[var(--comp-primary,#135bec)] border-[var(--comp-primary-soft,rgba(19,91,236,0.2))]';
      if (variant === 'glass') return 'bg-white/5 backdrop-blur-md border border-white/10 text-[var(--comp-primary,#135bec)] shadow-[0_0_8px_var(--comp-primary-shadow,rgba(19,91,236,0.2))]';
    }
    
    // 2. ERROR / DANGER STATUS (Conectado a la DB)
    if (status === 'error') {
      if (variant === 'solid') return 'bg-[var(--lpd-color-status-error,#EF4444)] text-white border-transparent';
      if (variant === 'outline') return 'bg-transparent border border-[var(--lpd-color-status-error,#EF4444)]/30 text-[var(--lpd-color-status-error,#EF4444)]';
      if (variant === 'ghost') return 'bg-[var(--lpd-color-status-error,#EF4444)]/10 text-[var(--lpd-color-status-error,#EF4444)] border-[var(--lpd-color-status-error,#EF4444)]/20';
      if (variant === 'glass') return 'bg-white/5 backdrop-blur-md border border-white/10 text-[var(--lpd-color-status-error,#EF4444)] shadow-[0_0_8px_var(--lpd-color-status-error,#EF4444)]';
    }

    if (status === 'energy') {
      if (variant === 'solid') return 'bg-[var(--lpd-color-brand-energy,#FFD025)] text-slate-900 border-transparent font-black';
      if (variant === 'outline') return 'bg-transparent border border-[var(--lpd-color-brand-energy,#FFD025)]/30 text-yellow-600 dark:text-[var(--lpd-color-brand-energy,#FFD025)]';
      if (variant === 'ghost') return 'bg-[var(--lpd-color-brand-energy,#FFD025)]/10 text-yellow-700 dark:text-[var(--lpd-color-brand-energy,#FFD025)] border-[var(--lpd-color-brand-energy,#FFD025)]/20';
      if (variant === 'glass') return 'bg-white/5 backdrop-blur-md border border-white/10 text-[var(--lpd-color-brand-energy,#FFD025)] shadow-[0_0_8px_rgba(255,208,37,0.2)]';
    }

    if (status === 'innovation') {
      if (variant === 'solid') return 'bg-innovation-purple text-white border-transparent';
      if (variant === 'outline') return 'bg-transparent border border-innovation-purple/30 text-innovation-purple';
      if (variant === 'ghost') return 'bg-innovation-soft-purple text-innovation-purple dark:text-purple-400 border-innovation-purple/20';
      if (variant === 'glass') return 'bg-white/5 backdrop-blur-md border border-white/10 text-purple-400 shadow-[0_0_8px_rgba(147,51,234,0.2)]';
    }

    if (status === 'success') {
      if (variant === 'solid') return 'bg-[var(--lpd-color-status-success,#10B981)] text-white border-transparent';
      if (variant === 'outline') return 'bg-transparent border border-[var(--lpd-color-status-success,#10B981)]/30 text-[var(--lpd-color-status-success,#10B981)]';
      if (variant === 'ghost') return 'bg-[var(--lpd-color-status-success,#10B981)]/10 text-[var(--lpd-color-status-success,#10B981)] border-[var(--lpd-color-status-success,#10B981)]/20';
      return 'bg-white/5 backdrop-blur-md border border-white/10 text-emerald-400';
    }
    
    // Default Neutral
    if (variant === 'solid') return 'bg-slate-500 text-white border-transparent';
    if (variant === 'outline') return 'bg-transparent border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400';
    if (variant === 'ghost') return 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/5';
    return 'bg-white/5 backdrop-blur-md border border-white/10 text-slate-400';
  }, [variant, status]);

  const typographyClass = isTechnical 
    ? 'text-[10px] font-black uppercase tracking-[0.1em]'
    : 'text-xs font-mono font-bold';
  
  const finalClassName = `
    inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border transition-all duration-300
    ${typographyClass}
    ${dynamicStyles}
    ${className}
  `;

  const isDotAnimated = isLive || status === 'energy' || status === 'innovation';

  return {
    ...props,
    finalClassName,
    isDotAnimated
  };
};
