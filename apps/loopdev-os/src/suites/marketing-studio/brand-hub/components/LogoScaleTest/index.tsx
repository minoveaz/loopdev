'use client';

import React from 'react';
import Image from 'next/image';
import { LogoAsset } from '@loopdev/contracts';
import { Heading, LpdText } from '@loopdev/ui';

interface LogoScaleTestProps {
  logo: LogoAsset;
  logoNode?: React.ReactNode;
}

/**
 * @component LogoScaleTest
 * @description Accessibility tool to verify logo legibility at small sizes.
 */
export const LogoScaleTest: React.FC<LogoScaleTestProps> = ({ logo, logoNode }) => {
  const scales = [
    { size: 64, label: '64px' },
    { size: 32, label: '32px' },
    { size: 16, label: '16px' },
  ];

  return (
    <div className="bg-background-surface border-border-technical flex flex-col items-center justify-center gap-6 rounded-3xl border p-8">
      <div className="flex items-center gap-12">
        {scales.map((scale) => (
          <div key={scale.label} className="flex flex-col items-center gap-3">
            <div
              className="border-border-technical relative flex items-center justify-center overflow-hidden rounded-lg border bg-white"
              style={{ width: `${scale.size}px`, height: `${scale.size}px` }}
            >
              {logoNode || logo.rawSvg ? (
                logoNode || (
                  <div
                    className="h-full w-full fill-black p-[15%] text-black"
                    dangerouslySetInnerHTML={{ __html: logo.rawSvg ?? '' }}
                  />
                )
              ) : logo.url ? (
                <Image
                  src={logo.url}
                  alt={`${scale.label} scale`}
                  fill
                  unoptimized
                  sizes={`${scale.size}px`}
                  className="h-full w-full object-contain p-[15%]"
                />
              ) : null}
            </div>
            <span className="text-text-muted font-mono text-[10px] uppercase tracking-tighter">
              {scale.label}
            </span>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Heading as="h3" size="sm" weight="bold" className="text-text-main">
          Scale Integrity Check
        </Heading>
        <LpdText size="nano" className="text-text-muted mt-1 italic">
          Verify symbol recognition at favicon and micro-header sizes.
        </LpdText>
      </div>
    </div>
  );
};
