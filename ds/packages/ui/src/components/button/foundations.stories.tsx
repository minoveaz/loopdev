import React from 'react';
import { Button } from './button';

export default {
  title: 'Design System/Foundations',
};

export const TypographyAndColors = () => (
  <div className="space-y-8 p-8 max-w-2xl bg-brand-surface rounded-xl border border-brand-outline">
    <section className="space-y-2">
      <h1 className="text-4xl font-heading">Encabezado H1 (Poppins/Montserrat)</h1>
      <p className="text-lg text-text-body font-body">
        Este es un cuerpo de texto usando <span className="font-bold">Inter / Plus Jakarta</span>. 
        La lectura debe ser fluida y clara para interfaces de usuario y lectura larga.
      </p>
    </section>

    <section className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-brand-primary text-text-on-primary rounded-lg">
        Brand Primary
      </div>
      <div className="p-4 bg-brand-secondary text-white rounded-lg">
        Brand Secondary
      </div>
      <div className="p-4 bg-brand-pastel-1 text-brand-primary rounded-lg font-medium">
        Brand Pastel 1
      </div>
      <div className="p-4 bg-brand-pastel-2 text-brand-secondary rounded-lg font-medium">
        Brand Pastel 2
      </div>
    </section>

    <section className="flex gap-4">
      <Button variant="default">Button Primary</Button>
      <Button variant="outline">Button Outline</Button>
    </section>
  </div>
);
