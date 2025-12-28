import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap, strokeLinejoin } from '../Base';

export const SupportIllustration: React.FC = () => (
  <IllustrationBase>
    <path 
      d="M80 80H280C291.046 80 300 88.9543 300 100V200C300 211.046 291.046 220 280 220H120L80 260V100C80 88.9543 88.9543 80 100 80Z" 
      fill="white" 
      stroke="var(--lpd-color-brand-secondary)" 
      strokeWidth={strokeWidth} 
      strokeLinejoin={strokeLinejoin}
    />
    <g transform="translate(160, 120)">
        <path d="M10 20V10C10 4.47715 14.4772 0 20 0H40C45.5228 0 50 4.47715 50 10V20" stroke="var(--lpd-color-brand-primary)" strokeWidth={4}/>
        <rect x="0" y="20" width="15" height="20" rx="5" fill="var(--lpd-color-brand-secondary)"/>
        <rect x="45" y="20" width="15" height="20" rx="5" fill="var(--lpd-color-brand-secondary)"/>
        <path d="M50 40V45C50 50 40 50 40 50H20" stroke="var(--lpd-color-brand-primary)" strokeWidth={4} strokeLinecap={strokeLinecap}/>
    </g>
  </IllustrationBase>
);
