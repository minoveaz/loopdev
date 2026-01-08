import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinejoin } from '../../../atoms';

export const AdventureIllustration: React.FC = () => (
  <IllustrationBase>
    <circle cx="250" cy="80" r="30" fill="var(--lpd-color-brand-primary)" opacity="0.8"/>
    <path d="M50 250L130 100L210 250" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinejoin={strokeLinejoin}/>
    <path d="M160 250L240 120L320 250" fill="var(--lpd-color-bg-subtle)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinejoin={strokeLinejoin}/>
    <path d="M110 140L130 100L150 140L130 130L110 140Z" fill="var(--lpd-color-brand-primary)" fillOpacity="0.2"/>
    <path d="M220 150L240 120L260 150L240 140L220 150Z" fill="white"/>
  </IllustrationBase>
);
