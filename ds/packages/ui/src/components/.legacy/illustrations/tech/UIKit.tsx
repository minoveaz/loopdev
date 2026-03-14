import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap, strokeLinejoin } from '../../../atoms';

export const UIKitIllustration: React.FC = () => (
  <IllustrationBase>
    {/* Main Board / Canvas */}
    <rect x="60" y="40" width="280" height="220" rx="15" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinejoin={strokeLinejoin}/>
    
    {/* Sidebar */}
    <path d="M60 55C60 46.7157 66.7157 40 75 40H110V260H75C66.7157 260 60 253.284 60 245V55Z" fill="var(--lpd-color-bg-subtle)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth}/>
    <line x1="85" y1="80" x2="85" y2="220" stroke="var(--lpd-color-brand-secondary)" strokeWidth={4} strokeLinecap={strokeLinecap} strokeDasharray="0 20"/>

    {/* Color Palette Section */}
    <g transform="translate(140, 70)">
        <circle cx="20" cy="20" r="15" fill="var(--lpd-color-brand-primary)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={2}/>
        <circle cx="60" cy="20" r="15" fill="var(--lpd-color-brand-secondary)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={2}/>
        <circle cx="100" cy="20" r="15" fill="var(--lpd-color-bg-subtle)" stroke="var(--lpd-color-brand-secondary)" strokeWidth={2}/>
    </g>

    {/* Typography Section */}
    <path d="M140 120H240" stroke="var(--lpd-color-brand-secondary)" strokeWidth={6} strokeLinecap={strokeLinecap}/>
    <path d="M140 140H280" stroke="var(--lpd-color-bg-subtle)" strokeWidth={4} strokeLinecap={strokeLinecap}/>
    <path d="M140 155H260" stroke="var(--lpd-color-bg-subtle)" strokeWidth={4} strokeLinecap={strokeLinecap}/>

    {/* Components Section */}
    <g transform="translate(140, 190)">
        {/* Button Primary */}
        <rect x="0" y="0" width="80" height="30" rx="8" fill="var(--lpd-color-brand-primary)"/>
        {/* Button Secondary */}
        <rect x="90" y="0" width="80" height="30" rx="8" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={3}/>
    </g>

    {/* Floating Element (Brush/Tool) */}
    <circle cx="300" cy="230" r="40" fill="var(--lpd-color-bg-subtle)" fillOpacity="0.5" />
    <path d="M280 250L320 210" stroke="var(--lpd-color-brand-primary)" strokeWidth={6} strokeLinecap={strokeLinecap}/>
    <path d="M320 210L310 200" stroke="var(--lpd-color-brand-primary)" strokeWidth={6} strokeLinecap={strokeLinecap}/>
  </IllustrationBase>
);
