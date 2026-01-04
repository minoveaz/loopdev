#!/usr/bin/env node

/**
 * Token Synchronization Validator
 * ================================
 * 
 * Verifica que los tokens tipográficos estén sincronizados en todos los puntos del sistema:
 * 1. CSS Variables (typography.css) - Source of Truth
 * 2. Tailwind Config (tailwind.preset.js) - fontSize + safelist
 * 3. Tailwind Merge Config (cn.ts) - classGroups
 * 4. TypeScript Types (types.ts) - TypographySize
 * 
 * Uso:
 *   node scripts/validate-tokens-sync.js
 *   pnpm validate:tokens
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const PATHS = {
  css: path.join(__dirname, '../ds/packages/tokens/src/foundations/typography.css'),
  tailwindPreset: path.join(__dirname, '../ds/packages/tailwind-config/tailwind.preset.js'),
  cn: path.join(__dirname, '../ds/packages/ui/src/helpers/cn.ts'),
  types: path.join(__dirname, '../ds/packages/ui/src/components/atoms/Typography/types.ts'),
};

// Extraer tamaños de cada archivo
function extractTypographySizes() {
  const results = {
    css: [],
    tailwindFontSize: [],
    tailwindSafelist: [],
    cnClassGroups: [],
    types: [],
  };

  try {
    // 1. CSS Variables
    const cssContent = fs.readFileSync(PATHS.css, 'utf-8');
    const cssMatches = cssContent.matchAll(/--lpd-font-size-(\w+)/g);
    results.css = Array.from(cssMatches, m => m[1]).sort();

    // 2. Tailwind fontSize config
    const tailwindContent = fs.readFileSync(PATHS.tailwindPreset, 'utf-8');
    const fontSizeMatches = tailwindContent.matchAll(/'lpd-(\w+)':\s*'var\(--lpd-font-size-/g);
    results.tailwindFontSize = Array.from(fontSizeMatches, m => m[1]).sort();

    // 3. Tailwind safelist
    const safelistMatches = tailwindContent.matchAll(/'text-lpd-(\w+)'/g);
    results.tailwindSafelist = Array.from(safelistMatches, m => m[1]).sort();

    // 4. cn.ts classGroups
    const cnContent = fs.readFileSync(PATHS.cn, 'utf-8');
    const cnMatches = cnContent.matchAll(/'text-lpd-(\w+)'/g);
    results.cnClassGroups = Array.from(cnMatches, m => m[1]).sort();

    // 5. TypeScript types
    const typesContent = fs.readFileSync(PATHS.types, 'utf-8');
    // Buscar solo en el bloque de TypographySize
    const sizeTypeMatch = typesContent.match(/export type TypographySize\s*=([^;]+);/s);
    if (sizeTypeMatch) {
      const sizeBlock = sizeTypeMatch[1];
      const typeMatches = sizeBlock.matchAll(/'(\w+)'/g);
      results.types = Array.from(typeMatches, m => m[1]).sort();
    }

  } catch (error) {
    console.error(chalk.red('❌ Error reading files:'), error.message);
    process.exit(1);
  }

  return results;
}

// Comparar arrays
function compareArrays(arr1, arr2) {
  const missing = arr1.filter(x => !arr2.includes(x));
  const extra = arr2.filter(x => !arr1.includes(x));
  return { missing, extra };
}

// Validar sincronización
function validateSync() {
  console.log(chalk.cyan('\n🔍 Validando sincronización de tokens tipográficos...\n'));

  const sizes = extractTypographySizes();
  const source = sizes.css; // Source of Truth
  
  let hasErrors = false;

  // Validar cada archivo contra el source
  const validations = [
    { name: 'Tailwind fontSize', data: sizes.tailwindFontSize },
    { name: 'Tailwind safelist', data: sizes.tailwindSafelist },
    { name: 'cn.ts classGroups', data: sizes.cnClassGroups },
    { name: 'TypeScript types', data: sizes.types },
  ];

  console.log(chalk.bold('📦 Source of Truth (typography.css):'));
  console.log(chalk.green(`   ${source.join(', ')}\n`));

  validations.forEach(({ name, data }) => {
    const { missing, extra } = compareArrays(source, data);
    
    if (missing.length === 0 && extra.length === 0) {
      console.log(chalk.green(`✅ ${name}: Sincronizado`));
    } else {
      hasErrors = true;
      console.log(chalk.red(`❌ ${name}: Desincronizado`));
      
      if (missing.length > 0) {
        console.log(chalk.yellow(`   Faltantes: ${missing.join(', ')}`));
      }
      if (extra.length > 0) {
        console.log(chalk.yellow(`   Extras: ${extra.join(', ')}`));
      }
    }
  });

  console.log('\n' + chalk.gray('─'.repeat(60)) + '\n');

  if (hasErrors) {
    console.log(chalk.red('❌ Validación fallida: Los tokens no están sincronizados\n'));
    console.log(chalk.yellow('💡 Para corregir, actualiza los siguientes archivos:\n'));
    console.log(chalk.gray('   1. ds/packages/tailwind-config/tailwind.preset.js'));
    console.log(chalk.gray('   2. ds/packages/ui/src/helpers/cn.ts'));
    console.log(chalk.gray('   3. ds/packages/ui/src/components/atoms/Typography/types.ts\n'));
    process.exit(1);
  } else {
    console.log(chalk.green('✅ Todos los tokens están sincronizados correctamente\n'));
    process.exit(0);
  }
}

// Ejecutar validación
validateSync();
