import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap, strokeLinejoin } from '../../../atoms';

export const BikeIllustration: React.FC = () => (
  <IllustrationBase>
    <circle cx="100" cy="200" r="40" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} fill="none"/>
    <circle cx="300" cy="200" r="40" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} fill="none"/>
    <path d="M100 200L170 100H260L300 200" stroke="var(--lpd-color-brand-primary)" strokeWidth={6} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} fill="none"/>
    <path d="M170 100L140 200" stroke="var(--lpd-color-brand-primary)" strokeWidth={6} strokeLinecap={strokeLinecap}/>
    <path d="M160 100V80H180" stroke="var(--lpd-color-brand-secondary)" strokeWidth={6} strokeLinecap={strokeLinecap}/>
    <path d="M260 100L250 70H280" stroke="var(--lpd-color-brand-secondary)" strokeWidth={6} strokeLinecap={strokeLinecap}/>
    <path d="M50 240H350" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.2" strokeWidth={4} strokeLinecap={strokeLinecap}/>
  </IllustrationBase>
);
