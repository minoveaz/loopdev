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
        <div className="empty-state-ai-pattern absolute inset-0 pointer-events-none" />
      ) : (
        // Standard Pattern: Blueprint grid (Architectural feel)
        props.variant === 'card' && (
          <div className="empty-state-grid-pattern absolute inset-0 pointer-events-none" />
        )
      )}

      {/* 2. Visual Anchor */}
      {isAI ? (
        <AIBracketVisual>
          <div className="bg-primary-subtle p-6 rounded-full relative">
            <Icon name="auto_awesome" size={iconSize} className="text-primary" />
            <div className="absolute inset-0 border border-primary/20 rounded-full animate-ping opacity-20" />
          </div>
        </AIBracketVisual>
      ) : (
        <div className="relative">
          <EmptyStateVisual size={props.size}>
            <Icon name={icon} size={iconSize} />
          </EmptyStateVisual>
          
          {iconBadge && (
            <span className="absolute -top-1 -right-1 bg-energy text-text-base text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-surface-elevated shadow-lg animate-bounce z-20">
              {iconBadge}
            </span>
          )}
        </div>
      )}

      {/* 3. Narrative Section */}
      <div className="relative z-10 max-w-sm space-y-3">
        <Heading 
          as="h3" 
          size={props.size === 'sm' ? 'xs' : 'base'}
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
                      className="max-w-xs mx-auto mb-10 leading-relaxed text-center text-text-muted"
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