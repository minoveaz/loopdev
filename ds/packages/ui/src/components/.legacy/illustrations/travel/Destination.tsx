import React from 'react';
import { IllustrationBase, strokeLinejoin } from '../Base';

export const DestinationIllustration: React.FC = () => (
  <IllustrationBase>
    <path d="M60 100L140 80V220L60 240V100Z" fill="var(--lpd-color-bg-subtle)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4} strokeLinejoin={strokeLinejoin}/>
    <path d="M140 80L240 100V240L140 220V80Z" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4} strokeLinejoin={strokeLinejoin}/>
    <path d="M240 100L340 80V220L240 240V100Z" fill="var(--lpd-color-bg-subtle)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4} strokeLinejoin={strokeLinejoin}/>
    <path d="M100 150C100 150 180 180 220 160C260 140 300 160 300 160" stroke="var(--lpd-color-brand-primary)" strokeWidth={4} strokeDasharray="8 8" fill="none"/>
    <circle cx="100" cy="150" r="8" fill="var(--lpd-color-brand-secondary)"/>
    <g transform="translate(290, 140)">
       <path d="M10 0C4.5 0 0 4.5 0 10C0 17.5 10 25 10 25C10 25 20 17.5 20 10C20 4.5 15.5 0 10 0Z" fill="var(--lpd-color-brand-primary)"/>
       <circle cx="10" cy="10" r="4" fill="white"/>
    </g>
  </IllustrationBase>
);
