import React from 'react';
import { useEmptyState } from './useEmptyState';
import { EmptyStateVisual, AIBracketVisual } from './components';
import { EmptyStateProps } from './types';
import { Icon } from '../..';
import { LpdText, Heading } from '../..';
import { AILoader } from '../..';

/**
 * @component EmptyState
 * @description Pantalla de estado vacío con estética técnica de laboratorio y soporte para IA.
 * @category Feedback
 * @subcategory Primitives
 * @phase 2
 */
export const EmptyState: React.FC<EmptyStateProps> = (props) => {
  const {
    icon = 'search_off',
    title,
    description,
    action,
    iconBadge,
    isLoading = false,
    loadingMessages = ['Analyzing system components...', 'Optimizing structure...']
  } = props;

  const { containerClasses, iconSize, isAI } = useEmptyState(props);

  return (
    <div className={containerClasses} role="status">
      
      {/* 1. Dynamic Background Patterns */}
      {isAI ? (
        // IA Pattern: Subtle purple dots (Neural feel)
        <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.1] pointer-events-none" 
             style={{ 
               backgroundImage: `radial-gradient(var(--lpd-color-innovation-purple) 0.8px, transparent 0.8px)`, 
               backgroundSize: '24px 24px' 
             }} 
        />
      ) : (
        // Standard Pattern: Blueprint grid (Architectural feel)
        props.variant === 'card' && (
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
               style={{ 
                 backgroundImage: `linear-gradient(to right, var(--lpd-color-brand-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--lpd-color-brand-primary) 1px, transparent 1px)`, 
                 backgroundSize: '40px 40px' 
               }} 
          />
        )
      )}

      {/* 2. Visual Anchor */}
      {isAI ? (
        <AIBracketVisual>
          <div className="bg-innovation-purple/10 p-6 rounded-full relative">
            <Icon name="auto_awesome" size={iconSize} className="text-innovation-purple" />
            <div className="absolute inset-0 border border-innovation-purple/20 rounded-full animate-ping opacity-20" />
          </div>
        </AIBracketVisual>
      ) : (
        <div className="relative">
          <EmptyStateVisual size={props.size}>
            <Icon name={icon} size={iconSize} />
          </EmptyStateVisual>
          
          {iconBadge && (
            <span className="absolute -top-1 -right-1 bg-energy text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white dark:border-surface-dark shadow-lg animate-bounce z-20">
              {iconBadge}
            </span>
          )}
        </div>
      )}

      {/* 3. Narrative Section */}
      <div className="relative z-10 max-w-sm space-y-3">
        <Heading 
          as="h3" 
          size={props.size === 'sm' ? 'xs' : 'md'}
          className={isAI ? 'text-innovation-purple' : ''}
        >
          {title}
        </Heading>
        
        {isLoading ? (
          <div className="py-4">
            <AILoader messages={loadingMessages} speed="fast" />
          </div>
        ) : (
                    <LpdText 
                      size="sm" 
                      variant="muted" 
                      className="max-w-xs mx-auto mb-10 leading-relaxed text-center"
                    >
                      {description}
                    </LpdText>        )}
      </div>

      {/* 4. Functional Section */}
      {action && !isLoading && (
        <div className="relative z-10 mt-10">
          {action}
        </div>
      )}
    </div>
  );
};