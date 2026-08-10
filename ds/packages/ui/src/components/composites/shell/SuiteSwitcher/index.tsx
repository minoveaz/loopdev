'use client';

import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { 
  TechnicalDropdown, 
  TechnicalMenuItem, 
  UIKitIllustration,
  LpdText,
  TechnicalTooltip
} from '../../../atoms';
import { SuiteSwitcherProps } from './types';
import { useSuiteSwitcher } from './useSuiteSwitcher';

/**
 * Mapeo oficial de ilustraciones por Suite
 */
const SuiteIllustration: React.FC<{ suiteId: string, className?: string }> = ({ suiteId, className }) => {
  switch (suiteId) {
    case 'marketingStudio':
      return <UIKitIllustration className={className} />;
    default:
      return <LucideIcons.Package className={className} />;
  }
};

/**
 * @component SuiteSwitcher
 * @description Portal de navegación global para alternar entre suites industriales.
 * @category Composites
 * @phase 1
 */
export const SuiteSwitcher: React.FC<SuiteSwitcherProps> = (props) => {
  const { availableSuites, onSuiteChange, accessMap = {}, onOpenChange, showIcon = true } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { triggerClasses, currentSuite } = useSuiteSwitcher(props);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  return (
    <TechnicalDropdown 
      open={isOpen}
      onOpenChange={handleOpenChange}
      trigger={
        <button className={triggerClasses}>
          {showIcon && (
            <div className="h-5 w-5 shrink-0 opacity-80 transition-opacity group-hover:opacity-100">
              <SuiteIllustration suiteId={currentSuite.suiteId} className="text-primary h-full w-full" />
            </div>
          )}
          <div className="flex items-center gap-2">
            <LpdText
              size="xs"
              weight="normal"
              variant="sans"
              className="text-text-main group-hover:text-accent dark:text-white"
            >
              {currentSuite.suiteName}
            </LpdText>
            <LucideIcons.ChevronDown
              size={12}
              className="text-text-muted group-hover:text-accent opacity-40 transition-colors"
            />
          </div>
        </button>
      }
    >
      <div className="dark:bg-surface-elevated flex w-[260px] flex-col bg-white">
        {/* Header Minimalista Estándar Lab */}
        <div className="border-border-technical dark:bg-surface-elevated border-b bg-white p-4 pb-2">
          <LpdText size="sm" weight="bold" className="text-text-main dark:text-white">
            Suites Disponibles
          </LpdText>
        </div>

        <div className="flex flex-col py-1">
          {availableSuites.map((suite) => {
            const isActive = suite.suiteId === currentSuite.suiteId;
            const isDisabled = accessMap[suite.suiteId] === 'disabled';

            return (
              <TechnicalTooltip 
                key={suite.suiteId}
                content={isDisabled ? "Esta suite no está incluida en tu plan actual" : undefined}
                side="right"
              >
                <TechnicalMenuItem 
                  label={suite.suiteName}
                  isActive={isActive}
                  isDisabled={isDisabled}
                  onClick={() => !isActive && !isDisabled && onSuiteChange(suite.suiteId)}
                >
                  <div className={`bg-background-subtle border-border-technical relative flex h-7 w-7 shrink-0 items-center justify-center rounded border dark:bg-white/5`}>
                    <SuiteIllustration suiteId={suite.suiteId} className="h-4 w-4" />
                    {isDisabled && (
                      <div className="bg-surface-elevated border-border-technical absolute -right-1 -top-1 rounded-full border p-0.5">
                        <LucideIcons.Lock size={8} className="text-text-muted" />
                      </div>
                    )}
                  </div>
                  <span className="text-technical flex-1 truncate">{suite.suiteName}</span>
                  {isDisabled && (
                    <span className="text-text-muted font-mono text-[8px] uppercase tracking-tighter opacity-40">Plan_Locked</span>
                  )}
                </TechnicalMenuItem>
              </TechnicalTooltip>
            );
          })}
        </div>

        <div className="border-border-technical border-t">
          <TechnicalMenuItem 
            label="Volver al Launchpad"
            icon="Home"
            onClick={() => onSuiteChange('os.home')}
          />
        </div>
      </div>
    </TechnicalDropdown>
  );
};