import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinejoin } from '../../../atoms';

export const CloudIllustration: React.FC = () => (
  <IllustrationBase>
    <path 
      d="M120 180C100 180 80 160 80 140C80 120 100 100 120 100C130 70 160 50 200 50C240 50 270 70 280 100C300 100 320 120 320 140C320 160 300 180 280 180H120Z" 
      fill="var(--lpd-color-bg-subtle)" 
      stroke="var(--lpd-color-brand-secondary)" 
      strokeWidth={strokeWidth} 
      strokeLinejoin={strokeLinejoin}
    />
    <g transform="translate(170, 100)">
        <path d="M30 10C40 10 50 20 50 30" stroke="var(--lpd-color-brand-primary)" strokeWidth={4} strokeLinecap="round"/>
        <path d="M50 30L45 20M50 30L60 25" stroke="var(--lpd-color-brand-primary)" strokeWidth={4} strokeLinecap="round"/>
        <path d="M30 50C20 50 10 40 10 30" stroke="var(--lpd-color-brand-primary)" strokeWidth={4} strokeLinecap="round"/>
        <path d="M10 30L5 40M10 30L20 35" stroke="var(--lpd-color-brand-primary)" strokeWidth={4} strokeLinecap="round"/>
    </g>
  </IllustrationBase>
);
