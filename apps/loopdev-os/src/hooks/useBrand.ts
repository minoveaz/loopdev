import { useContext } from 'react';
import { BrandContext, type BrandContextType } from '@/providers/BrandProvider';

export const useBrand = (): BrandContextType => {
  const context = useContext(BrandContext);
  if (!context) throw new Error('useBrand must be used within a BrandProvider');
  return context;
};
