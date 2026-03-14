import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap, strokeLinejoin } from '../../../atoms';

export const FamilyIllustration: React.FC = () => (
  <IllustrationBase>
    <path d="M50 250H350" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.2" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap}/>
    <circle cx="140" cy="120" r="30" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth}/>
    <path d="M140 150V250" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth}/>
    <path d="M110 200L140 160L170 200" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin}/>
    <circle cx="260" cy="110" r="30" fill="white" stroke="var(--lpd-color-brand-primary)" strokeWidth={strokeWidth}/>
    <path d="M260 140V250" stroke="var(--lpd-color-brand-primary)" strokeWidth={strokeWidth}/>
    <path d="M230 190L260 150L290 190" stroke="var(--lpd-color-brand-primary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin}/>
    <circle cx="200" cy="180" r="20" fill="var(--lpd-color-bg-subtle)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth}/>
    <path d="M200 200V250" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth}/>
    <path d="M200 60C200 60 210 50 220 60C230 70 200 90 200 90C200 90 170 70 180 60C190 50 200 60 200 60Z" fill="var(--lpd-color-brand-primary)" />
  </IllustrationBase>
);
