import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap, strokeLinejoin } from '../../../atoms';

export const HomeCoverIllustration: React.FC = () => (
  <IllustrationBase>
    <circle cx="200" cy="150" r="130" fill="var(--lpd-color-brand-primary)" fillOpacity="0.1"/>
    <path d="M80 140L200 40L320 140V260H80V140Z" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinejoin={strokeLinejoin}/>
    <path d="M170 260V180H230V260" fill="var(--lpd-color-bg-subtle)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth}/>
    <circle cx="200" cy="110" r="25" fill="var(--lpd-color-brand-primary)" fillOpacity="0.2" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth/2}/>
    <g transform="translate(240, 160)">
        <path d="M0 0H80V30C80 60 50 80 40 85C30 80 0 60 0 30V0Z" fill="var(--lpd-color-brand-primary)" stroke="white" strokeWidth="6"/>
        <path d="M25 40L35 50L55 30" stroke="white" strokeWidth="6" strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin}/>
    </g>
    <path d="M40 260C40 230 70 230 80 260" stroke="var(--lpd-color-brand-primary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap}/>
  </IllustrationBase>
);
