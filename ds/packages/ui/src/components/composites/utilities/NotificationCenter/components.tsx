'use client';

import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { X, Check, ArrowRight, BellOff, CheckCheck } from 'lucide-react';
import {
  TechnicalLabel,
  LpdText,
  StatusPulse,
  Divider
} from '../../../atoms';import { NotificationItem } from './types';

/**
 * @component CenterHeader
 * @description Cabecera exacta al Blueprint original utilizando tokens de alta fidelidad.
 */
export const CenterHeader: React.FC<{ 
  unreadCount: number; 
  onMarkAllRead: () => void;
  filter: 'all' | 'unread';
  onFilterChange: (f: 'all' | 'unread') => void;
}> = ({ unreadCount, onMarkAllRead, filter, onFilterChange }) => (
  <div className="flex flex-col border-b border-border-technical bg-white dark:bg-surface-elevated sticky top-0 z-20">
    <div className="p-4 pb-2 flex justify-between items-center">
      <h3 className="text-sm font-bold text-text-main dark:text-white">Notifications</h3>
      <DropdownMenu.Item 
        onSelect={(e) => {
          e.preventDefault();
          onMarkAllRead();
        }}
        disabled={unreadCount === 0}
        className={`text-[10px] font-medium transition-colors outline-none cursor-pointer ${
          unreadCount === 0 
            ? 'text-text-muted/40 cursor-not-allowed' 
            : 'text-primary hover:text-primary-light hover:underline'
        }`}
      >
        Mark all as read
      </DropdownMenu.Item>
    </div>
    
    <div className="px-4 flex gap-4">
      <button 
        type="button"
        onClick={() => onFilterChange('all')}
        className={`pb-2 text-xs font-medium border-b-2 transition-all duration-200 ${
          filter === 'all' 
            ? 'text-primary border-primary' 
            : 'text-text-muted border-transparent hover:text-text-main dark:hover:text-white'
        }`}
      >
        All
      </button>
      <button 
        type="button"
        onClick={() => onFilterChange('unread')}
        className={`pb-2 text-xs font-medium border-b-2 transition-all duration-300 flex items-center gap-1.5 ${
          filter === 'unread' 
            ? 'text-primary border-primary' 
            : 'text-text-muted border-transparent hover:text-text-main dark:hover:text-white'
        }`}
      >
        Unread
        {unreadCount > 0 && (
          <span className="bg-primary text-white text-[9px] font-bold px-1.5 rounded-full min-w-[1.25rem] text-center">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  </div>
);

/**
 * @component NotificationCard
 * @description Réplica exacta de la tarjeta utilizando tokens semánticos.
 */
export const NotificationCard: React.FC<{ 
  item: NotificationItem; 
  onRead: (id: string) => void; 
  onRemove: (id: string) => void;
}> = ({ item, onRead, onRemove }) => {
  const isUnread = !item.read;
  const pulseVariant = item.type === 'error' ? 'danger' : 
                       item.type === 'warning' ? 'energy' : 
                       item.type === 'success' ? 'success' : 'primary';

  return (
    <DropdownMenu.Item
      onSelect={(e) => {
        e.preventDefault();
        if (isUnread) onRead(item.id);
      }}
      className={`relative p-4 border-b border-border-technical transition-all duration-200 group/card cursor-pointer outline-none ${
        isUnread ? 'bg-primary/5' : 'hover:bg-background-subtle dark:hover:bg-white/[0.02]'
      }`}
    >
      {/* Barra lateral de no leído */}
      {isUnread && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
      )}

      <div className="flex gap-3">
        {/* Icono circular minimalista */}
        <div className="mt-0.5 shrink-0">
          <div className="w-8 h-8 rounded-full bg-background-subtle dark:bg-white/5 flex items-center justify-center border border-border-technical">
            <StatusPulse variant={pulseVariant} size="sm" />
          </div>
        </div>

        {/* Contenido técnico denso */}
        <div className="flex flex-col gap-1 flex-1 min-w-0 text-left">
          <div className="flex justify-between items-start">
            <p className={`text-xs font-bold truncate pr-2 ${isUnread ? 'text-text-main dark:text-white' : 'text-text-muted'}`}>
              {item.title}
            </p>
            
            <button 
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(item.id); }}
              className="opacity-0 group-hover/card:opacity-100 text-text-muted hover:text-danger transition-all p-0.5 -mt-1 -mr-1"
            >
              <X size={14} />
            </button>
          </div>

          <p className="text-technical text-text-muted leading-snug line-clamp-2">
            {item.description}
          </p>

          <span className="text-micro font-mono text-text-muted mt-1 uppercase tracking-tighter opacity-60">
            {item.timestamp}
          </span>
        </div>
      </div>
    </DropdownMenu.Item>
  );
};

/**
 * @component CenterFooter
 */
export const CenterFooter: React.FC<{ onClear: () => void; onViewAll?: () => void; }> = ({ onClear, onViewAll }) => (
  <div className="p-3 bg-background-subtle dark:bg-surface-elevated border-t border-border-technical flex justify-center items-center gap-4 sticky bottom-0 z-20">
    <DropdownMenu.Item onSelect={(e) => { e.preventDefault(); onViewAll?.(); }} className="text-xs font-medium text-text-muted hover:text-primary transition-colors outline-none cursor-pointer">
      View All Activity
    </DropdownMenu.Item>
    <Divider orientation="vertical" thickness="technical" className="h-4" />
    <DropdownMenu.Item onSelect={(e) => { e.preventDefault(); onClear(); }} className="text-xs font-medium text-text-muted hover:text-danger transition-colors outline-none cursor-pointer">
      Clear List
    </DropdownMenu.Item>
  </div>
);

/**
 * @component EmptyView
 */
export const EmptyView: React.FC<{ filter: 'all' | 'unread' }> = ({ filter }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white dark:bg-surface-elevated">
    <div className="w-12 h-12 bg-background-subtle dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
      {filter === 'unread' ? <CheckCheck size={20} className="text-emerald-500 opacity-40" /> : <BellOff size={20} className="text-text-muted/40" />}
    </div>
    <p className="text-xs font-bold text-text-main dark:text-white uppercase tracking-tight">
      {filter === 'unread' ? 'All caught up!' : 'No notifications'}
    </p>
    <p className="text-technical text-text-muted mt-1">
      {filter === 'unread' ? 'No new notifications at this time.' : 'Your history is empty.'}
    </p>
  </div>
);