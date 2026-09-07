import path from 'node:path';
import type { NextConfig } from 'next';

const isVisualCertification = process.env.NEXT_PUBLIC_VISUAL_CERTIFICATION === 'true';
const isDevelopment = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  /* config options here */
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  devIndicators: isVisualCertification ? false : undefined,
  // The compiler is intentionally kept for production, but compiling every
  // route during local navigation makes the Webpack feedback loop much slower.
  reactCompiler: !isDevelopment,
  experimental: {
    // Both packages expose large barrel entrypoints. Keep the public API while
    // resolving only the named modules used by each route.
    optimizePackageImports: ['@loopdev/ui', 'lucide-react'],
  },
  turbopack: {
    root: path.join(__dirname, '../..'),
  },
  transpilePackages: ['@loopdev/ui', '@loopdev/contracts', '@loopdev/document-viewer'],
  // Optimizaciones para ambientes con memoria limitada (Codespace 8GB)
  onDemandEntries: {
    maxInactiveAge: 5 * 60 * 1000, // Keep recently visited routes warm during local development
    pagesBufferLength: 12, // CRM navigation spans several independent route entrypoints
  },
  productionBrowserSourceMaps: false,
  compress: true,
  staticPageGenerationTimeout: 120, // Más tiempo para páginas estáticas
};

export default nextConfig;
