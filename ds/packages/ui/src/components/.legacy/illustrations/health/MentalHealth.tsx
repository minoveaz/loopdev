import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap } from '../../../atoms';

export const MentalHealthIllustration: React.FC = () => (
  <IllustrationBase>
    <circle cx="200" cy="150" r="110" fill="var(--lpd-color-bg-subtle)" fillOpacity="0.5"/>
    <path d="M150 250V180C150 140 160 120 160 100C160 70 180 50 210 50C250 50 260 80 260 110V140" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap}/>
    <path d="M260 140C270 140 280 150 280 160C280 170 270 180 260 180V250" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap}/>
    <path d="M210 150V200" stroke="var(--lpd-color-brand-primary)" strokeWidth={6} strokeLinecap={strokeLinecap}/>
    <path d="M210 180C210 180 230 170 230 150C230 150 210 150 210 180Z" fill="var(--lpd-color-brand-primary)" fillOpacity="0.2" stroke="var(--lpd-color-brand-primary)" strokeWidth={4}/>
    <path d="M210 170C210 170 190 160 190 140C190 140 210 140 210 170Z" fill="var(--lpd-color-brand-primary)" fillOpacity="0.2" stroke="var(--lpd-color-brand-primary)" strokeWidth={4}/>
  </IllustrationBase>
);
