import React from 'react';
import { IllustrationBase, strokeLinejoin } from '../../../atoms';

export const AccidentIllustration: React.FC = () => (
  <IllustrationBase>
    <path d="M40 180H120L140 140H80L40 180Z" fill="var(--lpd-color-bg-subtle)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4}/>
    <circle cx="80" cy="180" r="15" fill="var(--lpd-color-brand-secondary)"/>
    <path d="M360 180H280L260 140H320L360 180Z" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4}/>
    <circle cx="320" cy="180" r="15" fill="var(--lpd-color-brand-secondary)"/>
    <path d="M200 120L210 150L240 140L220 170L250 190L210 200L200 230L190 200L150 190L180 170L160 140L190 150L200 120Z" fill="var(--lpd-color-brand-primary)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4} strokeLinejoin={strokeLinejoin}/>
    <circle cx="180" cy="100" r="4" fill="var(--lpd-color-brand-secondary)"/>
    <circle cx="230" cy="90" r="6" fill="var(--lpd-color-brand-secondary)"/>
    <path d="M200 80L210 90" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4}/>
  </IllustrationBase>
);
