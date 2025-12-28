import React from 'react';
import { Globe } from 'lucide-react';
import { BentoItem } from '@/components/organisms/BentoGrid';

export const GlobalCoverageCard = () => (
  <BentoItem 
    title="Cobertura Global"
    description="Protección en más de 140 países para ti y tu equipo."
    icon={<Globe size={20}/>}
    visual={
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/world-map.png')] mix-blend-overlay" />
    }
  />
);
