import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  reactCompiler: true,
  turbopack: {
    root: path.join(__dirname, '../..'),
  },
  transpilePackages: ['@loopdev/ui', '@loopdev/contracts', '@loopdev/document-viewer'],
  // Optimizaciones para ambientes con memoria limitada (Codespace 8GB)
  onDemandEntries: {
    maxInactiveAge: 25 * 1000, // Limpiar páginas no usadas más rápido
    pagesBufferLength: 2, // Reducir páginas en buffer
  },
  productionBrowserSourceMaps: false,
  compress: true,
  staticPageGenerationTimeout: 120, // Más tiempo para páginas estáticas
};

export default nextConfig;
