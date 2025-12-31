import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap, strokeLinejoin } from '../Base';

export const PreventionIllustration: React.FC = () => (
  <IllustrationBase>
    <rect x="50" y="50" width="300" height="200" rx="20" fill="var(--lpd-color-bg-subtle)" fillOpacity="0.5"/>
    <path d="M160 150C160 180 180 200 200 200C220 200 240 180 240 150C240 120 220 110 200 130C180 110 160 120 160 150Z" stroke="var(--lpd-color-brand-primary)" strokeWidth={strokeWidth} fill="white"/>
    <path d="M200 130V110" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap}/>
    <path d="M200 110C210 100 220 100 220 110" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap}/>
    <circle cx="280" cy="220" r="40" fill="var(--lpd-color-brand-primary)" fillOpacity="0.1" stroke="white" strokeWidth={4}/>
    <path d="M265 215L275 225L295 205" stroke="var(--lpd-color-brand-secondary)" strokeWidth={6} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin}/>
  </IllustrationBase>
);
