import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap, strokeLinejoin } from '../../../atoms';

export const DentalIllustration: React.FC = () => (
  <IllustrationBase>
    <path d="M200 50L250 100L200 150L150 100L200 50Z" fill="var(--lpd-color-brand-primary)" fillOpacity="0.1"/>
    <path d="M140 100C140 70 160 50 200 50C240 50 260 70 260 100C260 140 260 150 250 180L240 240C235 250 220 250 215 230L200 200L185 230C180 250 165 250 160 240L150 180C140 150 140 140 140 100Z" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinejoin={strokeLinejoin}/>
    <path d="M260 50L270 40M280 60L290 70M285 45L255 75" stroke="var(--lpd-color-brand-primary)" strokeWidth={4} strokeLinecap={strokeLinecap}/>
  </IllustrationBase>
);
