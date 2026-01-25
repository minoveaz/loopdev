'use client';

import React from 'react';
import { LogoAsset } from '@loopdev/contracts';
import { LpdText } from '@loopdev/ui';

interface LogoScaleTestProps {
  logo: LogoAsset;
}

/**
 * @component LogoScaleTest
 * @description Accessibility tool to verify logo legibility at small sizes.
 */
export const LogoScaleTest: React.FC<LogoScaleTestProps> = ({ logo }) => {
  const scales = [
    { size: 64, label: '64px' },
    { size: 32, label: '32px' },
    { size: 16, label: '16px' },
  ];

  return (
    <div className="flex flex-col gap-6 p-8 rounded-3xl bg-background-surface border border-border-technical items-center justify-center">
      <div className="flex items-center gap-12">
        {scales.map((scale) => (
          <div key={scale.label} className="flex flex-col items-center gap-3">
            <div 
              className="bg-white rounded-lg border border-border-technical flex items-center justify-center overflow-hidden"
              style={{ width: `${scale.size}px`, height: `${scale.size}px` }}
            >
              {logo.rawSvg ? (
                <div 
                  className="w-full h-full p-[15%] text-black fill-black"
                  dangerouslySetInnerHTML={{ __html: logo.rawSvg }} 
                />
              ) : (
                <img 
                  src={logo.url} 
                  alt={`${scale.label} scale`} 
                  className="w-full h-full object-contain p-[15%]"
                />
              )}
            </div>
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-tighter">
              {scale.label}
            </span>
          </div>
        ))}
      </div>
      <div className="text-center">
        <LpdText size="xs" weight="bold" className="text-text-main">Scale Integrity Check</LpdText>
        <LpdText size="nano" className="text-text-muted mt-1 italic">
          Verify symbol recognition at favicon and micro-header sizes.
        </LpdText>
      </div>
    </div>
  );
};
