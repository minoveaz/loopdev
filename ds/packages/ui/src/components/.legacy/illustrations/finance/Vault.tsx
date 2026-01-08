import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap, strokeLinejoin } from '../../../atoms';

export const VaultIllustration: React.FC = () => (
  <IllustrationBase>
    <circle cx="200" cy="150" r="120" fill="var(--lpd-color-brand-primary)" fillOpacity="0.1"/>
    <rect x="130" y="140" width="140" height="110" rx="15" fill="var(--lpd-color-brand-secondary)" stroke="white" strokeWidth={4}/>
    <path d="M160 140V100C160 77.9086 177.909 60 200 60C222.091 60 240 77.9086 240 100V140" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap}/>
    <circle cx="200" cy="180" r="15" fill="white"/>
    <path d="M200 195V220" stroke="white" strokeWidth={6} strokeLinecap={strokeLinecap}/>
    <circle cx="280" cy="240" r="35" fill="var(--lpd-color-brand-primary)" stroke="white" strokeWidth={4}/>
    <path d="M265 240L275 250L295 230" stroke="white" strokeWidth={6} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin}/>
  </IllustrationBase>
);
