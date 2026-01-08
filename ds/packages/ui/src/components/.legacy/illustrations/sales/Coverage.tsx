import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap, strokeLinejoin } from '../../../atoms';

export const CoverageIllustration: React.FC = () => (
  <IllustrationBase>
    <path d="M200 40C250 40 290 60 300 100V160C300 220 260 260 200 280C140 260 100 220 100 160V100C110 60 150 40 200 40Z" fill="var(--lpd-color-brand-primary)" fillOpacity="0.1" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth}/>
    <path d="M200 70C230 70 250 80 260 110V160C260 200 230 230 200 240C170 230 140 200 140 160V110C150 80 170 70 200 70Z" fill="white" stroke="var(--lpd-color-brand-primary)" strokeWidth={4}/>
    <path d="M175 160L195 180L230 140" stroke="var(--lpd-color-brand-primary)" strokeWidth={8} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin}/>
    <ellipse cx="200" cy="270" rx="80" ry="10" fill="var(--lpd-color-bg-subtle)" opacity="0.5"/>
  </IllustrationBase>
);
