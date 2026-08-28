'use client';

import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { 
  TechnicalDropdown, 
  TechnicalDropdownItem,
  TechnicalDropdownSeparator,
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
              className="text-text-main group-hover:text-primary dark:text-white"
            >
              {currentSuite.suiteName}
            </LpdText>
            <LucideIcons.ChevronDown
              size={12}
              className="text-text-muted group-hover:text-primary opacity-40 transition-colors"
            />
          </div>
        </button>
      }
    >
      <div className="dark:bg-surface-elevated flex flex-col bg-white">
        <div className="flex flex-col">
          {availableSuites.map((suite) => {
            const isActive = suite.suiteId === currentSuite.suiteId;
            const isDisabled = accessMap[suite.suiteId] === 'disabled';

            return (
              <TechnicalTooltip 
                key={suite.suiteId}
                content={isDisabled ? "Esta suite no está incluida en tu plan actual" : undefined}
                side="right"
              >
                <TechnicalDropdownItem
                  isActive={isActive}
                  disabled={isDisabled}
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
                  <span className="flex-1 truncate">{suite.suiteName}</span>
                  {isDisabled && (
                    <span className="text-text-muted font-mono text-[8px] uppercase tracking-tighter opacity-40">Plan_Locked</span>
                  )}
                </TechnicalDropdownItem>
              </TechnicalTooltip>
            );
          })}
        </div>

        <TechnicalDropdownSeparator />
        <div>
          <TechnicalDropdownItem onClick={() => onSuiteChange('os.home')}>
            <LucideIcons.Home size={16} className="shrink-0" aria-hidden="true" />
            <span className="flex-1 truncate">Volver al Launchpad</span>
          </TechnicalDropdownItem>
        </div>
      </div>
    </TechnicalDropdown>
  );
};