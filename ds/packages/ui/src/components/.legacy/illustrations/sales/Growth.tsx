import React from 'react';
import { IllustrationBase, strokeLinecap } from '../../../atoms';

export const GrowthIllustration: React.FC = () => (
  <IllustrationBase>
    <path d="M60 260H340" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4} strokeLinecap={strokeLinecap}/>
    <path d="M60 260V60" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4} strokeLinecap={strokeLinecap}/>
    <rect x="90" y="180" width="40" height="80" rx="4" fill="var(--lpd-color-brand-primary)" fillOpacity="0.2"/>
    <rect x="150" y="140" width="40" height="120" rx="4" fill="var(--lpd-color-brand-primary)" fillOpacity="0.2"/>
    <rect x="210" y="100" width="40" height="160" rx="4" fill="var(--lpd-color-brand-primary)"/>
    <rect x="270" y="60" width="40" height="200" rx="4" fill="var(--lpd-color-brand-secondary)"/>
    <path d="M90 170L150 130L210 90L290 50" stroke="var(--lpd-color-brand-primary)" strokeWidth={4} strokeDasharray="8 4" fill="none"/>
    <circle cx="290" cy="50" r="6" fill="white" stroke="var(--lpd-color-brand-primary)" strokeWidth={2}/>
  </IllustrationBase>
);
