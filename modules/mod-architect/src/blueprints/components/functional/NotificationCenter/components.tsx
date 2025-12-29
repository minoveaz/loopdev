
import React from 'react';
import { type Notification, getIconForType, getStylesForType } from './utils';

// --- Components ---

export const CenterContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full max-w-sm bg-white dark:bg-surface-dark rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col ${className}`}>
    {children}
  </div>
);

export const CenterHeader: React.FC<{ 
  unreadCount: number; 
  onMarkAllRead: () => void;
  filter: 'all' | 'unread';
  onFilterChange: (f: 'all' | 'unread') => void;
}> = ({ unreadCount, onMarkAllRead, filter, onFilterChange }) => (
  <div className="flex flex-col border-b border-slate-100 dark:border-slate-700 bg-white/50 dark:bg-surface-dark backdrop-blur-sm z-10 sticky top-0">
    <div className="p-4 pb-2 flex justify-between items-center">
      <h3 className="font-bold text-[#0d121b] dark:text-white text-sm">Notifications</h3>
      <button 
        onClick={onMarkAllRead}
        disabled={unreadCount === 0}
        className={`text-[10px] font-medium transition-colors ${
          unreadCount === 0 
            ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' 
            : 'text-primary hover:text-primary-dark hover:underline cursor-pointer'
        }`}
      >
        Mark all as read
      </button>
    </div>
    <div className="px-4 flex gap-4">
      <button 
        onClick={() => onFilterChange('all')}
        className={`pb-2 text-xs font-medium border-b-2 transition-colors ${
          filter === 'all' 
            ? 'text-primary border-primary' 
            : 'text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        All
      </button>
      <button 
        onClick={() => onFilterChange('unread')}
        className={`pb-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
          filter === 'unread' 
            ? 'text-primary border-primary' 
            : 'text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
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

export const NotificationItem: React.FC<{ 
  item: Notification; 
  onRead: (id: string) => void; 
  onRemove: (id: string) => void;
}> = ({ item, onRead, onRemove }) => {
  const styles = getStylesForType(item.type);
  
  const bgClass = !item.isRead 
    ? 'bg-primary/5 dark:bg-primary/5' 
    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50';

  return (
    <div 
      className={`relative p-4 border-b border-slate-50 dark:border-slate-800 transition-all duration-200 group ${bgClass}`}
      onClick={() => !item.isRead && onRead(item.id)}
    >
      {/* Unread Indicator Bar */}
      {!item.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary animate-pulse"></div>
      )}

      <div className="flex gap-3">
        {/* Icon */}
        <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${styles.iconBg}`}>
          <span className="material-symbols-outlined text-sm">{getIconForType(item.type)}</span>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <p className={`text-xs font-bold truncate pr-2 ${item.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-[#0d121b] dark:text-white'}`}>
              {item.title}
            </p>
            {/* Close Button (Visible on Hover) */}
            <button 
              onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-0.5 -mt-1 -mr-1"
              aria-label="Dismiss notification"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
            {item.message}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 font-mono">
            {item.timestamp}
          </span>
        </div>
      </div>
    </div>
  );
};

export const CenterFooter: React.FC<{ 
  onClear: () => void;
  onViewAll?: () => void;
}> = ({ onClear, onViewAll }) => (
  <div className="p-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex justify-center gap-4">
    <button 
      onClick={onViewAll}
      className="text-xs font-medium text-slate-500 hover:text-primary transition-colors"
    >
      View All Activity
    </button>
    <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 self-center"></div>
    <button 
      onClick={onClear}
      className="text-xs font-medium text-slate-500 hover:text-red-500 transition-colors"
    >
      Clear List
    </button>
  </div>
);

export const EmptyView: React.FC<{ filter: 'all' | 'unread' }> = ({ filter }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
      <span className="material-symbols-outlined text-slate-400">
        {filter === 'unread' ? 'done_all' : 'notifications_off'}
      </span>
    </div>
    <p className="text-xs font-bold text-[#0d121b] dark:text-white">
      {filter === 'unread' ? 'All caught up!' : 'No notifications'}
    </p>
    <p className="text-[10px] text-slate-500 mt-1">
      {filter === 'unread' ? 'No new notifications at this time.' : 'Your history is empty.'}
    </p>
  </div>
);
