'use client';

import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { 
  TechnicalDropdown, 
  TechnicalMenuItem, 
  TechnicalDropdownSeparator, 
  TechnicalDropdownGroup,
  UIKitIllustration,
  LpdText,
  TechnicalLabel,
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
  const { availableSuites, onSuiteChange, accessMap = {}, onOpenChange } = props;
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
          <div className="w-5 h-5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <SuiteIllustration suiteId={currentSuite.suiteId} className="w-full h-full text-primary" />
          </div>
          <div className="flex items-center gap-2">
            <LpdText size="sm" weight="bold" className="tracking-tight text-text-main dark:text-white">
              {currentSuite.suiteName}
            </LpdText>
            <LucideIcons.ChevronDown size={12} className="text-text-muted opacity-40" />
          </div>
        </button>
      }
    >
      <div className="flex flex-col w-[260px] bg-white dark:bg-surface-elevated">
        {/* Header Minimalista Estándar Lab */}
        <div className="p-4 pb-2 border-b border-border-technical bg-white dark:bg-surface-elevated">
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
                  <div className={`w-7 h-7 rounded bg-background-subtle dark:bg-white/5 flex items-center justify-center shrink-0 border border-border-technical relative`}>
                    <SuiteIllustration suiteId={suite.suiteId} className="w-4 h-4" />
                    {isDisabled && (
                      <div className="absolute -top-1 -right-1 bg-surface-elevated rounded-full p-0.5 border border-border-technical">
                        <LucideIcons.Lock size={8} className="text-text-muted" />
                      </div>
                    )}
                  </div>
                  <span className="flex-1 truncate text-technical">{suite.suiteName}</span>
                  {isDisabled && (
                    <span className="text-[8px] font-mono text-text-muted opacity-40 uppercase tracking-tighter">Plan_Locked</span>
                  )}
                </TechnicalMenuItem>
              </TechnicalTooltip>
            );
          })}
        </div>

        <div className="border-t border-border-technical">
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