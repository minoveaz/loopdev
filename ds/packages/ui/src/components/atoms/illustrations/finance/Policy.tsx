import React from 'react';
import { IllustrationBase, strokeWidth } from '../Base';

export const PolicyIllustration: React.FC = () => (
  <IllustrationBase>
    <rect x="120" y="40" width="160" height="220" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth}/>
    <line x1="150" y1="80" x2="250" y2="80" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.2" strokeWidth={8} strokeLinecap="round"/>
    <line x1="150" y1="110" x2="230" y2="110" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.2" strokeWidth={8} strokeLinecap="round"/>
    <line x1="150" y1="140" x2="250" y2="140" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.2" strokeWidth={8} strokeLinecap="round"/>
    <circle cx="240" cy="220" r="25" fill="var(--lpd-color-brand-primary)" stroke="white" strokeWidth={4}/>
    <path d="M240 220L220 250H260L240 220Z" fill="var(--lpd-color-brand-secondary)"/>
  </IllustrationBase>
);
