import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap } from '../../../atoms';

export const PiggyBankIllustration: React.FC = () => (
  <IllustrationBase>
    <path d="M130 250V200" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap}/>
    <path d="M230 250V200" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap}/>
    <ellipse cx="180" cy="160" rx="90" ry="70" fill="var(--lpd-color-bg-subtle)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth}/>
    <circle cx="250" cy="150" r="30" fill="var(--lpd-color-brand-primary)" fillOpacity="0.2" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth}/>
    <circle cx="245" cy="150" r="3" fill="var(--lpd-color-brand-secondary)"/>
    <circle cx="260" cy="150" r="3" fill="var(--lpd-color-brand-secondary)"/>
    <path d="M180 90L200 110" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap}/>
    <circle cx="180" cy="60" r="15" fill="var(--lpd-color-brand-primary)" />
    <path d="M180 90V110" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4} strokeLinecap={strokeLinecap}/>
  </IllustrationBase>
);
