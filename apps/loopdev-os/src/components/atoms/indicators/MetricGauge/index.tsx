/**
 * @file index.tsx
 * @description Body: MetricGauge visual component (SVG gauge for RSI)
 * 
 * Displays a circular gauge with:
 * - Background zones (oversold/neutral/overbought)
 * - Animated needle
 * - Current value in center
 * - Status indicator
 */

'use client';

import React from 'react';
import { useMetricGauge } from './useMetricGauge';
import { MetricGaugeProps } from './types';

export const MetricGauge: React.FC<MetricGaugeProps> = (props) => {
  const {
    value,
    label = 'RSI',
    unit = '',
    lowThreshold = 30,
    highThreshold = 70,
  } = props;

  const {
    normalizedValue,
    percentage,
    rotation,
    color,
    sizes,
    isStatic,
    className,
  } = useMetricGauge(props);

  // SVG circle properties
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  // Zone calculations for background arcs
  const lowThresholdPercent = lowThreshold / 100;
  const highThresholdPercent = highThreshold / 100;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-label={`${label}: ${normalizedValue} ${unit}`}
    >
      {/* SVG Gauge */}
      <div style={{ width: sizes.container, height: sizes.container }}>
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-border-technical opacity-20"
          />

          {/* Oversold zone (0-30): Red */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={`${circumference * lowThresholdPercent} ${circumference}`}
            strokeLinecap="round"
            className="text-red-500 opacity-40"
            style={{ transform: 'rotate(-135deg)', transformOrigin: '60px 60px' }}
          />

          {/* Neutral zone (30-70): Green */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={`${circumference * (highThresholdPercent - lowThresholdPercent)} ${circumference}`}
            strokeDashoffset={-circumference * lowThresholdPercent}
            strokeLinecap="round"
            className="text-green-500 opacity-40"
            style={{ transform: 'rotate(-135deg)', transformOrigin: '60px 60px' }}
          />

          {/* Overbought zone (70-100): Purple */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={`${circumference * (1 - highThresholdPercent)} ${circumference}`}
            strokeDashoffset={-circumference * highThresholdPercent}
            strokeLinecap="round"
            className="text-purple-500 opacity-40"
            style={{ transform: 'rotate(-135deg)', transformOrigin: '60px 60px' }}
          />

          {/* Active indicator (filled arc) */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={`${circumference * (percentage / 100)} ${circumference}`}
            strokeLinecap="round"
            className={`text-gradient bg-clip-text ${color} transition-all duration-500`}
            style={{
              transform: 'rotate(-135deg)',
              transformOrigin: '60px 60px',
              fill: 'transparent',
            }}
          />

          {/* Needle pointer */}
          <g transform={`rotate(${rotation} 60 60)`}>
            {/* Needle line */}
            <line
              x1="60"
              y1="60"
              x2="60"
              y2="15"
              stroke="currentColor"
              strokeWidth="2"
              className={`text-primary transition-transform ${isStatic ? '' : 'duration-300'}`}
            />

            {/* Needle circle */}
            <circle
              cx="60"
              cy="60"
              r="4"
              fill="currentColor"
              className="text-primary"
            />
          </g>

          {/* Center value display */}
          <text
            x="60"
            y="65"
            textAnchor="middle"
            className="text-primary font-mono font-bold"
            fontSize="18"
          >
            {normalizedValue.toFixed(1)}
          </text>

          {/* Unit label */}
          {unit && (
            <text
              x="60"
              y="80"
              textAnchor="middle"
              className="text-primary-light text-xs opacity-70"
              fontSize="10"
            >
              {unit}
            </text>
          )}
        </svg>
      </div>

      {/* Label below gauge */}
      {label && (
        <div className="flex flex-col items-center gap-1">
          <p className="text-technical font-medium text-primary">{label}</p>
          <p className="text-nano text-primary-light opacity-70">
            {percentage.toFixed(0)}% of range
          </p>
        </div>
      )}

      {/* Status indicator */}
      <div className="flex items-center gap-1.5">
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{
            backgroundColor: props.status === 'oversold' ? '#ef4444' : 
                            props.status === 'overbought' ? '#a855f7' : 
                            '#10b981'
          }}
        />
        <span className="text-nano text-primary-light capitalize">
          {props.status || 'neutral'}
        </span>
      </div>
    </div>
  );
};

export default MetricGauge;
