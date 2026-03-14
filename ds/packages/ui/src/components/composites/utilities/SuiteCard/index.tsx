'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Heading, LpdText } from '../../../atoms';
import { EngineeringSeal } from '../../../atoms';
import { TechnicalSurface } from '../../../atoms';
import { SuiteCardProps } from './types';
import { useSuiteCard } from './useSuiteCard';

/**
 * @component SuiteCard
 * @description Componente compuesto para representar una Suite de aplicaciones con certificación técnica.
 * @category Composites
 * @phase 1
 */
export const SuiteCard: React.FC<SuiteCardProps> = (props) => {
  const { title, description, illustration, version, status, href, isLocked } = props;
  const { illustrationWrapperClasses, titleClasses } = useSuiteCard(props);

  const CardContent = (
    <TechnicalSurface 
      depth="raised" 
      withGrid 
      withHoverAura={!isLocked}
      className="h-full"
    >
      <div className="p-6 relative z-10 flex flex-col h-full">
        {/* Header: Sello y Estado */}
        <div className="flex justify-between items-start mb-8">
          <EngineeringSeal version={version} status={isLocked ? 'audit' : status || 'ready'} />
          {isLocked && (
            <div className="font-mono text-[10px] text-slate-400 dark:text-white/20 px-2 py-0.5 border border-black/5 dark:border-white/10 rounded">
              {`{ LOCKED }`}
            </div>
          )}
        </div>

        {/* Body: Ilustración y Textos */}
        <div className="flex-1">
          <div className={illustrationWrapperClasses}>
            <div className="w-full max-w-[160px] transform group-hover:scale-110 transition-transform duration-700">
              {illustration}
            </div>
          </div>
          
          <Heading size="lg" weight="bold" className={titleClasses}>
            {title}
          </Heading>
          
          <LpdText size="sm" className="text-text-muted leading-relaxed mb-8">
            {description}
          </LpdText>
        </div>

        {/* Footer: Status Pulse y Acción */}
        <div className="mt-auto pt-6 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isLocked ? 'bg-slate-300 dark:bg-white/10' : 'bg-energy-yellow animate-pulse'}`}></div>
            <LpdText size="nano" weight="black" className="font-mono uppercase tracking-[0.2em] text-text-muted">
              {isLocked ? 'Auth_Required' : 'System_Ready'}
            </LpdText>
          </div>
          {!isLocked && (
            <ArrowRight 
              size={18} 
              className="text-primary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300" 
            />
          )}
        </div>
      </div>
    </TechnicalSurface>
  );

  if (isLocked) return CardContent;

  return (
    <Link href={href} className="block h-full no-underline">
      {CardContent}
    </Link>
  );
};
