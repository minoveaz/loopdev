import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["@loopdev/ui", "@loopdev/contracts"],
  // Optimizaciones para ambientes con memoria limitada (Codespace 8GB)
  onDemandEntries: {
    maxInactiveAge: 25 * 1000, // Limpiar páginas no usadas más rápido
    pagesBufferLength: 2, // Reducir páginas en buffer
  },
  productionBrowserSourceMaps: false,
  compress: true,
};

export default nextConfig;

