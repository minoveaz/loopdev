import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap, strokeLinejoin } from '../../../atoms';

export const MarketIllustration: React.FC = () => (
  <IllustrationBase>
    <rect x="50" y="50" width="300" height="200" rx="10" fill="white" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.1" strokeWidth={4}/>
    <line x1="50" y1="150" x2="350" y2="150" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.2" strokeWidth={2} strokeDasharray="10 10"/>
    <line x1="50" y1="100" x2="350" y2="100" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.2" strokeWidth={2} strokeDasharray="10 10"/>
    <line x1="50" y1="200" x2="350" y2="200" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.2" strokeWidth={2} strokeDasharray="10 10"/>
    <path d="M80 200L140 160L200 190L260 100L320 80" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} fill="none"/>
    <circle cx="320" cy="80" r="8" fill="var(--lpd-color-brand-primary)" stroke="white" strokeWidth={2}/>
    <g transform="translate(280, 180)">
        <rect x="0" y="30" width="40" height="12" rx="3" fill="var(--lpd-color-brand-primary)"/>
        <rect x="0" y="15" width="40" height="12" rx="3" fill="var(--lpd-color-brand-primary)"/>
        <rect x="0" y="0" width="40" height="12" rx="3" fill="var(--lpd-color-brand-primary)"/>
    </g>
    <g transform="translate(70, 60)">
        <circle cx="30" cy="30" r="30" fill="var(--lpd-color-brand-primary)" fillOpacity="0.1" stroke="var(--lpd-color-brand-primary)" strokeWidth={4}/>
        <path d="M30 15V45" stroke="var(--lpd-color-brand-primary)" strokeWidth={4} strokeLinecap={strokeLinecap}/>
        <path d="M22 20C22 20 42 20 42 27.5C42 35 22 35 22 42.5C22 50 42 50 42 50" stroke="var(--lpd-color-brand-primary)" strokeWidth={4} strokeLinecap={strokeLinecap}/>
    </g>
  </IllustrationBase>
);
