import React from 'react';
import { IllustrationBase, strokeWidth, strokeLinecap } from '../../../atoms';

export const MedicalAttentionIllustration: React.FC = () => (
  <IllustrationBase>
    <circle cx="200" cy="150" r="120" fill="var(--lpd-color-brand-primary)" fillOpacity="0.1"/>
    <path d="M200 130C222.091 130 240 112.091 240 90C240 67.9086 222.091 50 200 50C177.909 50 160 67.9086 160 90C160 112.091 177.909 130 200 130Z" fill="white" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth}/>
    <path d="M120 250C120 205.817 155.817 170 200 170C244.183 170 280 205.817 280 250" stroke="var(--lpd-color-brand-secondary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap}/>
    <path d="M200 170V200C200 216.569 213.431 230 230 230H250" stroke="var(--lpd-color-brand-primary)" strokeWidth={strokeWidth} strokeLinecap={strokeLinecap}/>
    <circle cx="260" cy="230" r="15" fill="var(--lpd-color-brand-primary)"/>
  </IllustrationBase>
);
