import React from 'react';
import { Lock } from 'lucide-react';
import { BentoItem } from '@/components/organisms/BentoGrid';

export const BankSecurityCard = () => (
  <BentoItem 
    colSpan={2}
    title="Seguridad Bancaria"
    description="Tus datos están encriptados con los más altos estándares de la industria (AES-256)."
    icon={<Lock size={20}/>}
    variant="default"
  />
);
