import React from 'react';
import { IllustrationBase } from '../Base';

export const PassportIllustration: React.FC = () => (
  <IllustrationBase>
    <rect x="140" y="60" width="120" height="160" rx="10" fill="var(--lpd-color-brand-secondary)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4}/>
    <line x1="145" y1="60" x2="145" y2="220" stroke="white" strokeWidth={4} strokeOpacity="0.2"/>
    <circle cx="200" cy="120" r="25" stroke="white" strokeWidth={4}/>
    <path d="M200 95V145" stroke="white" strokeWidth={2}/>
    <path d="M175 120H225" stroke="white" strokeWidth={2}/>
    <line x1="170" y1="160" x2="230" y2="160" stroke="white" strokeWidth={6} strokeLinecap="round"/>
    <rect x="160" y="40" width="80" height="40" fill="var(--lpd-color-brand-primary)" transform="rotate(-10 160 40)" opacity="0.8"/>
  </IllustrationBase>
);
