import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap } from '../Base';

export const WaterLeakIllustration: React.FC = () => (
  <IllustrationBase>
    <rect x="50" y="50" width="300" height="200" rx="10" fill="var(--lpd-color-bg-subtle)" fillOpacity="0.5"/>
    <path d="M50 120H150C161.046 120 170 128.954 170 140V250" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap}/>
    <path d="M170 140V120H350" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap}/>
    <path d="M170 140L160 160" stroke="var(--lpd-color-brand-primary)" strokeWidth={4} strokeLinecap={strokeLinecap}/>
    <path d="M170 140L180 155" stroke="var(--lpd-color-brand-primary)" strokeWidth={4} strokeLinecap={strokeLinecap}/>
    <circle cx="165" cy="180" r="5" fill="var(--lpd-color-brand-primary)"/>
    <circle cx="175" cy="200" r="7" fill="var(--lpd-color-brand-primary)"/>
    <circle cx="170" cy="230" r="6" fill="var(--lpd-color-brand-primary)"/>
    <ellipse cx="170" cy="260" rx="40" ry="10" fill="var(--lpd-color-brand-primary)" fillOpacity="0.1" />
  </IllustrationBase>
);
