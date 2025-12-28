import React from 'react';
import { IllustrationBase, strokeLinecap } from '../Base';

export const TheftIllustration: React.FC = () => (
  <IllustrationBase>
    <circle cx="200" cy="150" r="100" fill="var(--lpd-color-bg-subtle)" />
    <path d="M120 140C120 120 140 110 160 110H240C260 110 280 120 280 140C280 160 260 170 240 170H160C140 170 120 160 120 140Z" fill="var(--lpd-color-brand-secondary)"/>
    <ellipse cx="170" cy="140" rx="15" ry="10" fill="white"/>
    <ellipse cx="230" cy="140" rx="15" ry="10" fill="white"/>
    <path d="M280 130L320 110M280 150L320 170" stroke="var(--lpd-color-brand-secondary)" strokeWidth={6} strokeLinecap={strokeLinecap}/>
    <path d="M100 250L130 220L80 200" fill="var(--lpd-color-brand-primary)"/>
    <path d="M130 220L300 80" stroke="var(--lpd-color-brand-primary)" strokeWidth={4} strokeDasharray="8 8" opacity="0.5"/>
  </IllustrationBase>
);
