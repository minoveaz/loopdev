'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Compass, Home, MessageCircle, User } from 'lucide-react';
import type { PublicBottomNavProps } from './types';

const defaultIconMap: Record<string, React.FC<{ className?: string }>> = {
  Home,
  Compass,
  MessageCircle,
  User,
};

export const PublicBottomNav: React.FC<PublicBottomNavProps> = ({
  routes,
  activeRouteId,
  onNavigate,
  className,
}) => {
  return (
    <nav
      aria-label="Navegación principal móvil"
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-40 lg:hidden',
        'bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg',
        'pb-[env(safe-area-inset-bottom)]',
        className,
      )}
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {routes.map((route) => {
          const isActive = route.id === activeRouteId;
          const Icon = defaultIconMap[route.icon] ?? Home;

          return (
            <button
              key={route.id}
              type="button"
              onClick={() => onNavigate(route.id)}
              aria-current={isActive ? 'page' : undefined}
              className={clsx(
                'relative flex flex-col items-center justify-center flex-1 h-full min-h-[44px] min-w-[44px]',
                'transition-all duration-200 focus:outline-none',
                isActive
                  ? 'text-[var(--lpd-brand-primary)] font-semibold'
                  : 'text-slate-500 hover:text-slate-800',
              )}
            >
              <div className="relative">
                <Icon className={clsx('w-5 h-5 transition-transform', isActive && 'scale-110')} />
                {typeof route.badgeCount === 'number' && route.badgeCount > 0 && (
                  <span className="absolute -top-1 -right-2.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold bg-[var(--lpd-brand-primary)] text-white">
                    {route.badgeCount > 99 ? '99+' : route.badgeCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight leading-none">{route.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
