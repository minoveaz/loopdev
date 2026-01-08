import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap } from '../../../atoms';

export const KeysIllustration: React.FC = () => (
  <IllustrationBase>
    <rect x="160" y="80" width="80" height="120" rx="30" fill="var(--lpd-color-bg-subtle)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth}/>
    <circle cx="200" cy="120" r="10" fill="var(--lpd-color-brand-primary)"/>
    <circle cx="200" cy="155" r="10" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={2}/>
    <circle cx="200" cy="70" r="20" stroke="var(--lpd-color-brand-secondary)" strokeWidth={6} fill="none"/>
    <path d="M200 200V260" stroke="var(--lpd-color-brand-secondary)" strokeWidth={8} strokeLinecap={strokeLinecap}/>
    <path d="M200 240H220" stroke="var(--lpd-color-brand-secondary)" strokeWidth={6} strokeLinecap={strokeLinecap}/>
    <path d="M200 255H220" stroke="var(--lpd-color-brand-secondary)" strokeWidth={6} strokeLinecap={strokeLinecap}/>
  </IllustrationBase>
);
