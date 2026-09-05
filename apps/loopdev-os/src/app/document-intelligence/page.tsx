'use client';

import { useRouter } from 'next/navigation';
import { Button, Heading, TechnicalSurface } from '@loopdev/ui';

export default function DocumentIntelligenceHomePage() {
  const router = useRouter();

  return (
    <div className="bg-shell-canvas flex min-h-full flex-1 items-center justify-center p-6 sm:p-10">
      <TechnicalSurface
        variant="canvas"
        depth="flat"
        className="w-full max-w-3xl p-8 text-center sm:p-12"
      >
        <p className="text-primary text-lpd-xs font-semibold uppercase tracking-[0.18em]">
          Document Intelligence
        </p>
        <Heading as="h1" size="2xl" weight="semibold" className="text-text-main mt-3">
          Extracción inteligente de documentos
        </Heading>
        <p className="text-text-muted text-lpd-sm mx-auto mt-3 max-w-xl leading-relaxed">
          Flujo operativo para preparar documentos de identidad, ejecutar la extracción en servidor
          y revisar los campos antes de aprobar. Prototipo navegable guiado por fixtures.
        </p>
        <div className="mt-6 flex justify-center">
          <Button
            variant="primary"
            size="md"
            startIcon="document_scanner"
            onClick={() => router.push('/document-intelligence/new')}
          >
            Nueva extracción
          </Button>
        </div>
      </TechnicalSurface>
    </div>
  );
}
