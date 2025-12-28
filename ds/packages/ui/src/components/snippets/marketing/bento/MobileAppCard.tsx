import React from 'react';
import { Smartphone } from 'lucide-react';
import { BentoItem } from '@/components/organisms/BentoGrid';

export const MobileAppCard = () => (
  <BentoItem 
    title="App Móvil"
    description="Lleva toda la gestión de tu marca en el bolsillo."
    icon={<Smartphone size={20}/>}
  />
);
