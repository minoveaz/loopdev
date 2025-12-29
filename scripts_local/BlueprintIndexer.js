const fs = require('fs');
const path = require('path');

/**
 * 🏗️ Blueprint Indexer v3.0 "Discovery Engine"
 * Automates the analysis of legacy components to enable isolated sandboxing.
 */

const CONFIG = {
  sourceDir: path.join(__dirname, '../modules/mod-architect/src/blueprints'),
  outputFile: path.join(__dirname, '../modules/mod-architect/src/data/blueprint_registry.json'),
  auditOutputFile: path.join(__dirname, '../modules/mod-architect/src/data/analysis_results.json')
};

function getFiles(dir, files_ = []) {
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else if (name.endsWith('.tsx')) {
      files_.push(name);
    }
  }
  return files_;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath, '.tsx');
  const relativePath = path.relative(CONFIG.sourceDir, filePath);
  const pathParts = relativePath.split('/');
  
  // Extraer categoría (la primera carpeta)
  const category = pathParts.length > 1 ? pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1) : 'General';

  // Extraer Descripción del JSDoc con fallback más inteligente
  const descriptionMatch = content.match(/\* @description (.*)/) || content.match(/\/\/ (.*)/);
  let description = descriptionMatch ? descriptionMatch[1].trim() : '';
  
  if (!description || description.length < 3) {
    description = `Discovery blueprint from ${category} module.`;
  }

  // Nombre inteligente sin redundancia
  let cleanName = fileName;
  if (fileName === 'index' || fileName === 'components') {
    const parentName = pathParts.length > 1 ? pathParts[pathParts.length - 2] : category;
    cleanName = parentName; 
  }

  // Si después de la limpieza sigue habiendo posibles duplicados, añadir sufijo
  if (fileName === 'components') {
    cleanName = `${cleanName} (Parts)`;
  }

  // 1. Detección de Colores...
  const tailwindHexRegex = /(?:bg|text|border|from|to|via|outline|ring)-\[#([a-fA-F0-9]{3,6})\]/g;
  const rawHexRegex = /#([a-fA-F0-9]{3,6})/g;
  
  const foundColors = new Set();
  let match;
  
  while ((match = tailwindHexRegex.exec(content)) !== null) foundColors.add(`#${match[1].toUpperCase()}`);
  while ((match = rawHexRegex.exec(content)) !== null) foundColors.add(`#${match[1].toUpperCase()}`);

  const dependencies = {
    fonts: [],
    icons: []
  };
  
  if (content.includes('font-sans') || content.includes('font-display')) dependencies.fonts.push('Inter');
  if (content.includes('font-mono')) dependencies.fonts.push('JetBrains Mono');
  if (content.includes('material-symbols-outlined')) dependencies.icons.push('Material Symbols');
  if (content.includes('lucide')) dependencies.icons.push('Lucide React');

  const componentRegex = /export const ([A-Z][a-zA-Z0-9]+)/g;
  const exports = [];
  while ((match = componentRegex.exec(content)) !== null) exports.push(match[1]);

  const stats = {
    hardcodedColors: foundColors.size,
    inlineStyles: (content.match(/style={{/g) || []).length,
    legacyIconUsage: (content.match(/material-symbols-outlined/g) || []).length,
    complexityScore: (content.match(/<div/g) || []).length
  };

  return {
    id: fileName.toLowerCase().replace(/\s+/g, '-'),
    name: cleanName,
    category,
    description,
    filePath: relativePath,
    exports,
    dependencies,
    visualTokens: {
      colors: Array.from(foundColors)
    },
    audit: stats,
    status: stats.hardcodedColors > 5 ? 'high-debt' : 'stable'
  };
}

function main() {
  console.log('🚀 Starting Blueprint Indexer v3.0...');
  
  if (!fs.existsSync(CONFIG.sourceDir)) {
    console.error('❌ Source directory not found:', CONFIG.sourceDir);
    process.exit(1);
  }

  const files = getFiles(CONFIG.sourceDir);
  console.log(`[Indexer] Found ${files.length} potential blueprints.`);

  const registry = files.map(file => analyzeFile(file));

  // Guardar Registry para el Frontend
  fs.writeFileSync(CONFIG.outputFile, JSON.stringify(registry, null, 2));
  console.log(`✅ Registry generated with ${registry.length} entries at: ${CONFIG.outputFile}`);

  // Generar un resumen de auditoría global
  const summary = {
    timestamp: new Date().toISOString(),
    totalComponents: registry.length,
    totalIssues: registry.reduce((acc, curr) => acc + curr.audit.hardcodedColors + curr.audit.inlineStyles, 0),
    topDebtComponents: registry
      .sort((a, b) => b.audit.complexityScore - a.audit.complexityScore)
      .slice(0, 5)
      .map(c => ({ name: c.name, score: c.audit.complexityScore }))
  };

  fs.writeFileSync(CONFIG.outputFile.replace('registry.json', 'audit_summary.json'), JSON.stringify(summary, null, 2));
  console.log('📊 Audit summary updated.');
}

main();
