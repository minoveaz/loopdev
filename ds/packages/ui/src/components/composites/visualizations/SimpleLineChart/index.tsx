'use client';

import React, { useMemo } from 'react';
import { SimpleLineChartProps } from './types';
import { cn } from '../../../../helpers/cn';

/**
 * @component SimpleLineChart
 * @description Industrial SVG-based visualization for time-series data.
 * Features automated path calculation and branding integration.
 * @category Composites/Visualizations
 */
export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  data,
  color = 'var(--lpd-color-brand-primary)',
  withGrid = true,
  isLive = false,
  children,
  className,
  viewBoxHeight = 200
}) => {
  
  // 1. Calculate SVG Path Data
  // Normalizes data points to fit in 1000 width and viewBoxHeight
  const { pathData, areaData, lastPoint } = useMemo(() => {
    if (!data.length) return { pathData: '', areaData: '', lastPoint: { x: 0, y: 0 } };

    const width = 1000;
    const stepX = width / (data.length - 1 || 1);
    
    // Find min and max for scaling
    const maxVal = Math.max(...data);
    const minVal = Math.min(...data);
    const range = maxVal - minVal || 1;

    const points = data.map((val, i) => {
      const x = i * stepX;
      // Invert Y because SVG coordinates start from top
      // We add a 10% margin top and bottom (20px each for 200 height)
      const margin = viewBoxHeight * 0.1;
      const effectiveHeight = viewBoxHeight - (margin * 2);
      const y = viewBoxHeight - margin - ((val - minVal) / range) * effectiveHeight;
      return { x, y };
    });

    const path = `M${points.map(p => `${p.x},${p.y}`).join(' L')}`;
    const area = `${path} L${width},${viewBoxHeight} L0,${viewBoxHeight} Z`;
    
    return {
      pathData: path,
      areaData: area,
      lastPoint: points[points.length - 1]
    };
  }, [data, viewBoxHeight]);

  const uniqueId = useMemo(() => `grad-${Math.random().toString(36).substr(2, 9)}`, []);

  return (
    <div className={cn("w-full h-full relative overflow-hidden bg-transparent", className)}>
      
      {/* 1. Background Grid Lines (Horizontal) */}
      {withGrid && (
        <div className="absolute inset-0 flex flex-col justify-between opacity-[0.05] pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-full h-px bg-slate-400"></div>
          ))}
        </div>
      )}

      {/* 2. The Main Chart SVG */}
      <svg 
        viewBox={`0 0 1000 ${viewBoxHeight}`} 
        className="w-full h-full block" 
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={uniqueId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Gradient Area */}
        <path 
          d={areaData} 
          fill={`url(#${uniqueId})`} 
          className="transition-all duration-700"
        />

        {/* Main Line */}
        <path 
          d={pathData} 
          fill="none" 
          stroke={color} 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="drop-shadow-[0_0_10px_rgba(109,94,249,0.4)] transition-all duration-700"
        />

        {/* Pulsing "Live" Point */}
        {isLive && data.length > 0 && (
          <circle cx={lastPoint.x} cy={lastPoint.y} r="5" fill={color}>
             <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
             <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>

      {/* 3. Labels Overlay Slot */}
      {children && (
        <div className="absolute inset-0 pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
};
