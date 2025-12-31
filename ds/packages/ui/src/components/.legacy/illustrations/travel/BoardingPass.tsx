import React from 'react';
import { IllustrationBase } from '../Base';

export const BoardingPassIllustration: React.FC = () => (
  <IllustrationBase>
    <path d="M50 100H280V200H50V100Z" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4}/>
    <path d="M280 100H350V200H280V100Z" fill="var(--lpd-color-brand-primary)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4}/>
    <line x1="280" y1="100" x2="280" y2="200" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4} strokeDasharray="8 8"/>
    <path d="M80 130L100 120L110 160L80 130Z" fill="var(--lpd-color-brand-secondary)"/>
    <line x1="80" y1="160" x2="200" y2="160" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.2" strokeWidth={8} strokeLinecap="round"/>
    <line x1="80" y1="180" x2="160" y2="180" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.2" strokeWidth={8} strokeLinecap="round"/>
    <path d="M300 120V180M310 120V180M320 120V180M330 120V180" stroke="white" strokeWidth={4}/>
  </IllustrationBase>
);
