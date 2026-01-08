'use client';

import { useState, useMemo } from 'react';
import { SystemNoticeRailProps } from './index';
import { SuiteNotice } from '../../workspace/SuiteHomeLayout/types';

/**
 * @hook useSystemNoticeRail
 * @description Lógica de priorización y gestión de avisos de sistema.
 */
export const useSystemNoticeRail = (props: SystemNoticeRailProps) => {
  const { notices = [], onDismiss } = props;
  
  // 1. Estado local de IDs descartados (para persistencia en sesión)
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  // 2. Filtrado y Ordenamiento por Severidad (danger > warning > info > success)
  const activeNotices = useMemo(() => {
    const priority = { danger: 0, warning: 1, info: 2, success: 3 };
    
    return notices
      .filter(n => !dismissedIds.includes(n.id))
      .sort((a, b) => priority[a.severity] - priority[b.severity]);
  }, [notices, dismissedIds]);

  // 3. Manejador de cierre
  const handleDismiss = (id: string) => {
    setDismissedIds(prev => [...prev, id]);
    if (onDismiss) onDismiss(id);
  };

  return {
    activeNotices,
    handleDismiss,
    hasMultiple: activeNotices.length > 1,
    topNotice: activeNotices[0] || null
  };
};
