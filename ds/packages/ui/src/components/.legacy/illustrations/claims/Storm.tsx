import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap, strokeLinejoin } from '../../../atoms';

export const StormIllustration: React.FC = () => (
  <IllustrationBase>
    <path d="M100 140C80 140 60 120 60 100C60 70 90 50 120 60C130 30 170 20 200 40C230 20 270 30 280 60C310 50 340 70 340 100C340 130 320 140 300 140H100Z" fill="var(--lpd-color-brand-secondary)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinejoin={strokeLinejoin}/>
    <path d="M180 140L160 200H200L180 260" stroke="var(--lpd-color-brand-primary)" strokeWidth={6} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} fill="none"/>
    <line x1="120" y1="160" x2="110" y2="190" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.2" strokeWidth={4} strokeLinecap="round"/>
    <line x1="260" y1="160" x2="250" y2="190" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.2" strokeWidth={4} strokeLinecap="round"/>
    <line x1="290" y1="150" x2="280" y2="180" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.2" strokeWidth={4} strokeLinecap="round"/>
  </IllustrationBase>
);
