import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap, strokeLinejoin } from '../../../atoms';

export const SmartHomeIllustration: React.FC = () => (
  <IllustrationBase>
    <path d="M100 150L200 60L300 150V260H100V150Z" fill="var(--lpd-color-bg-subtle)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinejoin={strokeLinejoin}/>
    <path d="M170 120C170 120 185 100 200 100C215 100 230 120 230 120" stroke="var(--lpd-color-brand-primary)" strokeWidth={6} strokeLinecap={strokeLinecap}/>
    <path d="M150 140C150 140 175 110 200 110C225 110 250 140 250 140" stroke="var(--lpd-color-brand-primary)" strokeWidth={6} strokeLinecap={strokeLinecap}/>
    <rect x="130" y="180" width="40" height="60" rx="5" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4}/>
    <circle cx="250" cy="210" r="20" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4}/>
    <circle cx="250" cy="210" r="8" fill="var(--lpd-color-brand-primary)" fillOpacity="0.2"/>
  </IllustrationBase>
);
