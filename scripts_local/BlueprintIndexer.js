const fs = require('fs');
const path = require('path');

/**
 * Blueprint Indexer v2.0
 * Analyzes source files to identify components and structural zones.
 */

function analyzeBlueprint(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const zones = [];
  
  // 1. Detectar Componentes Exportados (Regex para export const Name = ...)
  const componentRegex = /export const ([A-Z][a-zA-Z0-9]+)/g;
  const components = [];
  let match;
  while ((match = componentRegex.exec(content)) !== null) {
    components.push(match[1]);
  }

  // 2. Detectar Zonas Estructurales
  if (content.includes('w-[48px]') || content.includes('Nav Rail')) zones.push({ id: 'nav-rail', name: 'Navigation Rail' });
  if (content.includes('h-[64px]') || content.includes('Header')) zones.push({ id: 'header', name: 'Sidebar Header' });
  if (content.includes('overflow-y-auto') || content.includes('Body')) zones.push({ id: 'body', name: 'Scrollable Body' });

  // 3. Detectar Antipatrones
  const legacyIcons = (content.match(/material-symbols-outlined/g) || []).length;
  const inlineStyles = (content.match(/style={{/g) || []).length;
  const hardcodedColors = [...new Set(content.match(/#[a-fA-F0-9]{3,6}/g) || [])];

  return {
    componentName: path.basename(filePath, '.tsx'),
    filePath: path.relative(path.join(__dirname, '../../'), filePath),
    detectedComponents: components,
    zones,
    stats: {
      legacyIcons,
      inlineStyles,
      colorIssues: hardcodedColors.length
    },
    hardcodedColors
  };
}

const sourcePath = path.join(__dirname, '../../mock-loopdev/components/layout/ActivitySidebar.tsx');
const analysis = analyzeBlueprint(sourcePath);

console.log('✅ ANÁLISIS V2 COMPLETADO:');
console.log(JSON.stringify(analysis, null, 2));

// Guardar para el módulo Architect
const outputPath = path.join(__dirname, '../modules/mod-architect/src/data/analysis_v2.json');
fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));