import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap, strokeLinejoin } from '../Base';

export const DealIllustration: React.FC = () => (
  <IllustrationBase>
    <rect x="100" y="50" width="140" height="180" rx="5" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth}/>
    <line x1="130" y1="90" x2="210" y2="90" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.2" strokeWidth={6} strokeLinecap="round"/>
    <line x1="130" y1="120" x2="210" y2="120" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.2" strokeWidth={6} strokeLinecap="round"/>
    <line x1="130" y1="190" x2="210" y2="190" stroke="var(--lpd-color-brand-secondary)" strokeWidth={2}/>
    <path d="M140 180C150 170 160 190 170 180C180 170 190 185 200 180" stroke="var(--lpd-color-brand-primary)" strokeWidth={3} strokeLinecap={strokeLinecap} fill="none"/>
    <path d="M220 220L260 140L280 150L240 230" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4}/>
    <path d="M220 220L210 240" stroke="var(--lpd-color-brand-secondary)" strokeWidth={2}/>
    <circle cx="280" cy="240" r="30" fill="var(--lpd-color-brand-primary)" fillOpacity="0.1" stroke="var(--lpd-color-brand-primary)" strokeWidth={4}/>
    <path d="M265 240L275 250L295 230" stroke="var(--lpd-color-brand-primary)" strokeWidth={4} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin}/>
  </IllustrationBase>
);
