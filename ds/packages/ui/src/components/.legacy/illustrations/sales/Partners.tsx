import React from 'react';
import { IllustrationBase, strokeLinecap, strokeLinejoin } from '../../../atoms';

export const PartnersIllustration: React.FC = () => (
  <IllustrationBase>
    <circle cx="200" cy="150" r="40" fill="var(--lpd-color-brand-primary)" stroke="white" strokeWidth={4}/>
    <circle cx="200" cy="150" r="20" fill="white"/>
    <path d="M200 110L200 60" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4} strokeLinecap={strokeLinecap}/>
    <path d="M235 170L280 200" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4} strokeLinecap={strokeLinecap}/>
    <path d="M165 170L120 200" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4} strokeLinecap={strokeLinecap}/>
    <circle cx="200" cy="40" r="25" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4}/>
    <rect x="270" y="190" width="50" height="50" rx="10" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4}/>
    <path d="M120 230L95 190L145 190L120 230Z" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4} strokeLinejoin={strokeLinejoin}/>
    <circle cx="200" cy="150" r="60" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.1" strokeWidth={2} strokeDasharray="8 8"/>
    <circle cx="200" cy="150" r="80" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.05" strokeWidth={1} strokeDasharray="4 4" opacity="0.5"/>
  </IllustrationBase>
);
