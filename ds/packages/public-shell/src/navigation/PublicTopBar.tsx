'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Menu } from 'lucide-react';
import { useBrandTheme } from '../theme/useBrandTheme';
import type { PublicTopBarProps } from './types';

export const PublicTopBar: React.FC<PublicTopBarProps> = ({
  navigation,
  activeRouteId,
  onNavigate,
  logoSlot,
  centerSlot,
  rightSlot,
  onOpenDrawer,
  showDrawerTrigger = true,
  className,
}) => {
  const { theme } = useBrandTheme();

  return (
    <header
      className={clsx(
        'sticky top-0 z-30 w-full h-16',
        'bg-white/95 backdrop-blur-md border-b border-slate-200',
        'px-4 sm:px-6 lg:px-8',
        'flex items-center justify-between',
        className,
      )}
    >
      {/* Left: Drawer Trigger (Mobile/Tablet) + Logo */}
      <div className="flex items-center gap-3">
        {showDrawerTrigger && (
          <button
            type="button"
            onClick={onOpenDrawer}
            aria-label="Abrir menú"
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[var(--lpd-brand-primary)]"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {logoSlot ? (
          logoSlot
        ) : (
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate?.(navigation?.defaultRouteId ?? 'home')}>
            {theme.logos.fullSvg ? (
              <div
                className="h-8 flex items-center"
                dangerouslySetInnerHTML={{ __html: theme.logos.fullSvg }}
              />
            ) : (
              <span className="text-xl font-bold tracking-tight text-[var(--lpd-brand-primary)]">
                {theme.name}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Center: Search / Tabs / Custom slot */}
      {centerSlot ? (
        <div className="hidden md:flex flex-1 max-w-md mx-6">{centerSlot}</div>
      ) : navigation?.routes ? (
        <nav className="hidden lg:flex items-center gap-1">
          {navigation.routes
            .filter((route) => (route.visibility ?? ['desktop']).includes('desktop') && route.presentation !== 'action')
            .map((route) => {
              const isActive = route.id === activeRouteId;
              return (
                <button
                  key={route.id}
                  type="button"
                  onClick={() => onNavigate?.(route.id)}
                  className={clsx(
                    'px-3.5 py-2 text-sm font-medium rounded-lg transition-colors min-h-[44px] flex items-center gap-1.5',
                    isActive
                      ? 'text-[var(--lpd-brand-primary)] bg-slate-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
                  )}
                >
                  <span>{route.label}</span>
                  {Boolean(route.badgeCount && route.badgeCount > 0) && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-bold bg-[var(--lpd-brand-primary)] text-white">
                      {route.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
        </nav>
      ) : null}

      {/* Right: Auth Action / CTA / Profile Slot */}
      <div className="flex items-center gap-3">
        {rightSlot}
      </div>
    </header>
  );
};
