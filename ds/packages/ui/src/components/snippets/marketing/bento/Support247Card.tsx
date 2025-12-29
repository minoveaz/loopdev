import React from 'react';
import { BentoItem } from '../../../../components/organisms/BentoGrid';

export const Support247Card = () => (
  <BentoItem 
    colSpan={1}
    title="Soporte 24/7"
    description="Siempre disponibles para resolver tus dudas."
    variant="image"
    visual={
      <img 
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110" 
        alt="Support" 
      />
    }
  />
);
