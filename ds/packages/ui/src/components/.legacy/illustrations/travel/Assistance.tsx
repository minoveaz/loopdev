import React from 'react';
import { IllustrationBase, strokeLinejoin } from '../Base';

export const AssistanceIllustration: React.FC = () => (
  <IllustrationBase>
    <circle cx="200" cy="150" r="100" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.1" strokeWidth="4" fill="var(--lpd-color-bg-subtle)"/>
    <path d="M200 50C200 50 150 100 150 150C150 200 200 250 200 250" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.2" strokeWidth="4" fill="none"/>
    <path d="M200 50C200 50 250 100 250 150C250 200 200 250 200 250" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.2" strokeWidth="4" fill="none"/>
    <path d="M100 150H300" stroke="var(--lpd-color-brand-primary)" fillOpacity="0.2" strokeWidth="4"/>
    <path d="M130 180C130 180 150 250 250 220" stroke="var(--lpd-color-brand-secondary)" strokeWidth="3" strokeDasharray="8 8" fill="none"/>
    <g transform="translate(230, 190)">
        <path d="M20 0C9 0 0 9 0 20C0 35 20 50 20 50C20 50 40 35 40 20C40 9 31 0 20 0Z" fill="var(--lpd-color-brand-primary)"/>
        <circle cx="20" cy="20" r="8" fill="white"/>
    </g>
    <g transform="translate(280, 60)">
        <path d="M0 20L60 0L20 50L30 30L0 20Z" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth="3" strokeLinejoin={strokeLinejoin}/>
    </g>
    <g transform="translate(50, 200)">
        <rect x="10" y="10" width="60" height="50" rx="5" fill="var(--lpd-color-brand-secondary)"/>
        <path d="M25 10V0H55V10" stroke="var(--lpd-color-brand-secondary)" strokeWidth="4" fill="none"/>
        <circle cx="20" cy="60" r="5" fill="var(--lpd-color-bg-subtle)"/>
        <circle cx="60" cy="60" r="5" fill="var(--lpd-color-bg-subtle)"/>
        <circle cx="30" cy="30" r="8" fill="var(--lpd-color-brand-primary)"/>
        <rect x="45" y="25" width="15" height="10" fill="var(--lpd-color-brand-primary)" fillOpacity="0.2"/>
    </g>
  </IllustrationBase>
);
