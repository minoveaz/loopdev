'use client';

import { Heading, TechnicalSurface } from '@loopdev/ui';

export default function SalesCrmHomePage() {
  return (
    <div className="bg-shell-canvas flex min-h-full flex-1 items-center justify-center p-6 sm:p-10">
      <TechnicalSurface
        variant="canvas"
        depth="flat"
        className="w-full max-w-3xl p-8 text-center sm:p-12"
      >
        <p className="text-primary text-lpd-xs font-semibold uppercase tracking-[0.18em]">
          Sales &amp; CRM
        </p>
        <Heading as="h1" size="2xl" weight="semibold" className="text-text-main mt-3">
          Tu espacio comercial
        </Heading>
        <p className="text-text-muted mx-auto mt-3 max-w-xl text-lpd-sm leading-relaxed">
          Selecciona un módulo en la navegación para comenzar. La suite se está preparando con los
          flujos autorizados de Contactos, Leads, Pipeline y Tareas.
        </p>
      </TechnicalSurface>
    </div>
  );
}
