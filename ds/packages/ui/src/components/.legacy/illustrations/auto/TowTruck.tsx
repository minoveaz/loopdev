import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap } from '../Base';

export const TowTruckIllustration: React.FC = () => (
  <IllustrationBase>
    <path d="M50 200H150V140L120 110H50V200Z" fill="var(--lpd-color-bg-subtle)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth}/>
    <path d="M50 160H120" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4}/>
    <circle cx="100" cy="200" r="20" fill="var(--lpd-color-brand-secondary)"/>
    <path d="M150 180L250 80" stroke="var(--lpd-color-brand-secondary)" strokeWidth={8} strokeLinecap={strokeLinecap}/>
    <path d="M250 80V120" stroke="var(--lpd-color-brand-primary)" strokeWidth={6}/>
    <path d="M240 120C240 135 260 135 260 120" stroke="var(--lpd-color-brand-primary)" strokeWidth={6} fill="none"/>
    <path d="M220 160L240 140H280L300 160H220Z" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4} strokeDasharray="8 8" fill="none" transform="rotate(-15 260 150)"/>
  </IllustrationBase>
);
