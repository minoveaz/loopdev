import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinejoin } from '../Base';

export const CarIllustration: React.FC = () => (
  <IllustrationBase>
    <circle cx="200" cy="150" r="120" fill="var(--lpd-color-brand-primary)" fillOpacity="0.1"/>
    <path d="M60 170L80 130H140L160 110H240L280 130H320C331.046 130 340 138.954 340 150V200H60V170Z" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinejoin={strokeLinejoin}/>
    <path d="M160 110L140 130H90L75 160" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4} strokeLinecap="round" fill="none"/>
    <path d="M240 110L280 130" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4} strokeLinecap="round"/>
    <circle cx="120" cy="200" r="25" fill="var(--lpd-color-bg-subtle)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth}/>
    <circle cx="120" cy="200" r="10" fill="var(--lpd-color-brand-secondary)"/>
    <circle cx="280" cy="200" r="25" fill="var(--lpd-color-bg-subtle)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth}/>
    <circle cx="280" cy="200" r="10" fill="var(--lpd-color-brand-secondary)"/>
    <path d="M340 160L380 150M340 170L380 180" stroke="var(--lpd-color-brand-primary)" strokeWidth={4} strokeLinecap="round" opacity="0.6"/>
  </IllustrationBase>
);
