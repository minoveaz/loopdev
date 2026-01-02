const fs = require('fs');
const path = require('path');

/**
 * 🏗️ Blueprint Indexer v3.3 "Smart Discovery"
 * Refined to exclude data files and focus on renderable components.
 */

const CONFIG = {
  sourceDir: path.join(__dirname, '../modules/mod-architect/src/blueprints'),
  outputFile: path.join(__dirname, '../modules/mod-architect/src/data/blueprint_registry.json')
};

function getFiles(dir, files_ = []) {
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = dir + '/' + files[i];
    // Ignorar carpetas que no contienen componentes renderizables
    if (name.includes('/data/') || name.includes('/utils/') || name.includes('/types')) continue;
    
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
  const category = pathParts.length > 1 ? pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1) : 'General';

  // 1. Detección de Componentes Reales (Exportados con Mayúscula)
  const componentRegex = /export const ([A-Z][a-zA-Z0-9]+)/g;
  const exports = [];
  let match;
  while ((match = componentRegex.exec(content)) !== null) exports.push(match[1]);

  // SI NO HAY EXPORTS DE COMPONENTES, IGNORAMOS EL ARCHIVO
  if (exports.length === 0 && !content.includes('export default')) return null;

  // 2. Limpieza de Nombres
  let cleanName = fileName;
  if (fileName === 'index' || fileName === 'components') {
    cleanName = pathParts[pathParts.length - 2]; 
  }
  if (fileName === 'components') cleanName = `${cleanName} (Parts)`;

  // 3. Descripción
  const descriptionMatch = content.match(/\* @description (.*)/);
  let description = descriptionMatch ? descriptionMatch[1].trim() : `Blueprint from ${category}`;

  // 4. Auditoría básica
  const hardcodedColors = [...new Set(content.match(/#[a-fA-F0-9]{3,6}/g) || [])];

  return {
    id: relativePath.replace(/[\/\.]/g, '-').toLowerCase(),
    name: cleanName,
    category,
    description,
    filePath: relativePath,
    exports,
    audit: {
      hardcodedColors: hardcodedColors.length,
      inlineStyles: (content.match(/style={{/g) || []).length
    },
    status: hardcodedColors.length > 5 ? 'high-debt' : 'stable'
  };
}

function main() {
  console.log('🚀 Starting Smart Indexer v3.3...');
  const files = getFiles(CONFIG.sourceDir);
  const registry = files.map(file => analyzeFile(file)).filter(Boolean);

  fs.writeFileSync(CONFIG.outputFile, JSON.stringify(registry, null, 2));
  console.log(`✅ Clean Registry generated: ${registry.length} renderable components.`);
}

main();