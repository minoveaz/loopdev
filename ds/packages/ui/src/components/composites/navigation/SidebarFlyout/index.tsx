'use client';

import React from 'react';
import { cn } from '../../../../helpers/cn';
import { LpdText, IconButton, Icon, Divider } from '../../../atoms';
import { SidebarFlyoutProps } from './types';

/**
 * @component SidebarFlyout
 * @description Panel de significado y contexto semántico.
 * Ayuda al usuario a entender la sección activa y ofrece sub-navegación.
 */
export const SidebarFlyout: React.FC<SidebarFlyoutProps> = (props) => {
  const {
    title,
    description,
    mode = 'learn',
    links = [],
    onClose,
    children,
    className
  } = props;

  return (
    <div className={cn("flex flex-col h-full bg-shell-canvas", className)}>
      {/* Header: Title & Close */}
      <div className="flex flex-col gap-2 p-6 border-b border-border-technical">
        <LpdText size="nano" weight="bold" className="text-primary uppercase tracking-widest opacity-40">
          {`// Context Panel`}
        </LpdText>
        <div className="flex items-center justify-between">
          <LpdText size="sm" weight="bold" className="text-text-main uppercase tracking-tight">
            {title}
          </LpdText>
          {onClose && (
            <IconButton 
              icon="close" 
              size="sm" 
              variant="ghost" 
              onClick={onClose}
              aria-label="Close Flyout"
            />
          )}
        </div>
        
        {description && (
          <LpdText size="xs" className="text-text-muted leading-relaxed">
            {description}
          </LpdText>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="flex flex-col gap-8">
          
          {/* MODO NAVEGACIÓN: Lista de Links */}
          {mode === 'navigate' && links.length > 0 && (
            <div className="flex flex-col gap-2">
              <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest opacity-40 mb-2">
                {`// Quick Navigation`}
              </LpdText>
              {links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => window.location.href = link.href}
                  className="flex items-center justify-between p-3 rounded-xl border border-border-technical bg-white/5 hover:bg-primary/5 hover:border-primary/20 transition-all group text-left"
                >
                  <div className="flex items-center gap-3">
                    {link.icon && <Icon name={link.icon} size="sm" className="text-text-muted group-hover:text-primary transition-colors" />}
                    <LpdText size="xs" weight="medium" className="text-text-main">
                      {link.label}
                    </LpdText>
                  </div>
                  <Icon name="arrow_right_alt" size="sm" className="text-text-muted opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>
              ))}
            </div>
          )}

          {/* MODO APRENDIZAJE / CUSTOM: Children */}
          {children && (
            <div className="flex flex-col gap-4">
              {mode === 'learn' && (
                <LpdText size="nano" weight="bold" className="text-text-muted uppercase tracking-widest opacity-40 mb-2">
                  {`// Learning Guide`}
                </LpdText>
              )}
              {children}
            </div>
          )}

        </div>
      </div>

      {/* Footer: Meta Info sutil */}
      <div className="p-4 border-t border-border-technical opacity-20">
        <LpdText size="nano" className="font-mono">CONTEXT_FLYOUT_V1</LpdText>
      </div>
    </div>
  );
};
