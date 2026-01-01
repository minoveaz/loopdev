import { useMemo, useEffect, useRef, useCallback } from 'react';
import { ToastProps, ToastVariant } from './types';
import { toast } from './toastStore';

/**
 * @hook useToastItem
 * @description Lógica visual para un item individual de Toast.
 * Sincronización total con la estética validada en el laboratorio.
 */
export const useToastItem = (props: ToastProps) => {
  const { variant = 'info', duration = 5000, id } = props;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingTimeRef = useRef<number>(duration);

  const startTimer = useCallback(() => {
    if (variant === 'loading') return;
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      toast.dismiss(id);
    }, remainingTimeRef.current);
  }, [id, variant]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current -= elapsed;
    }
  }, []);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  const handleMouseEnter = () => stopTimer();
  const handleMouseLeave = () => {
    if (remainingTimeRef.current > 0) startTimer();
  };

  const visualConfig = useMemo(() => {
    const isAI = variant === 'loading';
    
    const statusMap: Record<ToastVariant, { border: string; icon: string; bg: string; text: string; buttonVariant: any; metaBg: string; titleColor: string; grid: 'blueprint' | 'neural' }> = {
      success: { 
        border: 'border-l-status-success', icon: 'check_circle', bg: 'bg-status-success/10', 
        text: 'text-green-700 dark:text-status-success', buttonVariant: 'ghost',
        metaBg: 'bg-slate-50 border-slate-200 dark:bg-transparent dark:border-transparent',
        titleColor: 'text-slate-900 dark:text-slate-200', grid: 'blueprint' 
      },
      error: { 
        border: 'border-l-danger', icon: 'error', bg: 'bg-danger/10', 
        text: 'text-red-700 dark:text-danger', buttonVariant: 'danger',
        metaBg: 'bg-slate-50 border-slate-200 dark:bg-transparent dark:border-transparent',
        titleColor: 'text-slate-900 dark:text-slate-200', grid: 'blueprint' 
      },
      warning: { 
        border: 'border-l-accent', icon: 'warning', bg: 'bg-accent', 
        text: 'text-slate-950', buttonVariant: 'energy',
        metaBg: 'bg-slate-950/10 border-slate-950/20',
        titleColor: 'text-slate-950', grid: 'blueprint' 
      },
      info: { 
        border: 'border-l-primary', icon: 'info', bg: 'bg-primary/10', 
        text: 'text-blue-700 dark:text-primary', buttonVariant: 'primary',
        metaBg: 'bg-slate-50 border-slate-200 dark:bg-transparent dark:border-transparent',
        titleColor: 'text-slate-900 dark:text-slate-200', grid: 'blueprint' 
      },
      loading: { 
        border: 'border-l-innovation-purple', icon: 'auto_awesome', bg: 'bg-innovation-purple/10', 
        text: 'text-innovation-purple dark:text-purple-400', buttonVariant: 'ghost',
        metaBg: 'bg-slate-50 border-slate-200 dark:bg-transparent dark:border-transparent',
        titleColor: 'text-innovation-purple', grid: 'neural' 
      }
    };

    const config = statusMap[variant];

    return {
      isAI,
      gridType: config.grid,
      borderColor: config.border,
      iconName: config.icon,
      iconBg: config.bg,
      accentColor: config.text,
      buttonVariant: config.buttonVariant,
      metaBg: config.metaBg,
      titleColor: config.titleColor
    };
  }, [variant]);

  return {
    visualConfig,
    handleMouseEnter,
    handleMouseLeave
  };
};