'use client';

import React, { useId } from 'react';

export const InfinityPath: React.FC<{ duration: string }> = ({ duration }) => {
  const gradientId = useId();

  // Geometría exacta de un símbolo de infinito (Lemniscata)
  const pathData = "M31.5,50c-8.5,0-15.5-7-15.5-15.5S23,19,31.5,19c5.2,0,9.8,2.5,12.5,6.5L56,43.5c2.7,4,7.3,6.5,12.5,6.5c8.5,0,15.5-7,15.5-15.5S77,19,68.5,19c-5.2,0-9.8,2.5-12.5,6.5L44,43.5C41.3,47.5,36.7,50,31.5,50z";
  
  // Longitud aproximada del path calculado
  const pathLength = 245; 
  // Longitud del segmento visible (la "cometa")
  const dashLength = 70;
  // Espacio vacío entre cometas (el resto del path)
  const gapLength = pathLength - dashLength;

  return (
    <svg 
      viewBox="0 0 100 69"
      className="w-full h-full overflow-visible"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" className="text-primary" stopColor="currentColor" />
          <stop offset="100%" className="text-energy" stopColor="currentColor" />
        </linearGradient>
      </defs>

      {/* Trazo Base (Ghost) */}
      <path 
        d={pathData} 
        stroke="currentColor" 
        strokeWidth="6" 
        strokeLinecap="round"
        className="text-slate-200 dark:text-white/10"
      />

      {/* Trazo Animado (Momentum) */}
      <path 
        d={pathData} 
        stroke={`url(#${gradientId})`} 
        strokeWidth="6" 
        strokeLinecap="round"
        // Definimos explícitamente la longitud del path para que CSS pueda calcular porcentajes si fuera necesario,
        // pero aquí usamos valores absolutos para control total.
        pathLength={pathLength}
        strokeDasharray={`${dashLength} ${gapLength}`}
        style={{
          animation: `infinity-flow ${duration} linear infinite`
        }}
      />

      <style>
        {`
          @keyframes infinity-flow {
            from { stroke-dashoffset: ${pathLength}; }
            to { stroke-dashoffset: 0; }
          }
        `}
      </style>
    </svg>
  );
};