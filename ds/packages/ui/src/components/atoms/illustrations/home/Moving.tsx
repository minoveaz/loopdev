import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinejoin } from '../Base';

export const MovingIllustration: React.FC = () => (
  <IllustrationBase>
    <rect x="50" y="260" width="300" height="10" fill="var(--lpd-color-brand-primary)" fillOpacity="0.2"/>
    <rect x="80" y="160" width="100" height="100" fill="var(--lpd-color-bg-subtle)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth}/>
    <path d="M80 160L130 130L180 160" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinejoin={strokeLinejoin}/>
    <path d="M130 130V260" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4}/>
    <rect x="190" y="180" width="80" height="80" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth}/>
    <path d="M190 180L230 150L270 180" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinejoin={strokeLinejoin}/>
    <path d="M230 180V260" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.2" strokeWidth={8}/>
  </IllustrationBase>
);
